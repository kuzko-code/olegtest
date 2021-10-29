import path from "path";
import { promises as fs } from "fs";
import { EXCEPTION_MESSAGES } from "../../constants";

import { method_payload } from "../base_api_image";
import {
  get_plugins_payload,
  get_plugin_by_name_payload,
  delete_plugin_by_name_payload,
  activate_plugin_payload,
  install_plugins_payload,
} from "./types";

import util from "util";
const execShellCommand = util.promisify(require("child_process").exec);

class Api {
  _rootFolder = path.dirname(require.main!.filename);
  _pluginsFolder = path.resolve(this._rootFolder, "../../pluginsInfo");

  private async getPluginsList() {
    const pluginNames = (
      await fs.readdir(this._pluginsFolder, { withFileTypes: true })
    )
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    return pluginNames;
  }

  private async getPluginInfo(pluginName: string) {
    try {
      const pathToInfo = path.resolve(
        this._pluginsFolder,
        pluginName,
        "info.json"
      );
      const fileContent = await fs.readFile(pathToInfo);
      const plugin = JSON.parse(fileContent.toString());

      return plugin;
    } catch (err) {
      return {};
    }
  }

  public async get_plugins({ options }: method_payload<get_plugins_payload>) {
    const pluginNames = await this.getPluginsList();

    const plugins = [];
    for (const pluginName of pluginNames) {
      const plugin = await this.getPluginInfo(pluginName);
      plugins.push(plugin);
    }

    return plugins;
  }

  public async get_plugin_by_name({
    options: { name },
  }: method_payload<get_plugin_by_name_payload>) {
    const plugin = this.getPluginInfo(name);
    return plugin;
  }

  public async delete_plugin_by_name({
    options: { name },
  }: method_payload<delete_plugin_by_name_payload>) {
    const pathToProject = path.resolve(this._rootFolder, "../../");
    const command = `OGP uninstall_plugin ${pathToProject} ${name}`;
    const { stdout, stderr } = await execShellCommand(command);
    console.log(stdout);
    console.log(stderr);
    return {};
  }

  public async install_plugin({
    options: { bodyFile },
  }: method_payload<install_plugins_payload>) {
    const namesInspalledPlugin = await this.getPluginsList();

    const fs = require("fs");
    const unzipper = require("unzipper");
    const rimraf = require("rimraf");

    const pathToTempPlugin = path.resolve(this._rootFolder, "../temp");

    const pathToProject = path.resolve(this._rootFolder, "../../");

    const unzipperPlugin = new Promise((resolve, reject) => {
      fs.createReadStream(bodyFile.path)
        .pipe(unzipper.Extract({ path: "./temp" }))
        .on("close", async function () {
          resolve();
        });
    });
    try {
      await unzipperPlugin.then(async () => {
        let pathToPlugin = path.resolve(
          pathToTempPlugin,
          await fs.readdirSync(pathToTempPlugin)[0]
        );
        const command = `OGP install_plugin ${pathToProject} ${pathToPlugin}`;
        const { stdout, stderr } = await execShellCommand(command);
        console.log(stdout);
        console.log(stderr);

        rimraf.sync(pathToTempPlugin);
        return {};
      });
    } catch (err) {
      try {
        rimraf.sync(pathToTempPlugin);
      } catch {}
      const pluginNamesAfterInstall = await this.getPluginsList();
      const nameInstalledPlugin = pluginNamesAfterInstall.filter((plugin) => {
        return !namesInspalledPlugin.includes(plugin);
      });

      if (nameInstalledPlugin && nameInstalledPlugin.length > 0) {
        await this.delete_plugin_by_name({
          options: { name: nameInstalledPlugin[0] },
        });
      }
      throw new Error(err);
    }
  }

  public async activate_plugin({
    options: { name, activate },
  }: method_payload<activate_plugin_payload>) {
    const fs = require("fs");

    try {
      const pathToInfo = path.resolve(this._pluginsFolder, name, "info.json");
      const plugin = await this.getPluginInfo(name);

      let jsonString = Object.assign(plugin, { activate: activate });
      await fs.writeFile(pathToInfo, JSON.stringify(jsonString), (err: any) => {
        if (err) {
          throw new Error(EXCEPTION_MESSAGES.ON_UNHANDLED_ERROR_EXCEPTION);
        }
      });

      return jsonString;
    } catch (err) {
      throw new Error(err);
    }
  }

  public async getAdminMenuForPlugin() {
    const pluginsInfo = await this.get_plugins({ options: {} });
    let adminNavigationForPlugins: any[] = [];

    pluginsInfo.map((plugin) => {
      let pluginPages = [];

      if (plugin.activate) {
        if (plugin.adminPages) {
          pluginPages = plugin.adminPages.map(function (pages: any) {
            let res = {
              permission: `plugins_${plugin.name}${pages.url}`,
              name: pages.name,
              label: pages.translateName,
              to: `/plugins/${plugin.name}${pages.url}`,
            };
            return res;
          });
        }
      }

      if (pluginPages.length > 1) {
        let itemAdminNavigation = {
          permission: `plugins_${plugin.name}`,
          content: pluginPages,
          icon: plugin.icon ? plugin.icon : "",
          label: plugin.translateDisplayName,
          name: plugin.displayName,
          description: plugin.description,
          translateDescription: plugin.translateDescription,
        };

        plugin.content = pluginPages;
        adminNavigationForPlugins.push(itemAdminNavigation);
      } else if (pluginPages.length === 1) {
        let test = {
          permission: `plugins_${plugin.name}`,
          icon: plugin.icon ? plugin.icon : "",
          label: pluginPages[0].label,
          name: plugin.displayName,
          description: plugin.description,
          translateDescription: plugin.translateDescription,
          to: `${pluginPages[0].to}`,
        };
        adminNavigationForPlugins.push(test);
      }
    });
    return adminNavigationForPlugins;
  }
}

export const PluginsInfo = new Api();
