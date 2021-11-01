import { IncomingMessage, ServerResponse } from "http";
import {
  MicroController,
  Catch,
  handler_context,
  Decoder,
  DecodeAccessToken,
  Send,
  ParseBody,
} from "../../etc/http/micro_controller";

import { verifyToken } from "../../handlers/jwt";

import { settings_with_validation } from "../../domains/settings";

class Controller implements MicroController {
  path = "/settings/:title";

  @Catch
  @Send(200)
  async GET(req: IncomingMessage, res: ServerResponse) {
    const title = req.params.title;
    const language = req.query.language;
    return settings_with_validation.get_site_settings_by_title({
      title,
      language: language,
    });
  }

  @Catch
  @Send(200)
  @DecodeAccessToken(verifyToken as Decoder)
  @ParseBody
  async PUT(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
    const title = req.params.title;
    const settings_object = req.body;
    const language = req.query.language;
    return settings_with_validation.update_site_settings({
      settings: [
        {
          title,
          settings_object,
        },
      ],
      language: language,
      ctx,
    });
  }
}

export = new Controller();
