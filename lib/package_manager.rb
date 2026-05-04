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
    validate_package_consistency
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
    configured_packages = @packages.flat_map { |category| category['packages'] }
    brew_info = @homebrew.metadata_for(configured_packages).to_h { |pkg| [pkg['id'], pkg] }
    installed_info = @homebrew.installed_packages.to_h { |pkg| [pkg['id'], pkg] }

    @packages.each do |category|
      category['packages'].map! do |pkg|
        curated_info = pkg['info']
        tags = pkg['tags']
        id = pkg['id']
        merged = pkg.merge(brew_info.delete(id) || {}).merge(installed_info.delete(id) || {}).select { |_, v| !v.nil? }
        merged['info'] = curated_info if curated_info
        merged['tags'] = tags if tags
        merged
      end
      category['packages'].sort_by! { |pkg| (pkg['name'] || pkg['id']).to_s.downcase }
    end

    add_uncategorized_packages(installed_info)
  end

  def add_uncategorized_packages(remaining_packages)
    uncategorized = @packages.find { |cat| cat['id'] == 'uncategorized' }
    return unless uncategorized

    uncategorized['packages'] ||= []
    uncategorized['packages'] += remaining_packages.values.select { |pkg| pkg['installed_on_request'] }
    @packages.delete(uncategorized) if uncategorized['packages'].empty?
    @packages.sort_by! { |cat| [cat['id'] == 'uncategorized' ? 1 : 0, cat['name'].to_s.downcase] }
  end

  def validate_package_consistency
    warnings = []

    @packages.each do |category|
      category['packages'].each do |pkg|
        id = pkg['id'].to_s
        tap, _, token = id.rpartition('/')

        warnings << "#{category['id']}/#{pkg['name'] || id}: missing id" if id.empty?
        warnings << "#{id}: expected tap/token id format" if tap.empty? || token.empty?
        warnings << "#{id}: cask field should be true for homebrew/cask ids" if tap == 'homebrew/cask' && pkg.key?('cask') && pkg['cask'] != true
        warnings << "#{id}: homebrew/core formula id should not set cask: true" if tap == 'homebrew/core' && pkg['cask'] == true
        warnings << "#{id}: token does not match id token #{token}" if pkg['token'] && pkg['token'] != token
        warnings << "#{id}: versions should come from Homebrew runtime metadata, not packages.yaml" if pkg.key?('versions') || pkg.key?('latest_version')
      end
    end

    warnings.each { |warning| warn "Package metadata warning: #{warning}" }
    warnings
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
