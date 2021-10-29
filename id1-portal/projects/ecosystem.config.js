const npmPath = "C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js";
const platform = process.platform;
let npm;

if (platform === "win32") {
  npm = npmPath;
} else {
  npm = "npm";
}

module.exports = {
  apps: [
    {
      name: "SoftlistCMS-backend",
      script: npm,
      args: "start",
      cwd: "./backend",
      autorestart: true,
      max_memory_restart: "1G"
    },
    {
      name: "SoftlistCMS-admin",
      script: npm,
      args: "start",
      cwd: "./admin",
      autorestart: true,
      max_memory_restart: "1G",
    },
    {
      name: "SoftlistCMS-public",
      script: npm,
      args: "start",
      cwd: "./public",
      autorestart: true,
      max_memory_restart: "1G",
    },
    {
      name: "install-plugin",
      script: npm,
      args: "start",
      cwd: "./installPlugin",
      autorestart: false,
      max_memory_restart: "1G"
    }
  ]
};
