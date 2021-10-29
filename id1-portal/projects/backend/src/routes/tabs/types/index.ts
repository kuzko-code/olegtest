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
} from "../../../etc/http/micro_controller";

import { tabs_with_validation } from "../../../domains/tabs";

class Controller implements MicroController {
  priority = 1;

  @Catch
  @Send(200)
  async GET(req: IncomingMessage, res: ServerResponse) {
    const { query } = req;

    const tab_position = query.position
    ? query.position.split(",")
    : ['topBar', 'bottomBar', 'rightBar', 'leftBar'];

    const includedResources = query.include
        ? query.include.split(",")
        : null;

    return tabs_with_validation.get_tabs_types({
      tab_position,
      includedResources,
    });
  }
}

export = new Controller;
