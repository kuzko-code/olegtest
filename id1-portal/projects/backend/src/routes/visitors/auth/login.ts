import { IncomingMessage, ServerResponse } from "http";

import {
  MicroController,
  Catch,
  Send,
  ParseBody,
} from "../../../etc/http/micro_controller";

import { authorization } from "../../../domains/auth";

class Controller implements MicroController {
  @Catch
  @Send(200)
  @ParseBody
  async POST(req: IncomingMessage, res: ServerResponse) {
    const { body } = req;

    return authorization.user_login({
      ...(<any>body),
      typeOfUser: "visitors",
    });
  }
}

export = new Controller();
