import { IncomingMessage, ServerResponse } from "http";
import {
  MicroController,
  Catch,
  handler_context,
  Send,
  Decoder,
	ParseBody,
  DecodeAccessToken
} from "../../../etc/http/micro_controller";
import { Helper } from '../../../helper';
import { verifyToken } from '../../../handlers/jwt';
import { tabs_with_validation } from "../../../domains/tabs";

class Controller implements MicroController {
  path = "/settings/locationOfBanners/preview";

  @Catch
  @Send(200)
  async GET(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {   
    const language = req.query.language;
    return tabs_with_validation.get_preview_tabs(<any>{language});
  }
}

export = new Controller();
