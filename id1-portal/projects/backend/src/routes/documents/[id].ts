import { IncomingMessage, ServerResponse } from "http";
import { documents_with_validation } from "../../domains/documents";
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
  path = "/documents/:id";
  priority = 2;

  @Catch
  @Send(200)
  async GET(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
    const { query } = req;

    const selectedFields = query.fields ? query.fields.split(",") : null;

    return documents_with_validation.get_document_by_id({
      id: req.params.id,
      selectedFields: selectedFields,
    });
  }

  @Catch
  @Send(200)
  @DecodeAccessToken(verifyToken as Decoder)
  async DELETE(
    req: IncomingMessage,
    res: ServerResponse,
    ctx: handler_context
  ) {
    return documents_with_validation.delete_document_by_id({
      id: req.params.id,
      ctx: ctx,
    });
  }
}

export = new Controller();
