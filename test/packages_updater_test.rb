#!/usr/bin/env ruby
require 'minitest/autorun'
require 'fileutils'
require 'tmpdir'
require 'open3'

class PackagesUpdaterTest < Minitest::Test
  REPO_ROOT = File.expand_path(File.join(__dir__, '..'))

  def setup
    @orig_packages = File.join(REPO_ROOT, 'data', 'packages.yaml')
    unless File.exist?(@orig_packages)
      skip 'data/packages.yaml not found in repository root; cannot run integration tests'
    end
  end

  def test_dry_run_does_not_write
    Dir.mktmpdir('packages-updater-test') do |tmp|
      prepare_tmp_workspace(tmp)

      action = <<~YAML
        - op: insert
          path: data/packages.yaml
          category: uncategorized
          payload:
            name: testpkg
            desc: Test package for dry-run
            homepage: https://example.com/testpkg
            id: homebrew/core/testpkg
            tags: [command-line]
            license: MIT
            info: >-
              Test package used for verifying packages-updater dry-run behavior.
      YAML

      action_path = File.join(tmp, 'action.yaml')
      File.write(action_path, action)

      data_path = File.join(tmp, 'data', 'packages.yaml')
      before = File.read(data_path)

      Dir.chdir(tmp) do
        updater = File.join('.brewiz', 'bin', 'packages-updater')
        File.chmod(0755, updater)
        stdout, stderr, status = Open3.capture3(updater, '-a', action_path, '-n')

        assert status.success?, "packages-updater exited non-zero: #{stderr}\n#{stdout}"
        assert_includes stdout, 'Dry-run mode: no file written.'
      end

      after = File.read(data_path)
      assert_equal before, after, 'data/packages.yaml should be unchanged in dry-run'
    end
  end

  def test_apply_writes_and_validates
    Dir.mktmpdir('packages-updater-test') do |tmp|
      prepare_tmp_workspace(tmp)

      action = <<~YAML
        - op: insert
          path: data/packages.yaml
          category: uncategorized
          payload:
            name: testpkg
            desc: Test package for full-run
            homepage: https://example.com/testpkg
            id: homebrew/core/testpkg
            tags: [command-line]
            license: MIT
            info: >-
              Test package used for verifying packages-updater full-run behavior.
      YAML

      action_path = File.join(tmp, 'action.yaml')
      File.write(action_path, action)

      data_path = File.join(tmp, 'data', 'packages.yaml')

      Dir.chdir(tmp) do
        updater = File.join('.brewiz', 'bin', 'packages-updater')
        File.chmod(0755, updater)
        stdout, stderr, status = Open3.capture3(updater, '-a', action_path)

        assert status.success?, "packages-updater exited non-zero: #{stderr}\n#{stdout}"
        assert_includes stdout, 'Wrote updated data/packages.yaml'
        assert_includes stdout, 'YAML valid: true'
      end

      # Verify the inserted package appears in the written file
      written = File.read(data_path)
      assert_includes written, 'id: homebrew/core/testpkg'
      refute_includes written, 'name: testpkg'
      refute_includes written, 'desc: Test package for full-run'
      refute_includes written, 'homepage: https://example.com/testpkg'
    end
  end

  private

  def prepare_tmp_workspace(tmp)
    # Copy data directory and the updater script into the tmp workspace
    FileUtils.mkdir_p(File.join(tmp, '.brewiz', 'bin'))
    FileUtils.mkdir_p(File.join(tmp, 'data'))

    FileUtils.cp(@orig_packages, File.join(tmp, 'data', 'packages.yaml'))

    script_src = File.join(REPO_ROOT, '.brewiz', 'bin', 'packages-updater')
    script_dst = File.join(tmp, '.brewiz', 'bin', 'packages-updater')
    FileUtils.cp(script_src, script_dst)

    FileUtils.mkdir_p(File.join(tmp, 'bin'))
    beautifier_src = File.join(REPO_ROOT, 'bin', 'beautify-packages-yaml')
    beautifier_dst = File.join(tmp, 'bin', 'beautify-packages-yaml')
    FileUtils.cp(beautifier_src, beautifier_dst)
    File.chmod(0755, beautifier_dst)
  end
end
