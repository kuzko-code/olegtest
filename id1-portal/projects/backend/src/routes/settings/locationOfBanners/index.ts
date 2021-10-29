import { IncomingMessage, ServerResponse } from "http";
import {
  MicroController,
  Catch,
  handler_context,
  Send,
  Decoder,
  ParseBody,
  DecodeAccessToken,
} from "../../../etc/http/micro_controller";
import { Helper } from "../../../helper";
import { verifyToken } from "../../../handlers/jwt";
import { tabs_with_validation } from "../../../domains/tabs";

class Controller implements MicroController {
  path = "/settings/locationOfBanners";

  @Catch
  @Send(200)
  async GET(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
    const language = req.query.language;
    const selectedFields = req.query.fields
      ? req.query.fields.split(",")
      : null;

    const filters = {
      position: req.query.position,
      enabled: req.query.enabled
        ? Helper.parseBoolean(req.query.enabled)
        : null,
    };

    return tabs_with_validation.get_banners_settings(<any>{
      selectedFields,
      language,
      filters,
    });
  }

  @Catch
  @Send(200)
  @DecodeAccessToken(verifyToken as Decoder)
  @ParseBody
  async PUT(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
    const { body } = req;
    return tabs_with_validation.update_tabs_position({
      ...(<any>body),
      ctx,
    });
  }
}

export = new Controller();
