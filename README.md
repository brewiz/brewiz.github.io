# Brewiz - Homebrew Package Wizard

[![Version](https://img.shields.io/badge/version-0.9.16-blue.svg)](https://github.com/brewiz/brewiz.github.io/tree/v0.9.16)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![macOS](https://img.shields.io/badge/platform-macOS-lightgrey.svg)](https://www.apple.com/macos)
[![Ruby](https://img.shields.io/badge/ruby-%3E%3D%202.6-red.svg)](https://www.ruby-lang.org/)
[![Node.js](https://img.shields.io/badge/node-%3E%3D%2018.0.0-green.svg)](https://nodejs.org/)
[![Homebrew](https://img.shields.io/badge/homebrew-required-orange.svg)](https://brew.sh/)

Brewiz is a modern web interface for managing Homebrew packages on macOS. It provides an intuitive way to browse, select, and generate Homebrew commands for package installation and management.

[![brewiz screenshot](https://brewiz.github.io/docs/images/brewiz-small.png)](https://brewiz.github.io/docs/images/brewiz-full.png)

For an interactive demo you can visit: [https://brewiz.github.io/app/dist](https://brewiz.github.io/app/dist)

## Features

- 🎯 Visual package selection interface
- 📦 Browse packages by categories
- 🔎 Quick search and filtering
- 🔄 Real-time command generation
- 🚀 One-click copy of commands
- 💫 Responsive design
- 🎨 Visual status indicators for installed/outdated packages

## Usage

> **Note:** Brewiz requires Homebrew to be installed on your system. If you don't have Homebrew yet, visit [brew.sh](https://brew.sh) to install it first.

### Header Navigation

The header contains a centralized search bar that allows you to:

- Filter packages by name
- Search package descriptions
- Quickly find specific tools and utilities

### Quick Setup

The easiest way to use Brewiz is to add this alias to your shell configuration file (e.g., `~/.zshrc`):

```bash
alias brewiz='/usr/bin/ruby -e "$(curl -fsSL https://brewiz.github.io/bin/brewiz)" --'
```

Then simply run `brewiz` in your terminal.

### One-Time Use

If you prefer not to install anything, you can run it directly:

```bash
/usr/bin/ruby -e "$(curl -fsSL https://brewiz.github.io/bin/brewiz)"
```

### Local Installation

For offline use or customization:

```bash
curl -fsSL -o brewiz https://brewiz.github.io/bin/brewiz
chmod +x brewiz
./brewiz
```

### How It Works

1. When you run Brewiz, it starts a local web server and opens your browser.
2. You'll see all available Homebrew packages organized by category.
3. **Color coding:**
   - Blue: already installed
   - White: available to install
   - Green: selected for install
   - Red: selected for uninstall
4. The command panel at the bottom shows the generated Homebrew commands.
5. Click "Copy" to copy the commands to your clipboard.
6. Paste into your terminal to execute.

![Brewiz Command Panel](https://brewiz.github.io/docs/images/brewiz-cmd.png)

## Command Line Options

```text
Usage: brewiz [options]
    -a, --address ADDRESS            Address to run Server on
    -p, --port PORT                  Port to run Server on
    -c, --cache                      Enable caching of brew info results
        --packages LOCATION          URL or file path to packages.yaml package list
        --no-open                    Do not open browser automatically
        --app-url URL                URL for frontend assets (dev only)
    -d, --dev                        Run in development mode
        --access                     Enable access log (dev only)
        --zsh-completion             Generate zsh completion script
    -v, --version                    Show version
    -h, --help                       Show this help message
```

## Package List YAML Format

Brewiz uses a YAML file to define package categories and packages. The loader automatically ignores any documentation or metadata sections at the top of the YAML file (such as `Title`, `Description`, or `Disclaimers`). Only the list of categories (with `id`, `name`, `desc`, and `packages`) is processed. This allows you to include documentation in your YAML file without affecting package loading.

## Development

### Prerequisites

- Node.js (v18 or higher)
- Ruby (v2.6, v3 or higher)

### Setup

1. Clone the repository:

```bash
git clone https://github.com/brewiz/brewiz.github.io.git
cd brewiz.github.io
```

2. Install dependencies:

```bash
rake install
```

3. Start the development environment:

```bash
rake dev
```

The backend server will be available at `http://localhost:8047` and the frontend dev server at `http://localhost:8048`.

### Version Management

Brewiz uses a central `VERSION` file at the root of the project to manage version information across all components.

### Building for Production

To create a production build:

```bash
rake build
```

The built files will be in the `app/dist` and `bin` directory.

### Rake Tasks

| Task | Description |
|------|-------------|
| `rake build` | Build production executable and frontend |
| `rake update_version` | Update version in all files |
| `rake build_frontend` | Build only the frontend |
| `rake clean` | Remove build artifacts |
| `rake install` | Install dependencies |
| `rake dev` | Start development environment |
| `rake publish` | Create and push a new version tag |
| `rake unpublish` | Remove the current version tag |

### Development Mode

When started in dev mode (`rake dev` or `ruby brewiz --dev`), Brewiz runs two separate processes that work together:

#### Backend Ruby Server

- Acts as the entry point for the application
- Runs on port 8047 (<http://localhost:8047>)
- Started with the `--dev` flag: `ruby brewiz --dev`
- Provides real Homebrew data via API endpoints (`/api/v1/*`)
- Handles package management operations through the Homebrew CLI
- In development mode, proxies frontend asset requests to the Vite dev server
- Changes to backend code require manual restart of the server

#### Frontend Development Server

- Runs on port 8048 (<http://localhost:8048>)
- Started automatically by the `rake dev` task
- Powered by Vite with hot module replacement (HMR)
- Serves the SolidJS application with live reloading
- Source maps are enabled for easier debugging
- Changes to components and styles are reflected instantly without page reloads

#### Development Workflow

1. The `rake dev` task starts both servers in the correct order.
2. The backend server (`brewiz --dev`) connects to the frontend dev server.
3. Make changes to backend Ruby code and restart when needed.
4. Make changes to frontend code and see them immediately.
5. API requests from the frontend are handled by the backend server.
6. The Rake task handles proper startup/shutdown of both servers.

### Production Mode

In production mode:

- Static files are loaded from the GitHub repository
- Frontend is optimized for production
- Only the backend server is started (default port 8047)

## Tech Stack

- [SolidJS](https://www.solidjs.com/) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vite](https://vitejs.dev/) - Build tool
- [Ruby](https://www.ruby-lang.org/) - Backend server

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/brewiz/brewiz.github.io/blob/main/LICENSE) file for details.
