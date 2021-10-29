const path = require("path");

const PortalService = require("../../services/service");
const pluginsService = new PortalService();

exports.command = "install_plugin <project> <plugins>  [noBuild] [ignoreErrorDB] [force]";

exports.describe = "Install plugins";

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
      describe: "Path to plugins",
      normalize: true
    })
    .option({'noBuild': {
      type: 'boolean',
      default: false
    },
      'ignoreErrorDB': {
      type: 'boolean',
      default: false
    },
    'force': {
    type: 'boolean',
    default: false
  }});
};

exports.handler = async function (argv) {
  try {
    var plugins = argv.plugins.split(',');
    for (let i = 0; i < plugins.length; i++) {
      plugins[i] = path.resolve(plugins[i]);
    }
    
    await pluginsService.install(argv.project, plugins, argv.noBuild, argv.ignoreErrorDB, argv.force);
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
