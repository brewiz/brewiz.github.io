export function packageToken(pkg) {
  return (pkg?.token || pkg?.id?.split("/").pop() || pkg?.name || "").toString();
}

export function packageKey(pkg) {
  return (pkg?.id || packageToken(pkg)).toString();
}

export function packageDisplayName(pkg) {
  const name = (pkg?.name || packageToken(pkg) || pkg?.id || "").toString();
  const token = packageToken(pkg);

  if (token.includes("@") && name !== token && !name.includes(token)) {
    return `${name} (${token})`;
  }

  return name;
}

export function packageSearchText(pkg) {
  return [
    pkg?.name,
    pkg?.desc,
    pkg?.id,
    pkg?.homepage,
    pkg?.info,
    ...(Array.isArray(pkg?.tags) ? pkg.tags : []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function brewPackageArgument(pkg) {
  const id = pkg?.id?.toString();
  if (id && !id.startsWith("homebrew/core/") && !id.startsWith("homebrew/cask/")) {
    return id;
  }

  return packageToken(pkg);
}
