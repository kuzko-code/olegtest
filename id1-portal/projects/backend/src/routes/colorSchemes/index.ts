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
import { color_schemes_with_validation } from "../../domains/colorSchemes";

class Controller implements MicroController {
  priority = 1;
  path = "/colorschemes";

  @Catch
  @Send(200)
  async GET(req: IncomingMessage, res: ServerResponse) {
    const { query } = req;

    const selectedFields = query.fields ? query.fields.split(",") : null;

    const aggregate = {
      func: query.aggFunc || null,
      field: query.aggField || null,
    };

    let sort = {
      field: query.sortField || null,
      direction: query.sortDirection || "asc",
    };

    let limit = {
      start: query.start ? parseInt(query.start) : null,
      count: query.count ? parseInt(query.count) : null,
    };

    const filters = {
      template: query.template || null,
    };

    return color_schemes_with_validation.get_color_schemes(<any>{
      selectedFields,
      aggregate,
      sort,
      limit,
      filters,
    });
  }

  @Catch
  @Send(200)
  @DecodeAccessToken(verifyToken as Decoder)
  @ParseBody
  async POST(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
    const { body } = req;

    return color_schemes_with_validation.create_color_scheme({
      ...(<any>body),
      ctx,
    });
  }

  @Catch
  @Send(200)
  @DecodeAccessToken(verifyToken as Decoder)
  @ParseBody
  async PUT(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
    const { body } = req;

    return color_schemes_with_validation.update_color_scheme({
      ...(<any>body),
      ctx,
    });
  }
}

export = new Controller();
