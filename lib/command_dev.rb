class DevCommand < Command
  private

  def default_options
    super.merge(
      dev_mode: false,
    )
  end
  def parse_options(args)
    options = super(args)
    dev_mode_url = 'http://localhost:8048'

    # Set app_url based on priority: override > dev mode default > existing
    options[:app_url] = options[:app_url_override] ||
                       (options[:dev_mode] ? dev_mode_url : options[:app_url])

    options
  end

  def add_options(opts, options)
    opts.on("--app-url URL", "URL for frontend assets") { |v| options[:app_url_override] = v }
    opts.on("-d", "--dev", "Run in development mode") { |v| options[:dev_mode] = v }
    opts.on("--access", "Enable access log") { options[:access_log] = true }
    super(opts, options)
  end
end
