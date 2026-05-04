const FRONTEND_VERSION = import.meta.env.PACKAGE_VERSION;

export function Header(props) {
  const handleClose = async () => {
    try {
      await fetch('/api/v1/terminate', { method: 'POST' });
      // Try different methods to close the browser tab/window
      window.close();
      // Fallback for browsers that block window.close()
      if (window.opener) {
        window.opener.close();
      }
      // Additional fallback
      window.location.href = 'about:blank';
    } catch (error) {
      console.error('Failed to terminate server:', error);
    }
  };

  return (
      <div class="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div class="max-w-[1800px] min-w-[1200px] mx-auto px-3 py-2">
          {/* Main Header Content */}
          <div class="flex justify-between items-center">
            {/* Column 1: Icon, Title, description */}
                  <div class="flex items-start gap-3">
                    <a href="https://brew.sh" target="_blank" rel="noopener noreferrer">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/9/95/Homebrew_logo.svg" alt="Homebrew logo" class="w-16 h-16" />
                    </a>
                    <div>
                    <h1 class="text-2xl font-bold text-center">
                      <a href="https://github.com/brewiz/brewiz.github.io" target="_blank" rel="noopener noreferrer"
                       class="hover:text-gray-700 hover:underline">Homebrew Package Wizard</a>
                    </h1>
                    <p class="text-gray-600 text-sm">Select packages to install on your macOS system</p>
                    </div>
                  </div>

                  {/* Column 2: Search and filter */}
            <div class="flex flex-col gap-1">
              <div class="relative max-w-[475px]">
                <input
                    type="text"
                    placeholder="Search packages..."
                    value={props.searchTerm()}
                    onInput={(e) => props.onSearch(e.target.value)}
                    class="w-full px-3 py-1 h-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="flex gap-3 flex-wrap">
                <div class="flex gap-2 bg-slate-100 border border-slate-300 p-1 rounded-lg">
                  <FilterButton
                      active={props.filters().installed}
                      onClick={() => props.onFilterChange('installed')}
                      label="Installed"
                  />
                  <FilterButton
                      active={props.filters().notInstalled}
                      onClick={() => props.onFilterChange('notInstalled')}
                      label="Not Installed"
                  />
                  <FilterButton
                      active={props.filters().outdated}
                      onClick={() => props.onFilterChange('outdated')}
                      label="Outdated"
                  />
                </div>
                <div class="flex gap-2 bg-slate-100 border border-slate-300 p-1 rounded-lg">
                  <FilterButton
                      active={props.filters().casks}
                      onClick={() => props.onFilterChange('casks')}
                      label="Casks"
                  />
                  <FilterButton
                      active={props.filters().formulae}
                      onClick={() => props.onFilterChange('formulae')}
                      label="Formulae"
                  />
                </div>
                
                {/* Tags filter dropdown */}
                <div class="relative group">
                  <button 
                    class={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${
                      props.selectedTags().length > 0 
                        ? "bg-blue-500 text-white" 
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Tags {props.selectedTags().length > 0 && `(${props.selectedTags().length})`}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  
                  <div class="absolute z-50 hidden group-hover:block right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg w-96 max-h-96 overflow-y-auto">
                    <div class="p-3">
                      <div class="flex justify-between items-center mb-3">
                        <h3 class="font-semibold text-gray-800">Filter by Tags</h3>
                        {props.selectedTags().length > 0 && (
                          <button 
                            onClick={props.onClearTags} 
                            class="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                      
                      {/* Search box for tags */}
                      <div class="mb-3">
                        <div class="relative">
                          <input
                            type="text"
                            placeholder="Search tags..."
                            class="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={props.tagSearchTerm || ''}
                            onInput={(e) => props.onTagSearch(e.target.value)}
                          />
                          {props.tagSearchTerm && (
                            <button
                              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              onClick={() => props.onTagSearch('')}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Selected tags display */}
                      {props.selectedTags().length > 0 && (
                        <div class="mb-3 pb-3 border-b border-gray-200">
                          <div class="text-xs font-medium text-gray-700 mb-1.5">Selected:</div>
                          <div class="flex flex-wrap gap-1.5">
                            {props.selectedTags().map(tag => (
                              <span 
                                class="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 border border-blue-300 rounded-full flex items-center"
                              >
                                #{tag}
                                <button 
                                  class="ml-1 text-blue-700 hover:text-blue-900 font-bold"
                                  onClick={() => props.onTagToggle(tag)}
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* All available tags */}
                      <div class="max-h-60 overflow-y-auto pr-1">
                        {props.filteredTags.length === 0 ? (
                          <p class="text-sm text-gray-500 py-2">No matching tags found</p>
                        ) : (
                          <>
                            <div class="text-xs font-medium text-gray-700 mb-1.5">All tags:</div>
                            <div class="flex flex-wrap gap-1.5">
                              {props.filteredTags.map(tag => (
                                <span 
                                  class={`px-2 py-0.5 text-xs rounded-full cursor-pointer ${
                                    props.selectedTags().includes(tag) 
                                      ? "bg-blue-100 text-blue-700 border border-blue-300" 
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }`}
                                  onClick={() => props.onTagToggle(tag)}
                                  title={props.selectedTags().includes(tag) ? "Click to remove" : "Click to add"}
                                >
                                  #{tag}
                                  {props.tagCounts && props.tagCounts[tag] && (
                                    <span class="ml-1 text-gray-500 font-semibold">{props.tagCounts[tag]}</span>
                                  )}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                      
                      {/* Helper text */}
                      <div class="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
                        Click to select multiple tags. Packages with any selected tag will be shown.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Display selected tags below filters */}
              {props.selectedTags().length > 0 && (
                <div class="flex flex-wrap gap-1.5 mt-1.5 ml-1">
                  {props.selectedTags().map(tag => (
                    <span 
                      class="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 border border-blue-300 rounded-full flex items-center"
                    >
                      #{tag}
                      <button 
                        class="ml-1 text-blue-700 hover:text-blue-900 font-bold"
                        onClick={() => props.onTagToggle(tag)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {props.selectedTags().length > 0 && (
                    <button 
                      onClick={props.onClearTags} 
                      class="text-xs text-blue-600 hover:text-blue-800 px-2 py-0.5"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Column 3: Action buttons and version */}
            <div class="flex flex-col items-end gap-3">
              <div class="flex gap-2">
                <button
                 onClick={props.onRefresh}
                 disabled={props.loading || props.refreshing}
                 title="Refresh package list"
                 class={`px-4 py-1.5 text-base rounded-lg flex items-center gap-2 ${props.loading || props.refreshing
                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                   : "bg-blue-500 hover:bg-blue-600 text-white"}`}
               >
                  {(props.loading || props.refreshing) && (
                        <span class={`inline-block w-3 h-3 border-2 border-t-transparent rounded-full ${
                          props.loading || props.refreshing ? "animate-spin border-white" : "border-white/50"
                          }`}></span>            )}
                

                 Refresh
               </button>
                <button
                    onClick={props.onReset}
                    title="Clear selected packages"
                    class="px-4 py-1.5 text-base rounded-lg bg-red-500 hover:bg-red-600 text-white"
                >
                  Reset
                </button>
                <button
                    onClick={handleClose}
                    title="Close Brewiz"
                    class="px-4 py-1.5 text-base rounded-lg bg-gray-500 hover:bg-gray-600 text-white"
                >
                  Close
                </button>
              </div>
              <div class="text-xs text-gray-500">
              <span>
                {FRONTEND_VERSION === (props?.version?.brewiz || FRONTEND_VERSION)
                    ? <a href={`https://github.com/brewiz/brewiz.github.io/tree/v${FRONTEND_VERSION}`} target="_blank" rel="noopener noreferrer" class="hover:text-gray-700 hover:underline">brewiz v{FRONTEND_VERSION}</a>
                    : `brewiz v${props.version.brewiz} / app v${FRONTEND_VERSION}`}
              </span>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          <div class={`${(props.loading || props.usingLocalData || props.refreshing) ? 'mt-6 mb-2' : 'mt-1'} flex justify-between items-end`}>
            <div class="flex-grow">
              {props.loading && (
                  <div class="flex items-center justify-center p-4">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
              )}

              {props.usingLocalData && !props.loading && (
                  <div class="bg-yellow-100 border-2 border-yellow-400 text-yellow-800 rounded-lg p-4">
                    <h3 class="font-bold">Using local package data</h3>
                    <p class="text-sm">
                      The API server is not available. Using built-in example data instead.
                    </p>
                  </div>
              )}

              {props.refreshing && !props.loading && (
                  <div class="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4">
                    <h3 class="font-bold flex items-center">
                      Refreshing brew data...
                    </h3>
                    <p>Please wait while we refresh package information.</p>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}

function FilterButton(props) {
  return (
      <button
          onClick={props.onClick}
          class={`px-3 py-1 text-sm rounded-full transition-colors ${
              props.active
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
      >
        {props.label}
      </button>
  );
}
