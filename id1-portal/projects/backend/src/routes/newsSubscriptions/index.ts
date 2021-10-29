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

import { news_subscriptions_with_validation } from "../../domains/newsSubscriptions";

class Controller implements MicroController {
  priority = 1;

  @Catch
  @Send(200)
  @DecodeAccessToken(verifyToken as Decoder)
  async GET(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
    const { query } = req;

    const selectedFields = query.fields ? query.fields.split(",") : null;
    const language = query.language;

    const filters = {
      uuids: query.uuids ? query.uuids.split(",") : null,
      search: query.search ? query.search : null,
      searchKeys: query.searchKeys ? query.searchKeys.split(",") : ["email"],
      from: query.from ? new Date(Date.parse(query.from)) : null,
      to: query.to ? new Date(Date.parse(query.to)) : null,
      status: query.status ? query.status : null,
    };

    const aggregate = {
      func: query.aggFunc ? query.aggFunc : null,
      field: query.aggField ? query.aggField : null,
    };

    const sort = {
      field: query.sortField ? query.sortField : null,
      direction: query.sortDirection ? query.sortDirection : "asc",
    };

    const limit = {
      start: query.start ? parseInt(query.start) : null,
      count: query.count ? parseInt(query.count) : null,
    };

    return news_subscriptions_with_validation.get_news_subscriptions(<any>{
      selectedFields,
      filters,
      aggregate,
      sort,
      limit,
      language,
      ctx: ctx,
    });
  }

  @Catch
  @Send(200)
  @ParseBody
  async POST(req: IncomingMessage) {
    const { body } = req;

    return news_subscriptions_with_validation.create_news_subscription({
      ...(<any>body),
    });
  }
}

export = new Controller();
