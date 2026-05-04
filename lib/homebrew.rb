class Homebrew
  FORMULA_API_URL = 'https://formulae.brew.sh/api/formula.json'.freeze
  CASK_API_URL = 'https://formulae.brew.sh/api/cask.json'.freeze

  def initialize(api_urls = {})
    @formula_api_url = api_urls[:formula] || FORMULA_API_URL
    @cask_api_url = api_urls[:cask] || CASK_API_URL
  end

  def metadata_for(packages)
    puts 'Getting Homebrew metadata from formulae.brew.sh...'
    formulae_by_id = formula_metadata_by_id
    casks_by_id = cask_metadata_by_id

    packages.each_with_object([]) do |pkg, metadata|
      id = pkg['id'].to_s
      info = if pkg['cask'] || id.start_with?('homebrew/cask/')
        casks_by_id[id]
      else
        formulae_by_id[id] || casks_by_id[id]
      end
      metadata << info if info
    end
  end

  private

  def formula_metadata_by_id
    @formula_metadata_by_id ||= fetch_json(@formula_api_url).each_with_object({}) do |pkg, by_id|
      info = process_formula(pkg)
      by_id[info['id']] = info
    end
  end

  def cask_metadata_by_id
    @cask_metadata_by_id ||= fetch_json(@cask_api_url).each_with_object({}) do |pkg, by_id|
      info = process_cask(pkg)
      by_id[info['id']] = info
    end
  end

  def fetch_json(url)
    JSON.parse(URI.open(url).read)
  rescue => e
    warn "Warning: failed to load Homebrew API metadata from #{url}: #{e.message.strip}"
    []
  end

  def process_formula(pkg)
    {
      'name' => pkg['name'],
      'id' => "#{pkg['tap']}/#{pkg['name']}",
      'desc' => pkg['desc'],
      'homepage' => pkg['homepage'],
      'cask' => false,
      'license' => pkg['license']
    }.select { |_, v| !v.nil? }
  end

  def process_cask(pkg)
    token = pkg['token']
    {
      'name' => Array(pkg['name']).first || token,
      'id' => "#{pkg['tap']}/#{token}",
      'desc' => pkg['desc'],
      'homepage' => pkg['homepage'],
      'cask' => true,
      'token' => token
    }.select { |_, v| !v.nil? }
  end
end
