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
import { verifyToken } from "../../../handlers/jwt";
import { template_settings_with_validation } from "../../../domains/templates/settings";
class Controller implements MicroController {
  path = "/templates/settings";
  priority = 1;

  @Catch
  @Send(200)
  async GET(req: IncomingMessage, res: ServerResponse) {
    const { query } = req;

    const selectedFields = query.fields ? query.fields.split(",") : null;
    const aggregate = {
      func: query.aggFunc || null,
      field: query.aggField || null,
    };
    const sort = {
      field: query.sortField || null,
      direction: query.sortDirection || "asc",
    };
    const limit = {
      start: query.start ? parseInt(query.start) : null,
      count: query.count ? parseInt(query.count) : null,
    };
    const filters = {
      search: query.search || null,
      searchKeys: query.searchKeys ? query.searchKeys.split(",") : ["title"],
    };
    const includedResources = query.include ? query.include.split(",") : null;
    const language = req.query.language;

    return template_settings_with_validation.get_template_settings(<any>{
      selectedFields,
      aggregate,
      sort,
      limit,
      filters,
      includedResources,
      language,
    });
  }

  @Catch
  @Send(200)
  @DecodeAccessToken(verifyToken as Decoder)
  @ParseBody
  async PUT(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
    const { body } = req;

    return template_settings_with_validation.update_template_settings({
      ...(<any>body),
      ctx,
    });
  }
}

export = new Controller();
