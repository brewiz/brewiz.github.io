class PackageManager
  attr_reader :packages

  def initialize(homebrew, options)
    @homebrew = homebrew
    @options = options
    @cache_time = 60 * 60
    @cache_file = File.join(Dir.home, '.cache', 'brewiz', 'packages.yaml')
  end

  def reload
    @packages = load_config
    update_packages_with_brew_info
    add_missing_infos
    write_packages_to_cache
    @packages
  end

  def read_from_cache_or_reload_packages
    reload unless read_packages_from_cache
  end
  def add_missing_infos
    standard_taps = ['homebrew/cask', 'homebrew/core'].freeze

    @packages.each do |category|
      category['packages'].each do |pkg|
        tap, _, token = pkg['id'].rpartition('/')
        pkg['tap'] = tap unless standard_taps.include?(tap)
        pkg['token'] = token if pkg['cask'] && !pkg.key?('token')
      end
    end
  end

  def load_config
    yaml_content = if @options[:packages_yaml].start_with?('http')
      URI.open(@options[:packages_yaml]).read
    else
      File.read(@options[:packages_yaml])
    end
    docs = YAML.load_stream(yaml_content)
    # If the first doc is a metadata/docu section (has 'Title'), skip it
    doc = docs.find { |d| d.is_a?(Array) && d.first&.key?('id') } || docs.first
    doc
  end

  def update_packages_with_brew_info
    @homebrew.update
    brew_info = @homebrew.info.to_h { |pkg| [pkg['id'], pkg] }

    @packages.each do |category|
      category['packages'].map! do |pkg|
        # Preserve tags if they exist in the original package
        tags = pkg['tags']
        merged = pkg.merge(brew_info.delete(pkg['id']) || {}).select { |_, v| v }
        merged['tags'] = tags if tags
        merged
      end
      category['packages'].sort_by! { |pkg| pkg['name'].downcase }
    end

    add_uncategorized_packages(brew_info)
  end

  def add_uncategorized_packages(remaining_packages)
    uncategorized = @packages.find { |cat| cat['id'] == 'uncategorized' }
    return unless uncategorized

    uncategorized['packages'] += remaining_packages.values.select { |pkg| pkg['installed_on_request'] }
    @packages.delete(uncategorized) if uncategorized['packages'].empty?
    @packages.sort_by! { |cat| [cat['id'] == 'uncategorized' ? 1 : 0, cat['name'].downcase] }
  end

  def read_packages_from_cache
    return false unless @options[:cache_enabled]

    FileUtils.mkdir_p(File.dirname(@cache_file))
    return false unless File.exist?(@cache_file) && File.mtime(@cache_file) > Time.now - @cache_time

    @packages = YAML.safe_load(File.read(@cache_file))
    true
  end

  def write_packages_to_cache
    return unless @options[:cache_enabled] && @packages

    FileUtils.mkdir_p(File.dirname(@cache_file))
    File.write(@cache_file, YAML.dump(@packages))
  end
end
