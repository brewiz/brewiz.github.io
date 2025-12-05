---
description: Slash-command prompt to parse Homebrew `brew info` output and update `data/packages.yaml` safely and idempotently.
scope: repository
usage: |
  Trigger: `/update` followed by one or more Homebrew `brew info` blocks (plaintext). The agent MUST consider any optional $ARGUMENTS passed alongside the command.
  Primary goal: produce a validated, ready-to-apply YAML fragment and a small sync report describing exactly where and how to insert or update entries in `data/packages.yaml`.
---

Quick-start TL;DR
=================
- Collect `/update` input → split into individual `brew info` blocks.
- For each block → parse fields → visit homepage (new packages) → enrich desc/info.
- Choose category & tags using repo heuristics → detect duplicates respecting `mode`.
- Emit ordered YAML node per package → lint formatting → assemble action/report/commit sections.
- Return the three-section response (`{{ACTION}}`, `{{REPORT}}`, `{{COMMIT}}`).

 How to Apply the Update
 =======================
 
 1. Review the `{{ACTION}}` block:
    - If no entries are marked `REVIEW_REQUIRED`, apply the changes directly to `data/packages.yaml` and commit using the suggested message.
    - If any entries are marked `REVIEW_REQUIRED`, review the category/tag alternatives provided. Edit the payload as needed, then apply.
 
 2. For ambiguous entries:
    - Confirm the correct category/tag with a maintainer, or select one of the suggested alternatives.
    - Once resolved, update the payload and proceed with the patch.
 
 3. Update the Brewiz package list as follows:
    1. Add the following package to the most appropriate existing category, using the provided Homebrew info
    2. Ensure the package is placed in the best-fitting existing category (e.g., "Text Processing & Publishing" or "Development Utilities").
    3. Use the style and metadata format consistent with the rest of the file.
    4. Prefer assigning to existing categories; avoid creating new categories unless absolutely necessary.
    5. Assign tags by preferring already existing tags from the file; avoid creating new tags unless absolutely necessary.
    6. Do not duplicate packages if they already exist.
    7. Always take `info` from the package homepage or trusted Copilot knowledge. Prefer the homepage when available; if the homepage cannot be reached, use trusted local knowledge (Copilot knowledge) or formula metadata as a fallback. 

3. Apply the patch:
   - Use your editor or a script to insert/update the YAML nodes in `data/packages.yaml` as specified.
   - Commit the changes using the suggested commit message.

4. Update any UI/docs referencing category lists if categories are changed.

Helper script
-------------

We include a helper script at `.brewiz/bin/packages-updater` that can apply an `{{ACTION}}` payload
to `data/packages.yaml` deterministically. Usage:

```sh
# apply from a file
.
.brewiz/bin/packages-updater -a action.yaml

# or pipe the `{{ACTION}}` block into the script
cat action.yaml | .brewiz/bin/packages-updater
```

YAML validation notes
---------------------

The helper script now performs a YAML syntax validation step after writing `data/packages.yaml` using Ruby's
YAML. If the validation fails the script will abort and
preserve the previous file contents. This protects the repository from accidental invalid YAML being written by
automated updates.

Behavior when creating categories/tags
-------------------------------------

- If the payload requires creating new categories or tags, the script will prompt interactively
   for confirmation and provide up to 3 suggested alternatives with scores (1-4). Use `--allow-create`
   to skip prompts and allow creation in non-interactive runs. The agent must not create categories/tags
   automatically without either an explicit `--allow-create` flag or interactive approval.

Overview
========
This prompt defines the exact algorithm and output format for the `/update` slash command used to update the Brewiz package list (`data/packages.yaml`). The agent receiving this prompt will:

- Parse one or more Homebrew formula/cask blocks (the text returned by `brew info` or `formulae.brew.sh` API).  
- For each package block, produce a best-effort YAML representation matching the repository's existing package schema.  
- Decide the best-fitting category and tags using existing categories/tags in `data/packages.yaml`.  
- Detect duplicates and decide whether to INSERT (new) or UPDATE (existing).  
- Produce a small Sync Impact Report and a suggested commit message.

Canonical YAML schema reference
===============================
YAML nodes MUST follow this ordering and shape:

```yaml
- name: string                           # required; display name
   desc: string                           # required; one-line summary from `brew info` command
   homepage: https://example.com          # required; canonical project URL
   id: homebrew/[core|cask]/formula-name  # required; normalized Homebrew id
   tags: [tag-a, tag-b, tag-c]            # required; 3–6 existing tags
   cask: true                             # optional; omit when false/not a cask
   license: SPDX-ID                       # optional when unknown
   info: >-                               # required; 2–4 sentence summary
      Long-form narrative, never add provenance note.
```

Notes:
- Keep two-space indentation, no tabs, and inline arrays for `tags`.
- Place `info` last to preserve readability in diffs.
 - Provenance formatting: when `info` is sourced from an external homepage/repo, never add provenance note to the `info` block.

Preconditions / Inputs
----------------------

1. The command input can be:
   - **Preferred**: Plaintext from `brew info <package>` (compact, human-readable)
   - **Supported**: JSON from `brew info --json=v2 <package>` (structured, parsing-safe)
   The agent should auto-detect the format and parse accordingly.
2. Optional $ARGUMENTS may include explicit category, tags, idempotency mode (`insert-only` vs `upsert`), or `visit_homepage: true`.

Execution flow (strict, step-by-step)
-------------------------------------

1) Normalize input
   - Split the input into independent package blocks. Typical separators: a blank line followed by "==> <name>:" or a line matching /^==>\s+\w+:/.
   - Trim and canonicalize whitespace and line endings.

2) For each package block, extract structured fields
   - Required fields to parse (if present): formula/cask name, stable version, status (Installed / Not installed), short description, homepage URL, license, options, caveats, source URL (From: ...), analytics (30/90/365 day installs), id (prefer `homebrew/core/<name>` or `homebrew/cask/<name>` when the `From:` line includes the repo), bottle status, and whether it's a cask (if `cask` / `Cask` or cask-like URL is present).
   - Field semantics (MANDATORY):
     * `desc`: a concise one-line summary used for lists and UI thumbnails (<=120 characters). This should directly reflect the formula's short description or the project's tagline.
     * `info`: a longer human-friendly block (2–4 sentences) synthesized from the package homepage, README, or other authoritative sources. The agent MUST prefer the homepage content and rephrase/summarize; do not paste long verbatim blocks.
   - If parsing fails for a specific optional field, set it to null or omit it in output (do NOT leave bracket tokens).

3) Category selection (heuristic)
   - **Context optimization**: Extract only the list of unique category names and tag names from `data/packages.yaml` first. Do NOT load the entire file content into working memory unless needed for precedent search.
   - Precedent Check (highest priority):
     * For each package being categorized, search for 1-3 existing packages with:
       - Overlapping tags (e.g., if new package has tag "3d-printing", search for existing packages with "3d" or "design")
       - Similar name patterns (substring matches)
       - Related functionality keywords
     * If semantically similar packages found, prefer their category. Example: "Orca Slicer" shares "3d-printing" with "OpenSCAD" → assign to OpenSCAD's category (Media & Design)
     * Mark confidence level: **HIGH**
   - Use this priority to choose category:
     a) Existing package precedent → confidence: **HIGH** (semantically similar packages in same category)
     b) User-provided explicit category via $ARGUMENTS → confidence: **HIGH**
     c) Apply deterministic keyword heuristics—match on formula name, description, and homepage contents with expanded domain patterns → confidence: **MEDIUM**
     d) If no strong match, assign `uncategorized` and set `review_required: true` with alternatives → confidence: **LOW**
   - **EXPANDED HEURISTIC TABLE (new domain-specific patterns):**
     | Signal                                                 | Preferred category          | Suggested tags                     |
     | ------------------------------------------------------ | --------------------------- | ---------------------------------- |
     | Contains "cli", "command", "shell", "terminal"         | `command-line`              | `command-line`, `terminal`, `shell`|
     | Mentions "library", "sdk", specific language names     | `development` or language-specific | `development`, `<language>` |
     | Provides packaging or brew automation tooling          | `package-management`        | `packaging`, `automation`          |
     | Desktop/macOS apps (GUI, productivity, browsers)       | `applications` or `browsers`| `productivity`, `macos`            |
     | Networking/servers/cloud keywords                      | `networking` or `infrastructure` | `network`, `cloud`          |
     | Documentation generators/static site tooling           | `documentation` or `web`    | `documentation`, `static-sites`    |
     | **3D modeling, CAD, slicing, design-focused tools**    | **`media` or `graphics`**   | **`design`, `3d`, `graphics`**     |
     | **WordPress, Laravel, framework local dev environments** | **`devutil`**              | **`development`, `web`, `framework`** |
     | **Remote desktop, screen sharing, connectivity**       | **`network` or `office`**   | **`remote-access`, `productivity`** |
     | **PDF viewing, document management, office tools**     | **`office`**               | **`productivity`, `pdf`, `office`** |
   - Do NOT create new categories automatically; creation requires explicit human approval or a runtime `--allow-create` flag.

Resolution & application loop (explicit)
---------------------------------------

- **Always generate the complete `{{ACTION}}` block**, regardless of confidence level. For ambiguous entries, use `review_required: true` in the operation metadata.

- Operation status handling:
   - **HIGH confidence entries**: Set `review_required: false` (or omit). These are ready to apply.
   - **MEDIUM/LOW confidence entries**: Set `review_required: true` and include:
     * `confidence: MEDIUM` or `confidence: LOW`
     * `alternatives: [...]` with 2-3 ranked options
     * `rationale: "..."` explaining the ambiguity
     * Format: `Primary → Development Utilities (HIGH), Alternative → macOS Enhancements (MEDIUM), Alternative → Office (LOW)`

- Application behavior:
   - If ALL entries have `review_required: false` (or omitted), the agent SHOULD apply changes directly to `data/packages.yaml`:
     * Write the updated file contents (do not perform git commits or pushes)
     * Include the resulting unified diff in the `{{ACTION}}` block
   - If ANY entry has `review_required: true`, the agent SHOULD:
     * Still generate the full `{{ACTION}}` block with proposed YAML
     * Apply ONLY the HIGH confidence entries to `data/packages.yaml`
     * List the entries needing review in a summary after the `{{REPORT}}` section
     * Wait for user response: `approve <name> <category>`, `reject <name>`, or `edit <name>`

- Do not perform git operations (commit/push); only write files locally and surface diffs. This preserves auditability and adheres to repository safety rules.

4) Tag assignment
   - Prefer tags already used in the repository. Map common keywords to tags (e.g. "documentation" -> `documentation`, "shell" -> `command-line`/`terminal`, "fish" -> `shell`, "bash" -> `shell`, "cli" -> `command-line`, "dev" -> `development`).  
   - Confidence levels for Tags:
     * **HIGH confidence** (auto-assign):
       - Tag already exists in repository
       - Tag is semantic variant of existing tag (e.g., "cli" → "command-line") with remap note
     * **MEDIUM confidence** (auto-assign with note):
       - Tag is new but semantically clear from domain context
     * **LOW confidence** (flag for review):
       - Tag is ambiguous or unclear → set `review_required: true` with alternatives
     * Limit tags to a sensible number (3–6). 
     * If any tag has LOW confidence, include `review_required: true` with alternatives and rationale.
   - Avoid inventing entirely new tags; if no existing tags fit and all candidates are LOW confidence, add a single `uncategorized` tag and flag `review_required: true` so a maintainer can refine tags later.

5) Duplicate detection and idempotency
   - Search `data/packages.yaml` for an existing entry by `id` if available, otherwise by `name` (case-insensitive).  
   - Category Schema Validation
     * Before assignment, verify the category exists in `data/packages.yaml`
     * If assigned category doesn't exist → flag `REVIEW_REQUIRED` with top 3 alternatives by semantic relevance
     * If assigned category's description doesn't semantically align with package purpose (e.g., "WordPress dev tool" in "Office" category) → flag with explanation and alternatives
   - If found:
     * If `mode=insert-only` → report "exists, skipped".  
     * Otherwise `upsert` mode: compute a minimal patch that updates only changed fields (homepage, info/desc, tags, id, license). Preserve existing `id` when present.
   - If not found → prepare an INSERT YAML node consistent with surrounding entries.

6) Output formatting rules (machine-friendly AND human-reviewable)
   - For each package produce a YAML node that matches the repository style. Required keys:
     - `name`: canonical package display name (string)
     - `desc` or `info`: short description / longer info (use `desc` for a one-line short summary and `info` for the long-form block if repo uses it)
     - `homepage`: URL
     - `id`: prefer value from `From:` line normalized to `homebrew/core/<name>` or `homebrew/cask/<name>` when available; else `homebrew/core/<name>` is acceptable.
     - `tags`: array of tag strings
     - `cask`: true when it's a cask (omit when false)
     - `license`: SPDX identifier when available
   - Keep ordering of keys consistent with repository examples (look at neighboring entries in the chosen category).
   - Include metadata in ACTION block for context:
     * When inserting, include `similar_existing` field with 1-3 similar packages already in that category (for reviewer context)
     * Example metadata:
       ```yaml
       - op: insert
         category: media
         similar_existing:
           - name: OpenSCAD
             tags: [design, programming]
             reason: "Both are 3D CAD/modeling tools"
         payload: |
           - name: Orca Slicer
             ...
       ```

7) Validation
   - Ensure generated YAML is syntactically valid (no tab characters for indentation, consistent 2-space indent, proper quoting when needed).  
   - Ensure no bracket tokens `[SOMETHING]` remain.  
   - Provide a short lint result: `YAML valid: true/false` and list parsing warnings.

8) Sync Impact Report
   - For the whole command produce a single report containing:
     * `version`: timestamped edit id (e.g., `update:2025-09-25T12:34:56Z`)  
     * `processed`: number of package blocks parsed  
     * `inserts`: list of inserted package names and category  
     * `updates`: list of updated package names and changed fields  
     * `skipped`: list of skipped packages and reason  
     * `templates_needing_attention`: any templates or docs that might reference package lists (best-effort)
     * `suggested_commit`: a short commit message

9) Final output sections (exact order)
   - A compact machine-readable YAML action block labelled: `{{ACTION}}` containing operations to apply (insert/update/skip) with file path `data/packages.yaml` and the exact YAML fragment(s). This block MUST be valid YAML and parsable programmatically.
   - A human-friendly Sync Impact Report (as above).  
   - A suggested commit message **displayed directly in chat** (ready for copy-paste) with these rules:
     * **Format**: `add: <pkg1>, <pkg2>, ... packages` (list only package names, not versions)
     * **Content**: List only `- Add <name> to <category> for <one-line purpose>`
     * **EXCLUDE**: Version numbers (not stored in packages.yaml)
     * **EXCLUDE**: Skip/rejection reasons (not relevant to commit)
     * **EXCLUDE**: Process notes (conventions followed, implementation details)
     * **Delivery**: Present as a code block in the response for easy copy-paste. Do NOT create temporary files.
     * Example GOOD: `add: git, Local packages\n- Add git to Git Tools for version control\n- Add Local to Development Utilities for WordPress development`
     * Example BAD: `add: git (v2.52.0), Local (v9.2.9) packages\nSkip: container already exists\nAll packages follow conventions`

10) Post-steps and safety
   - Homepage-first rule (REQUIRED for NEW packages): For any package not already present in `data/packages.yaml`, the agent MUST attempt to visit the `homepage` URL and extract a short, authoritative description to populate `info`. If the `homepage` field is missing in the input block, the agent MUST perform a web search to find an authoritative homepage (prefer the `formulae.brew.sh` API, the Homebrew formula page, the project's official site, or the GitHub repository).
   - If the agent cannot reach the network or fails to locate a homepage, it MUST set the operation to `REVIEW_REQUIRED`, include a clear note `TODO: homepage lookup failed for <name>`, and still produce a conservative `desc` using the `brew info` short description.
   - If `visit_homepage: true` was explicitly requested and the environment allows network access, the agent should also fetch the homepage and extract a one-line clarification (e.g., official description or homepage title). If network access is unavailable, note that.
   - Do not perform git operations. Only output the exact changes and the suggested commit message.
   - If uncertain about a category/tag choice, annotate the choice with `REVIEW_REQUIRED` and provide 2 alternative categories/tags with rationale.

Examples (two minimal examples matching repository style)
--------------------------------------------------

Example INSERT for `bash` (recommended style):

```yaml
- name: bash
  desc: Bourne-Again SHell, a UNIX command interpreter
  homepage: https://www.gnu.org/software/bash/
  id: homebrew/core/bash
  tags: [shell, command-line, system]
  license: GPL-3.0-or-later
  info: >-
    The GNU Bourne-Again SHell (bash) is a POSIX-compatible shell with many interactive features
    and scripting extensions used for system administration and scripting. Build-time deps: ncurses,
    readline, gettext.
```

Example INSERT for `fisher` (Fish plugin manager):

```yaml
- name: fisher
  desc: Plugin manager for the Fish shell
  homepage: https://github.com/jorgebucaran/fisher
  id: homebrew/core/fisher
  tags: [shell, command-line]
  license: MIT
  info: >-
    Fisher is a plugin manager for the Fish shell. It simplifies installing, updating and managing
    packages for Fish.
```

Agent response rules (must follow exactly)
----------------------------------------

1. Always produce the three output sections in order: `{{ACTION}}` (machine), `{{REPORT}}` (human), `{{COMMIT}}` (suggested commit message in chat).  
2. The `{{ACTION}}` block must contain a list of operations with explicit `op: insert|update|skip`, `path: data/packages.yaml`, `category: <id>`, `confidence: HIGH|MEDIUM|LOW`, `review_required: true|false`, and `payload: <yaml-node>`.
3. If any ambiguous choices were made, set `review_required: true` in the operation and provide `alternatives: [...]` with confidence levels (HIGH/MEDIUM/LOW) and rationale.
4. If the input is empty or unparsable, respond with a clear, actionable error and a short example of expected input.
5. Limit the total size of the YAML fragments to what would be reasonably included in a single PR (no more than ~100 new entries at once). If more, split into multiple batches and request confirmation.
6. **Do NOT create temporary files** for documentation, summaries, or commit messages. All output should be presented directly in the chat response.

Security & Privacy
------------------

- Never attempt to fetch or expose secrets.  
- Do not modify files other than `data/packages.yaml` without explicit instruction.  
- If the parsed `From:` URL indicates an external repo, prefer using that to construct `id` but do not access private repos.

Notes for implementers / integrators
----------------------------------

- This prompt is designed to be idempotent and programmatic-friendly; CI or a bot can run an agent with this prompt and apply the `{{ACTION}}` block automatically after human review.
- The agent should be tolerant of slightly different `brew info` formats (old/new, text/JSON). Use robust parsing for both formats.
- Keep match heuristics conservative to avoid miscategorization; prefer `review_required: true` when confidence is MEDIUM or LOW.
- Input format detection: The agent should auto-detect JSON (starts with `[` or `{`) vs plaintext (contains `==>`) and parse accordingly.

End of prompt.
