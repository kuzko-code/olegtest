import { IncomingMessage, ServerResponse } from "http";
import {
  MicroController,
  Catch,
  handler_context,
  Send,
} from "../../../etc/http/micro_controller";
import { settings_with_validation } from "../../../domains/settings";

class Controller implements MicroController {
  path = "/settings/general/preview";
  priority = 1;
  @Catch
  @Send(200)
  async GET(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
    const language = req.query.language;
    return await settings_with_validation.get_general_settings(<any>{
      language,
      mode: "preview",
    });
  }
}

export = new Controller();
