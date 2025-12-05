export function generateBrewCommands(categories, selectedPackages, outdatedPackages) {
  const allPackages = categories.flatMap((c) => c.packages);
  const selectedPkgs = Array.from(selectedPackages)
    .map((name) => allPackages.find((p) => p.name === name))
    .filter(Boolean);
  const commands = [];

  if (selectedPkgs.length === 0) {
    commands.push("# Select packages to generate install and uninstall commands")
  } else {
    addInstallCommands(commands, selectedPkgs);
    addUninstallCommands(commands, selectedPkgs);
  }
  addOutdatedPackagesCommand(commands, outdatedPackages);
  commands.push("brew autoremove && brew cleanup # Consider running to remove unused dependencies and free disk space");

  return commands;
}

function addOutdatedPackagesCommand(commands, outdatedPackages) {
  if (outdatedPackages.length > 0) {
    commands.push(
      `brew upgrade # You have ${outdatedPackages.length} outdated package${outdatedPackages.length > 1 ? "s" : ""}`,
    );
  }
}

function addInstallCommands(commands, selectedPkgs) {
  const toInstall = selectedPkgs.filter((p) => !p.installed);

  const installCasks = toInstall
    .filter((p) => p.cask)
    .map((p) => {
      return p.tap ? `${p.tap}/${p.token}` : p.token;
    })
    .sort();

  const installFormulas = toInstall
    .filter((p) => !p.cask)
    .map((p) => {
      return p.tap ? `${p.tap}/${p.name}` : p.name;
    })
    .sort();

  if (installFormulas.length) {
    commands.push(`brew install --formula ${installFormulas.join(" ")}`);
  }

  if (installCasks.length) {
    commands.push(`brew install --cask ${installCasks.join(" ")}`);
  }
}

function addUninstallCommands(commands, selectedPkgs) {
  const toUninstall = selectedPkgs.filter((p) => p.installed);

  const uninstallCasks = toUninstall
  .filter((p) => p.cask)
  .map((p) => {
    return p.tap ? `${p.tap}/${p.token}` : p.token;
  })
  .sort();

  const uninstallFormulae = toUninstall
  .filter((p) => !p.cask)
  .map((p) => {
    return p.tap ? `${p.tap}/${p.name}` : p.name;
  })
  .sort();

  if (uninstallFormulae.length) {
    commands.push(`brew uninstall --formula ${uninstallFormulae.join(" ")}`);
  }

  if (uninstallCasks.length) {
    commands.push(`brew uninstall --cask ${uninstallCasks.join(" ")}`);
  }
}
