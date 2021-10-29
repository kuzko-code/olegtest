import { IncomingMessage, ServerResponse } from "http";
import {
  MicroController,
  Catch,
  handler_context,
  AcceptACL,
  Decoder,
  DecodeAccessToken,
  Send,
  ParseBody,
} from "../../etc/http/micro_controller";
const formidable = require("formidable");

import { verifyToken } from "../../handlers/jwt";

import { plugins_info_with_validation } from "../../domains/pluginsInfo";

class Controller implements MicroController {
  @Catch
  @Send(200)
  async GET(req: IncomingMessage, res: ServerResponse) {
    return plugins_info_with_validation.get_plugins({});
  }

  @Catch
  @Send(200)
  @DecodeAccessToken(verifyToken as Decoder)
  @AcceptACL(["root_admin", "global_admin"])
  @ParseBody
  async PUT(req: IncomingMessage, res: ServerResponse) {
    const { body } = req;
    return plugins_info_with_validation.activate_plugin({
      ...(<any>body),
    });
  }

  @Catch
  @Send(200)
  @DecodeAccessToken(verifyToken as Decoder)
  @AcceptACL(["root_admin", "global_admin"])
  async POST(req: IncomingMessage, res: ServerResponse) {
    let bodyFile;

    let form = new formidable.IncomingForm();
    form.maxFileSize = 100 * 1024 * 1024;

    await new Promise((resolve, reject) => {
      form.parse(req, (err: string, fields: any, files: any) => {
        if (err) {
          reject(err);
          return;
        }
        bodyFile = files.file;
        resolve();
      });
    });

    return plugins_info_with_validation.install_plugin({
      bodyFile: { ...(<any>bodyFile) },
    });
  }
}

export = new Controller();
