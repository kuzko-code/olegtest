import { IncomingMessage, ServerResponse } from "http";
import {
  MicroController,
  Catch,
  handler_context,
  Decoder,
  DecodeAccessToken,
  Send,
} from "../../etc/http/micro_controller";

import { verifyToken } from "../../handlers/jwt";

class Controller implements MicroController {
  @Catch
  @Send(200)
  @DecodeAccessToken(verifyToken as Decoder)
  async GET(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
    return ctx;
  }
}

export = new Controller();
