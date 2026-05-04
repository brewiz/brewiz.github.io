require 'open3'

class Homebrew
  FORMULA_API_URL = 'https://formulae.brew.sh/api/formula.json'.freeze
  CASK_API_URL = 'https://formulae.brew.sh/api/cask.json'.freeze

  def initialize(api_urls = {})
    @formula_api_url = api_urls[:formula] || FORMULA_API_URL
    @cask_api_url = api_urls[:cask] || CASK_API_URL
    @brew = find_brew
  end

  def metadata_for(packages)
    puts 'Getting Homebrew metadata from formulae.brew.sh...'
    formulae_by_id = formula_metadata_by_id
    casks_by_id = cask_metadata_by_id
    installed_by_id = installed_metadata_by_id

    packages.each_with_object([]) do |pkg, metadata|
      id = pkg['id'].to_s
      info = if pkg['cask'] || id.start_with?('homebrew/cask/')
        casks_by_id[id]
      else
        formulae_by_id[id] || casks_by_id[id]
      end
      merged = (info || {}).merge(installed_by_id[id] || {})
      metadata << merged if merged['id']
    end
  end

  def installed_packages
    installed_metadata_by_id.values
  end

  private

  def find_brew
    brew = ['/opt/homebrew/bin/brew', '/usr/local/bin/brew', './mock/bin/brew'].find { |path| File.exist?(path) }
    puts 'Homebrew is not installed; installed package state will be unavailable.' unless brew
    brew
  end

  def installed_metadata_by_id
    @installed_metadata_by_id ||= begin
      if @brew
        output = brew_cmd('info', '--installed', '--json=v2')
        data = JSON.parse(output)
        (process_installed_info(data['formulae'] || [], false) + process_installed_info(data['casks'] || [], true)).to_h do |pkg|
          [pkg['id'], pkg]
        end
      else
        {}
      end
    rescue => e
      warn "Warning: failed to load local Homebrew installed state: #{e.message.strip}"
      {}
    end
  end

  def brew_cmd(*args)
    stdout, stderr, status = Open3.capture3(@brew, *args)
    raise stderr unless status.success?

    stdout
  end

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

  def process_installed_info(packages, is_cask)
    packages.map do |pkg|
      token = is_cask ? pkg['token'] : pkg['name']
      installed_versions = if is_cask
        [pkg['version']]
      else
        Array(pkg['installed']).map { |install| install['version'] }
      end

      {
        'name' => is_cask ? Array(pkg['name']).first : pkg['name'],
        'id' => "#{pkg['tap']}/#{token}",
        'desc' => pkg['desc'],
        'homepage' => pkg['homepage'],
        'installed' => true,
        'installed_on_request' => is_cask || Array(pkg['installed']).any? { |install| install['installed_on_request'] },
        'outdated' => pkg['outdated'],
        'cask' => is_cask,
        'token' => is_cask ? pkg['token'] : nil,
        'versions' => installed_versions,
        'latest_version' => is_cask ? pkg['version'] : pkg.dig('versions', 'stable')
      }.select { |_, v| v }
    end
  end
end
