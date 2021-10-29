const path = require("path");

const PortalService = require("../../services/service");
const pluginsService = new PortalService();

exports.command = "portal_update <project>";

exports.describe = "Update portal <project>";

exports.builder = yargs => {
  yargs
    .positional("project", {
      type: "string",
    })
};


exports.handler = async function(argv) {
  try {
    await pluginsService.updateProject(argv.project);
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};