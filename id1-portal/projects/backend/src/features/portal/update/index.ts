import { db } from "../../../db";
import { method_payload } from "../../base_api_image";
import { update_portal_payload } from "./types";
import * as path from "path";
import util from "util";
import { UpdatePortalServices } from "../../../helper/updatePortal";
import { apiServices } from "../../../helper/apiServices";
import { Messages } from "../../messages";
import { CryptoServices } from "../../../helper/crypt";
import { private_key } from "../../../config/index";
import { Version } from "../version/index";
const fetch = require("node-fetch");
const fs = require("fs");
const unzipper = require("unzipper");
const execShellCommand = util.promisify(require("child_process").exec);
class Api {
  _pathToProject = path.resolve(path.dirname(require.main!.filename), "../../");
  _notDeletedFolder = [
    path.join("/admin/build"),
    path.join("/public/build"),
    path.join("/backend/dist"),
    path.join("/backend/package-lock.json"),
    path.join("/backend/package.json"),
    path.join("/backend/tsconfig.json"),
    path.join("/admin/node_modules"),
    path.join("/public/node_modules"),
    path.join("/backend/node_modules"),
    path.join("/plugin-tools/node_modules"),
    path.join("/admin/src/plugins"),
    path.join("/public/src/plugins"),
    path.join("/backend/src/plugins"),
    path.join("/pluginsInfo"),
    path.join("/.git"),
    path.join("/ecosystem.config.js"),
  ];
  _notDeletedFile = [
    path.join("/backend/package-lock.json"),
    path.join("/backend/package.json"),
    path.join("/backend/tsconfig.json"),
    path.join("/ecosystem.config.js"),
  ];
  _notDeletedRecursiveFolders = [
    path.join("/admin"),
    path.join("/public"),
    path.join("/backend"),
    path.join("/plugin-tools"),
    path.join("/admin/src"),
    path.join("/public/src"),
    path.join("/backend/src"),
  ];
  public async update_portal({
    options: { version },
    client = db,
  }: method_payload<update_portal_payload>) {
    let OGPMarketUrl = await UpdatePortalServices.getOGPMarketUrl();
    let authenticationInOGPMarket =
      await UpdatePortalServices.getOGPMarketCredentials();
    let currentVersion = await UpdatePortalServices.getPortalVersion();

    console.log("Start updating the portal " + version);

    let versionValidate = await this.validateVersion(
      OGPMarketUrl,
      currentVersion,
      version
    );
    let servicePack = await fetch(
      OGPMarketUrl + `/servicePack/${versionValidate}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${authenticationInOGPMarket.email}:${authenticationInOGPMarket.hash}`
          ).toString("base64")}}`,
        },
      }
    ).then(async (res: any) => {
      if (res.status != "200") throw new Error(res.status);
      return res.body;
    });

    await this.walker(this._pathToProject);

    await new Promise((resolve, reject) => {
      servicePack
        .pipe(unzipper.Extract({ path: this._pathToProject }))
        .on("close", async function () {
          resolve();
        });
    });

    const { pluginToolsIStdout, stderr1: pluginToolsIStderr } =
      await await execShellCommand("npm i", {
        cwd: path.join(this._pathToProject, "plugin-tools"),
      });

    console.log(JSON.stringify(pluginToolsIStdout));
    console.log(JSON.stringify(pluginToolsIStderr));

    const { pluginToolsInstallGStdout, stderr2: pluginToolsInstallGStderr2 } =
      await await execShellCommand("npm install -g", {
        cwd: path.join(this._pathToProject, "plugin-tools"),
      });

    console.log(JSON.stringify(pluginToolsInstallGStdout));
    console.log(JSON.stringify(pluginToolsInstallGStderr2));

    const command = `OGP portal_update ${this._pathToProject}`;
    const { stdout, stderr } = await execShellCommand(command);
    console.log(JSON.stringify(stdout));
    console.log(JSON.stringify(stderr));
    return await this.setSettingsAfterUpdatePortal(
      OGPMarketUrl,
      currentVersion,
      versionValidate
    );
  }

  private async validateVersion(
    OGPMarketUrl: string,
    currentVersion: string,
    version: string
  ) {
    try {
      return await apiServices
        .getDataFromExternalResource(
          OGPMarketUrl,
          "/PortalVersion/allowedToUpgrade",
          { currentVersion: currentVersion, newVersion: version },
          "GET",
          null
        )
        .then((res) => res.version);
    } catch {
      throw new Error("The version is not relevant");
    }
  }

  private async setSettingsAfterUpdatePortal(
    OGPMarketUrl: string,
    currentVersion: string,
    version: string,
    client = db
  ) {
    const date = new Date(Date.now());
    const portalUpdateHistory = `select public.update_portal_version($1, $2)`;
    await Version.versionSynchronization(
      OGPMarketUrl,
      currentVersion,
      version,
      date
    );
    await client.query(portalUpdateHistory, [version, date]);

    Messages.create_message({
      options: {
        title: `Встановлено нову версію ${version}`,
        link: `/update/${version}`,
      },
    });
    return version;
  }

  private async walker(src: string) {
    if (src) {
      let dir = fs.readdirSync(src);
      for (let name of dir) {
        path.dirname;
        if (fs.lstatSync(path.join(src, name)).isDirectory()) {
          let folderIsDeletedFolder = this._notDeletedFolder.includes(
            path.join(src, name).replace(this._pathToProject, "")
          );
          let folderIsDeletedRecursiveFolders =
            this._notDeletedRecursiveFolders.includes(
              path.join(src, name).replace(this._pathToProject, "")
            );

          if (!folderIsDeletedFolder && !folderIsDeletedRecursiveFolders) {
            fs.rmdirSync(path.join(src, name), { recursive: true });
          } else if (folderIsDeletedRecursiveFolders) {
            await this.walker(path.join(src, name));
          }
        } else {
          let filePath = path.join(src, name);
          if (
            !this._notDeletedFile.includes(
              filePath.replace(this._pathToProject, "")
            )
          )
            await fs.unlinkSync(filePath);
        }
      }
    }
  }
}
export const UpdatePortal = new Api();
