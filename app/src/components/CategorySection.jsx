import { createSignal, For } from "solid-js";
import { PackageCard } from "./PackageCard";
import { packageKey } from "../utils/packageUtils";

export function CategorySection(props) {
  const [isExpanded, setIsExpanded] = createSignal(true);

  return (
    <div class="bg-white rounded-lg shadow-sm overflow-visible">
      <div
        class="flex items-center justify-between cursor-pointer p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded())}
      >
        <div>
          <h2 class="text-xl font-bold">{props.category.name}</h2>
          <p class="text-gray-600 text-sm">{props.category.desc}</p>
        </div>
        <span class="text-2xl text-gray-500">{isExpanded() ? "−" : "+"}</span>
      </div>
      {isExpanded() && (
        <div class="p-4 overflow-visible">
          <div class="grid grid-cols-3 2xl:grid-cols-4 gap-3 overflow-visible">
            <For each={props.category.packages}>
              {(pkg) => (
                <PackageCard
                  pkg={pkg}
                  selected={props.selectedPackages.has(packageKey(pkg))}
                  onToggle={() => props.onPackageToggle(pkg)}
                  selectedTags={props.selectedTags}
                  onTagClick={props.onTagClick}
                />
              )}
            </For>
          </div>
        </div>
      )}
    </div>
  );
}
