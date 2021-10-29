import { IncomingMessage, ServerResponse } from "http";
import {
  MicroController,
  Catch,
  handler_context,
  Decoder,
  DecodeAccessToken,
  AcceptACL,
  Send,
  ParseBody,
} from "../../etc/http/micro_controller";
import { verifyToken, verifyVisitorToken } from "../../handlers/jwt";
import { visitors_with_validation } from "../../domains/visitors";
import { Helper } from "../../helper";

class Controller implements MicroController {
  @Catch
  @Send(200)
  @DecodeAccessToken(verifyToken as Decoder)
  @AcceptACL(["root_admin", "global_admin", "group_admin"])
  async GET(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
    const { query } = req;
    const selectedFields = query.fields ? query.fields.split(",") : null;
    const aggregate = {
      func: query.aggFunc || null,
      field: query.aggField || null,
    };

    const filters = {
      ids: query.ids
        ? query.ids.split(",").map((id: string) => parseInt(id))
        : null,
      search: query.search || null,
      searchKeys: query.searchKeys ? query.searchKeys.split(",") : ["email"],
      is_active: query.is_active ? Helper.parseBoolean(query.is_active) : null,
    };

    const sort = {
      field: query.sortField || null,
      direction: query.sortDirection || "asc",
    };

    const limit = {
      start: query.start ? parseInt(query.start) : null,
      count: query.count ? parseInt(query.count) : null,
    };

    return visitors_with_validation.get_visitors(<any>{
      selectedFields,
      aggregate,
      filters,
      sort,
      limit,
      ctx,
    });
  }

  @Catch
  @Send(200)
  @ParseBody
  async POST(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
    const { body } = req;
    return visitors_with_validation.create_visitor({
      ...(<any>body),
      ctx,
    });
  }

  @Catch
  @Send(200)
  @DecodeAccessToken(verifyVisitorToken as Decoder)
  @ParseBody
  async PUT(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
    const { body } = req;
    return visitors_with_validation.update_visitor({
      ...(<any>body),
      id: ctx.userId,
    });
  }
}

export = new Controller();
