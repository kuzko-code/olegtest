import { IncomingMessage, ServerResponse } from "http";
import {
  MicroController,
  handler_context,
  Catch,
  Send,
  DecodeAccessToken,
  Decoder,
  ParseBody,
  AcceptACL,
} from "../../etc/http/micro_controller";

import { verifyToken } from "../../handlers/jwt";

import { tabs_schema_with_validation } from "../../domains/schemas";

class Controller implements MicroController {
  path = "/schemas";

  @Catch
  @Send(200)
  @DecodeAccessToken(verifyToken as Decoder)
  @AcceptACL(["root_admin", "global_admin"])
  async GET(req: IncomingMessage, res: ServerResponse) {
    const ids = req.query.ids
      ? req.query.ids.split(",").map((id: string) => parseInt(id))
      : null;

    return tabs_schema_with_validation.get_tabs_schema({
      ids,
    });
  }

  @Catch
  @Send(200)
  @DecodeAccessToken(verifyToken as Decoder)
  @AcceptACL(["root_admin", "global_admin"])
  @ParseBody
  async POST(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
    const { body } = req;

    return tabs_schema_with_validation.create_tabs_schema({
      ...(<any>body),
    });
  }

  @Catch
  @Send(200)
  @DecodeAccessToken(verifyToken as Decoder)
  @AcceptACL(["root_admin", "global_admin"])
  @ParseBody
  async PUT(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
    const { body } = req;
    return tabs_schema_with_validation.update_tabs_schema({
      ...(<any>body),
      ctx,
    });
  }

  @Catch
  @Send(200)
  @DecodeAccessToken(verifyToken as Decoder)
  @AcceptACL(["root_admin", "global_admin"])
  async DELETE(
    req: IncomingMessage,
    res: ServerResponse,
    ctx: handler_context
  ) {
    const ids = req.query.ids
      ? req.query.ids.split(",").map((id: string) => parseInt(id))
      : null;

    return tabs_schema_with_validation.delete_tabs_schema({
      ids,
    });
  }
}

export = new Controller();
