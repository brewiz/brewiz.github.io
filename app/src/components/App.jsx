import { createSignal, onMount, createMemo } from "solid-js";
import { usePackageStore } from "../stores/packageStore";
import { useSearchStore } from "../stores/searchStore";
import { Header } from "./Header";
import { PackageList } from "./PackageList";
import { BrewCommands } from "./BrewCommands";
import { packageSearchText } from "../utils/packageUtils";

function App() {
  const { 
    packages,
    loading,
    error,
    refreshing,
    usingLocalData,
    selectedPackages,
    outdatedPackages,
    version,
    loadPackages,
    refreshPackages,
    resetSelection,
    togglePackage,
    loadVersion
  } = usePackageStore();

  const {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    resetFilters,
    selectedTags,
    toggleTag,
    clearTags,
    tagSearchTerm,
    setTagSearchTerm
  } = useSearchStore();

  const handleReset = () => {
    resetSelection();
    resetFilters();
  };

  // Create a list of all available tags across all packages
  const allAvailableTags = createMemo(() => {
    const tagsSet = new Set();
    
    packages().forEach(category => {
      category.packages.forEach(pkg => {
        if (pkg.tags && Array.isArray(pkg.tags)) {
          pkg.tags.forEach(tag => tagsSet.add(tag));
        }
      });
    });
    
    return Array.from(tagsSet).sort();
  });

  // Count packages per tag to show alongside tags
  const tagCounts = createMemo(() => {
    const counts = {};
    
    packages().forEach(category => {
      category.packages.forEach(pkg => {
        if (pkg.tags && Array.isArray(pkg.tags)) {
          pkg.tags.forEach(tag => {
            counts[tag] = (counts[tag] || 0) + 1;
          });
        }
      });
    });
    
    return counts;
  });

  // Filter tags based on search term
  const filteredTags = createMemo(() => {
    if (!tagSearchTerm()) return allAvailableTags();
    
    const search = tagSearchTerm().toLowerCase();
    return allAvailableTags().filter(tag => 
      tag.toLowerCase().includes(search)
    );
  });

  const filteredPackages = () => {
    let filtered = packages();
    
    // Apply search
    if (searchTerm()) {
      const search = searchTerm().toLowerCase();
      filtered = filtered.map(category => ({
        ...category,
        packages: category.packages.filter(pkg =>
          packageSearchText(pkg).includes(search)
        )
      }));
    }

    // Apply filters
    if (!filters().casks || !filters().formulae ||
        filters().installed || filters().notInstalled || filters().outdated) {
      filtered = filtered.map(category => ({
        ...category,
        packages: category.packages.filter(pkg => {
          // Handle type filters
          if (!filters().casks && pkg.cask) return false;
          if (!filters().formulae && !pkg.cask) return false;

          // Handle installation state filters
          if (filters().installed && pkg.installed) return true;
          if (filters().notInstalled && !pkg.installed) return true;
          if (filters().outdated && pkg.outdated) return true;
          
          return false; 
        })
      }));
    }

    // Apply tag filters - show packages with ANY of the selected tags (OR logic)
    if (selectedTags().length > 0) {
      filtered = filtered.map(category => ({
        ...category,
        packages: category.packages.filter(pkg => {
          if (!pkg.tags || !Array.isArray(pkg.tags)) return false;
          
          // Show package if it has any of the selected tags (OR logic)
          return selectedTags().some(selectedTag => pkg.tags.includes(selectedTag));
        })
      }));
    }

    // Remove empty categories
    return filtered.filter(category => category.packages.length > 0);
  };

  onMount(() => {
    loadPackages();
    loadVersion();
  });

  return (
    <div class="min-h-screen min-w-[1200px] bg-gray-100">
      <Header
        loading={loading()}
        refreshing={refreshing()}
        error={error()}
        version={version()}
        onRefresh={refreshPackages}
        onReset={handleReset}
        selectedPackagesCount={selectedPackages().size}
        usingLocalData={usingLocalData()}
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        filters={filters}
        onFilterChange={(key) => updateFilter(key, !filters()[key])}
        selectedTags={selectedTags}
        onTagToggle={toggleTag}
        onClearTags={clearTags}
        allAvailableTags={allAvailableTags()}
        tagCounts={tagCounts()}
        filteredTags={filteredTags()}
        tagSearchTerm={tagSearchTerm()}
        onTagSearch={setTagSearchTerm}
      />

      <PackageList 
        packages={filteredPackages()}
        selectedPackages={selectedPackages()}
        onPackageToggle={togglePackage}
        selectedTags={selectedTags()}
        onTagClick={toggleTag}
      />

      <BrewCommands
        categories={filteredPackages()}
        selectedPackages={selectedPackages}
        outdatedPackages={outdatedPackages}
      />
    </div>
  );
}

export default App;
