import {
  Catch,
  handler_context,
  MicroController,
  Decoder,
  DecodeAccessToken,
} from "../../etc/http/micro_controller";
import { verifyToken } from "../../handlers/jwt";
import { IncomingMessage, ServerResponse } from "http";
import { privateattachments_with_validation } from "../../domains/privateattachments";

class Controller implements MicroController {
  priority = 1;
  path = "/privateattachments/:name";

  @Catch
  @DecodeAccessToken(verifyToken as Decoder)
  async GET(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
    const name = req.params.name ? req.params.name : null;
    let result =
      await privateattachments_with_validation.get_privateattachments(<any>{
        name: name,
        ctx: ctx,
      });

    res.writeHead(200, {
      "Content-Type": "application/octet-stream",
      "Content-disposition":
        "attachment;filename*=UTF-8''" + encodeURIComponent(result?.fileName),
    });
    res.end(result?.fileContent);
  }
}

export = new Controller();
