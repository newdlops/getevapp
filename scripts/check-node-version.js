const requiredVersion = [20, 19, 4];

function parseVersion(version) {
  const parts = String(version).split(".").map((part) => Number(part));
  return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0];
}

function isVersionGte(current, required) {
  for (let index = 0; index < 3; index += 1) {
    if (current[index] > required[index]) return true;
    if (current[index] < required[index]) return false;
  }
  return true;
}

const currentVersion = parseVersion(process.versions.node);

if (!isVersionGte(currentVersion, requiredVersion)) {
  const requiredText = requiredVersion.join(".");
  console.error(
    [
      `Node.js ${process.versions.node} detected.`,
      `This project requires Node.js >=${requiredText}.`,
      "",
      "Fix:",
      `- Install Node.js ${requiredText}+ (e.g. via nvm/volta/asdf/homebrew).`,
      "- Reinstall dependencies (`rm -rf node_modules && npm ci`).",
    ].join("\n"),
  );
  process.exit(1);
}

