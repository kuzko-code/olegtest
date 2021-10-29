import { IncomingMessage, ServerResponse } from "http";
import {
  MicroController,
  Catch,
  handler_context,
  Decoder,
  DecodeAccessToken,
  Send,
  ParseBody,
} from "../../../etc/http/micro_controller";

import { verifyToken } from "../../../handlers/jwt";

import { authorization } from "../../../domains/auth";

class Controller implements MicroController {
  @Catch
  @Send(200)
  @ParseBody
  async PUT(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
    const { body } = req;

    return authorization.confirmation_password({
      ...(<any>body),
      typeOfUser: "visitors",
    });
  }
}

export = new Controller();
