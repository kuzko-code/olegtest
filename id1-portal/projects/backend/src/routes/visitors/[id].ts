import { IncomingMessage, ServerResponse } from "http";
import {
  MicroController,
  Catch,
  handler_context,
  Decoder,
  DecodeAccessToken,
  AcceptACL,
  Send,
} from "../../etc/http/micro_controller";

import { verifyGeneralToken, verifyToken } from "../../handlers/jwt";

import { visitors_with_validation } from "../../domains/visitors";

class Controller implements MicroController {
  path = "/visitors/:id";

  @Catch
  @Send(200)
  @DecodeAccessToken(verifyGeneralToken as Decoder)
  @AcceptACL(["root_admin", "global_admin", "visitor"])
  async GET(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
    const { query } = req;

    const selectedFields = query.fields ? query.fields.split(",") : null;
    return visitors_with_validation.get_visitor_by_id({
      id: parseInt(req.params.id),
      selectedFields,
      ctx,
    });
  }

  @Catch
  @Send(200)
  @DecodeAccessToken(verifyToken as Decoder)
  // @AcceptACL(["root_admin", "global_admin"])
  async DELETE(
    req: IncomingMessage,
    res: ServerResponse,
    ctx: handler_context
  ) {
    return visitors_with_validation.delete_visitor({
      id: parseInt(req.params.id),
      ctx,
    });
  }
}

export = new Controller();
