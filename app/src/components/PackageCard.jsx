import { packageDisplayName } from "../utils/packageUtils";

export function PackageCard(props) {
  const isMarkedForUninstall = () => props.pkg.installed && props.selected;

  return (
    <div
      class={`p-3 rounded-lg mb-1 cursor-pointer transition-all hover:transform hover:scale-[1.02] h-full flex flex-col ${
        props.selected
          ? props.pkg.installed
            ? "bg-red-200 border-2 border-red-400 hover:border-red-500 hover:shadow-sm" // Selected installed package to uninstall
            : "bg-green-200 border-2 border-green-400 hover:border-green-500 hover:shadow-sm" // Selected new package to install
          : props.pkg.installed
            ? props.pkg.outdated
              ? "bg-blue-300 border-2 border-blue-500 hover:border-blue-600 hover:shadow-sm" // Installed outdated package
              : "bg-blue-100 border-2 border-blue-300 hover:border-blue-400 hover:shadow-sm" // Installed package
            : "bg-gray-50 border-2 border-gray-200 hover:border-gray-300 hover:shadow-sm" // Not installed package
      }`}
      onClick={() => props.onToggle(props.pkg)}
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <h3 class="text-lg font-semibold">{packageDisplayName(props.pkg)}</h3>
          {props.pkg.recommended && (
            <span class="text-yellow-500" title="Recommended">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-5 h-5"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
          )}
          {props.pkg.homepage && (
            <a
              href={props.pkg.homepage}
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-500 hover:text-blue-600 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
            </a>
          )}
        </div>
        <div class="flex gap-2">

          {props.pkg.tap && (
              <span class="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full group relative">
                {props.pkg.tap.split('/')[0]}
              </span>
          )}

          {props.pkg.cask && (
            <span class="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
              cask
            </span>
          )}
          {props.pkg.info && (
            <div class="relative group cursor-help">
              <div
                class="text-gray-500 hover:text-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
              </div>
              <div class="absolute z-50 hidden group-hover:block bg-gray-800 text-white text-sm rounded p-2 shadow-lg w-64 right-0 transform -translate-y-3/4">
                <div>
                  {props.pkg.info}
                  {(props.pkg.versions || props.pkg.tap) && (
                    <div class="mt-1 pt-1 border-t border-gray-600">
                      {props.pkg.versions && (
                        <div>
                          Version: {props.pkg.versions}
                          {props.pkg.outdated && <b><i> → {props.pkg.latest_version}</i></b>}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <p class="text-gray-600 mt-2 text-sm flex-grow">{props.pkg.desc || props.pkg.id}</p>

      {/* Tags section */}
      {props.pkg.tags && props.pkg.tags.length > 0 && (
        <div class="flex flex-wrap gap-1.5 mt-3">
          {props.pkg.tags.map(tag => (
            <span 
              class={`px-1.5 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full cursor-pointer hover:bg-gray-200 ${props.selectedTags?.includes(tag) ? 'bg-blue-100 text-blue-700 border border-blue-300' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                props.onTagClick && props.onTagClick(tag);
              }}
              title="Click to filter by this tag"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
