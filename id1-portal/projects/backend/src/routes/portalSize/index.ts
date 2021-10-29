import { IncomingMessage, ServerResponse } from "http";
import {
  MicroController,
  DecodeAccessToken,
  Catch,
  Send,
  Decoder,
  handler_context,
} from "../../etc/http/micro_controller";
import { portal_size_with_validation } from "../../domains/portalSize";
import { verifyToken } from "../../handlers/jwt";

class Controller implements MicroController {
  @Catch
  @Send(200)
  @DecodeAccessToken(verifyToken as Decoder)
  async GET(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
    const dir: string[] = req.query.dir
      ? req.query.dir.split(",")
      : [
          process.env.ATTACHMENT_LOCAL_PATH!,
          process.env.PRIVATE_ATTACHMENT_LOCAL_PATH!,
        ];

    return portal_size_with_validation.get_portal_folder_size({
      directory: dir,
      ctx: ctx,
    });
  }
}

export = new Controller();
