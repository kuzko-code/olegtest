const path = require("path");

const PortalService = require("../../services/service");
const pluginsService = new PortalService();

exports.command = "uninstall_plugin <project> <plugins> [noBuild]";

exports.describe = "Uninstall plugin";

exports.builder = yargs => {
  yargs
    .positional("project", {
      type: "string",
      describe: "Path to project folder",
      normalize: true,
      coerce: project => path.resolve(project)
    })
    .positional("plugins", {
      type: "string",
      describe: "Plugin name"
    })
    .option('noBuild', {
      type: 'boolean'
    });
};

exports.handler = async function(argv) {
  try {
    await pluginsService.uninstall(argv.project, argv.plugins.split(","), argv.noBuild);
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
