#!/usr/bin/env node

const yargs = require("yargs");

const install_plugin = require("../src/commands/plugins/install");
const uninstall_plugin = require("../src/commands/plugins/uninstall");
const portal_update = require("../src/commands/portal/update");

yargs
  .scriptName("OGP")
  .usage("$0 <cmd> [args]")
  .command(install_plugin)
  .command(uninstall_plugin)
  .command(portal_update)
  .help().argv;
