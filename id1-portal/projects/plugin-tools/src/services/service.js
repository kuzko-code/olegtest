const util = require("util");
const path = require("path");
const fs = require("fs-extra");
const pm2 = require("pm2");
const { Client } = require("pg");
const { ALL } = require("dns");

pm2.connectAsync = util.promisify(pm2.connect);
pm2.describeAsync = util.promisify(pm2.describe);
pm2.stopAsync = util.promisify(pm2.stop);
pm2.reloadAsync = util.promisify(pm2.reload);
pm2.disconnectAsync = util.promisify(pm2.disconnect);

const execShellCommand = util.promisify(require("child_process").exec);

const FULL_ACCESS_MODE =
  fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK;
const fullAccess = async path => {
  await fs.access(path, FULL_ACCESS_MODE);
};

const PLUGS_INFO_DIR = "pluginsInfo";
const ECOSYSTEM_FILE = "ecosystem.config.js";

const BACK_PLUGS_DIR = "backend/src/plugins";
const ADMIN_PLUGS_DIR = "admin/src/plugins";
const PUBL_PLUGS_DIR = "public/src/plugins";

const BACK_APP_NAME = "SoftlistCMS-backend";
const ADMIN_APP_NAME = "SoftlistCMS-admin";
const PUBL_APP_NAME = "SoftlistCMS-public";

const PLUGIN_INFO_FILE = "info.json";

class PortalService {
  async install(pathToProject, pathToPlugins, noBuild, ignoreErrorDB, force) {

    for (let i = 0; i < pathToPlugins.length; i++) {

      var pluginName = path.basename(pathToPlugins[i]);
      console.log(`Wait until the plugin '${pluginName}' is installed.`);

      await this._validateInstallation(pathToProject, pathToPlugins[i]);

      pluginName = await this._getPluginName(pathToPlugins[i]);

      var currentVersionOfThePlugin = await this._relevanceOfThePluginVersion(pathToProject, pathToPlugins[i], pluginName, force);

      if (currentVersionOfThePlugin != 0) await this._uninstallPluginContent(pathToProject, pluginName);

      await this._installPluginContent(pathToProject, pathToPlugins[i], pluginName, noBuild);

      await this._installDatabaseEntities(pathToPlugins[i], ignoreErrorDB, currentVersionOfThePlugin);

      if (currentVersionOfThePlugin != 0) {
        console.log(`✔ Plugin '${pluginName}' has been updated.`);
      } else {
        console.log(`✔ Plugin '${pluginName}' installed successfully.`);
      }
    }

    if (!noBuild) {
      await this._rebuildSourcesForPlugin(pathToProject);
    } else {
      console.log("✔ The sources wasn't rebuilt.");
    }
    await this._applyChanges();
  }

  async _getPluginName(pluginPath) {

    const fs = require('fs');
    let rawdata = fs.readFileSync(path.join(pluginPath, PLUGIN_INFO_FILE));
    let pluginInfo = JSON.parse(rawdata);
    return pluginInfo.name;

  }

  async _getSqlScripts(pathToPlugin, typeOfScripts) {
    var sqlFiles = [];

    fs.readdirSync(path.join(pathToPlugin))
      .forEach((file) => {
        var arrayOfParams = file.split('.');
        if (Number.isInteger(parseInt(arrayOfParams[0])) && arrayOfParams[1] === typeOfScripts && arrayOfParams[arrayOfParams.length - 1] === 'sql') {
          sqlFiles.push({ version: parseInt(arrayOfParams[0]), name: file, path: path.join(pathToPlugin, file) });
        }
      })
    sqlFiles = sqlFiles.sort((a, b) => {
      var Comparison = true;
      if (typeOfScripts === "undo") Comparison = a.version < b.version;
      if (typeOfScripts === "do") Comparison = a.version > b.version;

      if (Comparison) {
        return 1;
      } else {
        return -1;
      }
    });

    return sqlFiles;
  }

  async _validateInstallation(pathToProject, pathToPlugin) {

    console.log("Instalation is validating...");

    await this._validateProjectStructure(pathToProject);

    await this._validatePluginBuildStructure(pathToPlugin);

    console.log("✔ Instalation validated successfully.");
  }

  async _relevanceOfThePluginVersion(pathToProject, pathToPlugin, pluginName, force) {

    var isPluginAlreadyInstalled = await this._isPluginAlreadyInstalled(pathToProject, pluginName);
    var installedPlugin = 0;
    var installingPlugin = 0;

    if (isPluginAlreadyInstalled) {
      installedPlugin = await this._getPluginVersion(path.join(pathToProject, PLUGS_INFO_DIR, pluginName));
      installingPlugin = await this._getPluginVersion(pathToPlugin);

      if (installedPlugin >= installingPlugin & !force) {
        throw new Error(
          `✕ The plugin '${pluginName}' is already installed in the project on the path '${pathToProject}'`
        );
      }
    }
    return installedPlugin;
  }

  async _validateProjectStructure(pathToProject) {
    await fullAccess(pathToProject);

    await fullAccess(path.join(pathToProject, PLUGS_INFO_DIR));
    await fullAccess(path.join(pathToProject, ECOSYSTEM_FILE));

    await fullAccess(path.join(pathToProject, BACK_PLUGS_DIR));
    await fullAccess(path.join(pathToProject, ADMIN_PLUGS_DIR));
    await fullAccess(path.join(pathToProject, PUBL_PLUGS_DIR));
  }

  async _validatePluginBuildStructure(pathToPlugin) {
    await fullAccess(pathToPlugin);

    var doSqlScripts = await this._getSqlScripts(path.join(pathToPlugin, "database"), "do");
    var undoSqlScripts = await this._getSqlScripts(path.join(pathToPlugin, "database"), "undo");

    if (doSqlScripts.length === 0 || undoSqlScripts.length === 0)
      throw new Error(
        `✕ No such sql files`
      );

    await fullAccess(path.join(pathToPlugin, "backend"));
    await fullAccess(path.join(pathToPlugin, "admin/index.js"));
    await fullAccess(path.join(pathToPlugin, "public/index.js"));
    await fullAccess(path.join(pathToPlugin, PLUGIN_INFO_FILE));
  }

  async _isPluginAlreadyInstalled(pathToProject, pluginName) {
    const isAlreadyInstalled =
      (await fs.pathExists(
        path.join(pathToProject, PLUGS_INFO_DIR, pluginName)
      )) ||
      (await fs.pathExists(
        path.join(pathToProject, BACK_PLUGS_DIR, pluginName)
      )) ||
      (await fs.pathExists(
        path.join(pathToProject, ADMIN_PLUGS_DIR, pluginName)
      )) ||
      (await fs.pathExists(
        path.join(pathToProject, PUBL_PLUGS_DIR, pluginName)
      ));

    return isAlreadyInstalled;
  }

  async _getPluginVersion(pluginPath) {

    const fs = require('fs');
    let rawdata = fs.readFileSync(path.join(pluginPath, PLUGIN_INFO_FILE));
    let pluginInfo = JSON.parse(rawdata);
    var version = parseInt(pluginInfo.version);
    if (version) {
      return version;
    } else {
      throw new Error(
        `✕ Plugin version must be a number`
      );
    }
  }

  async _installPluginContent(pathToProject, pathToPlugin, pluginName) {
    console.log("Plugin content is installing...");

    await this._copyPluginInfo(pathToProject, pathToPlugin, pluginName);

    await fs.mkdir(path.join(pathToProject, BACK_PLUGS_DIR, pluginName));
    await fs.copy(
      path.join(pathToPlugin, "backend"),
      path.join(pathToProject, BACK_PLUGS_DIR, pluginName)
    );

    await fs.mkdir(path.join(pathToProject, ADMIN_PLUGS_DIR, pluginName));
    await fs.copy(
      path.join(pathToPlugin, "admin"),
      path.join(pathToProject, ADMIN_PLUGS_DIR, pluginName)
    );

    await fs.mkdir(path.join(pathToProject, PUBL_PLUGS_DIR, pluginName));
    await fs.copy(
      path.join(pathToPlugin, "public"),
      path.join(pathToProject, PUBL_PLUGS_DIR, pluginName)
    );
    console.log("✔ Plugin content installed successfully.");
  }

  async _copyPluginInfo(pathToProject, pathToPlugin, pluginName) {
    await fs.mkdir(path.join(pathToProject, PLUGS_INFO_DIR, pluginName));

    await fs.copy(
      path.join(pathToPlugin, PLUGIN_INFO_FILE),
      path.join(pathToProject, PLUGS_INFO_DIR, pluginName, PLUGIN_INFO_FILE)
    );

    await this._setDefaultValuesOfInstallation(pathToProject, pluginName);

    var undoSqlScripts = await this._getSqlScripts(path.join(pathToPlugin, "database"), "undo");
    for (const script of undoSqlScripts) {
      fs.copy(
        path.join(pathToPlugin, "database", script.name),
        path.join(pathToProject, PLUGS_INFO_DIR, pluginName, script.name)
      )
    }
  }

  async _setDefaultValuesOfInstallation(pathToProject, pluginName) {

    try {
      const pathToInfo = path.join(pathToProject, PLUGS_INFO_DIR, pluginName, PLUGIN_INFO_FILE);
      let rawdata = fs.readFileSync(pathToInfo);
      let pluginInfo = JSON.parse(rawdata);

      var jsonString = Object.assign(pluginInfo, { dateOfInstallation: new Date(), activate: true });
      await fs.writeFile(pathToInfo, JSON.stringify(jsonString))
    }
    catch (err) {
      throw new Error(err);
    }
  }

  async _installDatabaseEntities(pathToPlugin, ignoreErrorDB, currentVersionOfThePlugin) {
    console.log("Database entities is installing...");

    const connection = await this._getDbConnection();

    var doSqlScripts = await this._getSqlScripts(path.join(pathToPlugin, "database"), "do");

    doSqlScripts = doSqlScripts.filter(item => item.version > currentVersionOfThePlugin)

    for (const script of doSqlScripts) {
      await this._execSqlScript(path.join(pathToPlugin, "database", script.name), connection, ignoreErrorDB)
    }

    console.log("✔ Database entities installed successfully.");
  }

  async uninstall(pathToProject, pluginNames, noBuild) {
    for (let i = 0; i < pluginNames.length; i++) {

      var pluginName = pluginNames[i];

      console.log(`Wait until the plugin '${pluginName}' is uninstalled.`);

      await this._validateUninstallation(pathToProject, pluginName);

      await this._uninstallDatabaseEntities(pathToProject, pluginName);

      await this._uninstallPluginContent(pathToProject, pluginName);

      console.log(`✔ Plugin '${pluginName}' deleted successfully.`);
    }

    if (!noBuild) {
      await this._rebuildSourcesForPlugin(pathToProject);
    } else {
      console.log("✔ The sources wasn't rebuilt.");
    }
    await this._applyChanges();
  }

  async _validateUninstallation(pathToProject, pluginName) {
    console.log("Uninstalation is validating...");

    await fullAccess(pathToProject);

    await fullAccess(path.join(pathToProject, PLUGS_INFO_DIR, pluginName));
    await fullAccess(path.join(pathToProject, BACK_PLUGS_DIR, pluginName));
    await fullAccess(path.join(pathToProject, ADMIN_PLUGS_DIR, pluginName));
    await fullAccess(path.join(pathToProject, PUBL_PLUGS_DIR, pluginName));

    console.log("✔ Uninstalation validated successfully.");
  }

  async _uninstallDatabaseEntities(pathToProject, pluginName) {
    console.log("Database entities is uninstalling...");

    const connection = await this._getDbConnection();

    var undoSqlScripts = await this._getSqlScripts(path.join(pathToProject, PLUGS_INFO_DIR, pluginName), "undo");
    for (const script of undoSqlScripts) {
      await this._execSqlScript(path.join(pathToProject, PLUGS_INFO_DIR, pluginName, script.name), connection)
    }

    console.log("✔ Database entities uninstalled successfully.");
  }

  async _uninstallPluginContent(pathToProject, pluginName) {
    console.log("Plugin content is uninstalling...");

    await fs.remove(path.join(pathToProject, PLUGS_INFO_DIR, pluginName));

    await fs.remove(path.join(pathToProject, BACK_PLUGS_DIR, pluginName));

    await fs.remove(path.join(pathToProject, ADMIN_PLUGS_DIR, pluginName));

    await fs.remove(path.join(pathToProject, PUBL_PLUGS_DIR, pluginName));

    console.log("✔ Plugin content uninstalled successfully.");
  }

  async _rebuildSourcesForPlugin(pathToProject) {
    console.log("The sources is being rebuilt...");

    await execShellCommand("npm run compile", {
      cwd: path.join(pathToProject, "backend")
    });
    
    await execShellCommand("npm run build", {
      cwd: path.join(pathToProject, "admin")
    });
    
    await execShellCommand("npm run build", {
      cwd: path.join(pathToProject, "public")
    });

    console.log("✔ The sources was rebuilt.");
  }

  async updateProject(pathToProject) {
    await this._installNewPackages(pathToProject);
    await this._rebuildServicesSources(pathToProject);
  }

  async _installNewPackages(pathToProject) {
    console.log("The sources is being install npm packages...");

    await execShellCommand("npm ci", {
      cwd: path.join(pathToProject, "db_migrate")
    });

    await execShellCommand("npm ci", {
      cwd: path.join(pathToProject, "plugin-tools")
    });

    await execShellCommand("npm ci", {
      cwd: path.join(pathToProject, "backend")
    });

    await execShellCommand("npm ci", {
      cwd: path.join(pathToProject, "admin")
    });

    await execShellCommand("npm ci", {
      cwd: path.join(pathToProject, "public")
    });    

    console.log("✔ Npm packages was installed.");
  }

  async _rebuildServicesSources(pathToProject) {
    console.log("The sources is being rebuilt...");

    await execShellCommand("npm install -g", {
      cwd: path.join(pathToProject, "plugin-tools")
    });

    await execShellCommand("npm run compile", {
      cwd: path.join(pathToProject, "backend")
    });
    
    await execShellCommand("npm run build", {
      cwd: path.join(pathToProject, "admin")
    });
    
    await execShellCommand("npm run build", {
      cwd: path.join(pathToProject, "public")
    });

    await execShellCommand("npm run compile", {
      cwd: path.join(pathToProject, "db_migrate")
    });

    await execShellCommand("npm run migrate", {
      cwd: path.join(pathToProject, "db_migrate")
    });

    console.log("✔ The sources was rebuilt.");

    console.log("Applying changes...");
    await pm2.reload.ALL;
    console.log("✔ Changes applied.");
  }

  async _getDbConnection() {
    await pm2.connectAsync();
    const backendEnv = (await pm2.describeAsync(BACK_APP_NAME))[0].pm2_env;
    await pm2.disconnectAsync();

    const connection = {
      host: backendEnv.DB_HOST,
      port: parseInt(backendEnv.DB_PORT),
      user: backendEnv.DB_USER,
      password: backendEnv.DB_PASSWORD,
      database: backendEnv.DB_NAME
    };
    return connection;
  }

  async _execSqlScript(pathToScript, connection, ignoreErrorDB) {
    const script = await fs.readFile(pathToScript, "utf-8");
    
    const client = new Client(connection);
    await client.connect();

    try {
      await this._execSqlByTransaction(script, client, ignoreErrorDB);
    } finally {
      client.end();
    }
  }

  async _execSqlByTransaction(sql, client, ignoreErrorDB) {
    const statements = sql.split("[GO]");
    statements.pop();

    try {
      await client.query("BEGIN");

      for (const statement of statements) {
        await client.query(statement);
      }

      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      if (!ignoreErrorDB) throw e;
    }
  }

  async _applyChanges() {
    console.log("Applying changes...");
    try {
      await pm2.connectAsync(); 
      await pm2.reload.ALL;
      await pm2.disconnectAsync();
    } catch (e) {
      throw e;
    }

    console.log("✔ Changes applied.");
  }
}

module.exports = PortalService;
