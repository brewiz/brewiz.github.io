class Server
  def initialize(options)
    @options = options
    @homebrew = Homebrew.new
    @package_manager = PackageManager.new(@homebrew, options)
  end

  def start
    @package_manager.read_from_cache_or_reload_packages
    @server = setup_server
    open_browser unless @options[:no_open]
    puts "Press Ctrl-C to stop"
    @server.start
  rescue Interrupt
    @server.shutdown
  rescue StandardError => e
    raise "Error starting server: #{e.message}"
  end

  private

  def setup_server
    frontend_server_port_open?
    puts "Starting Server on http://#{@options[:address]}:#{@options[:port]}"
    server = WEBrick::HTTPServer.new(
      Port: @options[:port],
      BindAddress: @options[:address],
      Logger: WEBrick::Log.new($stderr, WEBrick::Log::INFO),
      AccessLog: @options[:access_log] ? [[$stderr, WEBrick::AccessLog::COMBINED_LOG_FORMAT]] : []
    )
    server.mount('/', RequestHandler, @homebrew, @package_manager, @options)
    trap('INT') { server.shutdown }
    server
  end

  def open_browser
    Thread.new do
      sleep(0.2) until port_open?

      puts "Opening http://#{@options[:address]}:#{@options[:port]} in your browser..."
      system('open', "http://#{@options[:address]}:#{@options[:port]}")
    end
  end

  def port_open?
    Net::HTTP.get_response(URI("http://#{@options[:address]}:#{@options[:port]}")).is_a?(Net::HTTPSuccess)
  rescue StandardError
    false
  end

  def frontend_server_port_open?
    app_url = @options[:app_url].to_s
    if app_url.start_with?('http://', 'https://')
      response = Net::HTTP.get_response(URI("#{app_url.sub(%r{/+\z}, '')}/index.html"))
      raise "Frontend server returned #{response.code} for #{app_url}" unless response.is_a?(Net::HTTPSuccess)
    else
      index_path = File.join(File.expand_path(app_url), 'index.html')
      raise "Frontend assets not found at #{index_path}" unless File.file?(index_path)
    end
  rescue StandardError
    raise "Node server not running on #{@options[:app_url]}"
  end
end
