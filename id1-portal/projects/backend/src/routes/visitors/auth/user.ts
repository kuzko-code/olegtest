import { IncomingMessage, ServerResponse } from "http";
import {
  MicroController,
  Catch,
  handler_context,
  Decoder,
  DecodeAccessToken,
  Send,
  AcceptACL,
} from "../../../etc/http/micro_controller";
import { visitors_with_validation } from "../../../domains/visitors";
import { verifyVisitorToken } from "../../../handlers/jwt";

class Controller implements MicroController {
  @Catch
  @Send(200)
  @DecodeAccessToken(verifyVisitorToken as Decoder)
  @AcceptACL(["visitor"])
  async GET(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
    return ctx;
  }

  @Catch
  @Send(200)
  @DecodeAccessToken(verifyVisitorToken as Decoder)
  @AcceptACL(["visitor"])
  async DELETE(
    req: IncomingMessage,
    res: ServerResponse,
    ctx: handler_context
  ) {
    return visitors_with_validation.delete_me({
      id: parseInt(ctx.userId!),
    });
  }
}

export = new Controller();
