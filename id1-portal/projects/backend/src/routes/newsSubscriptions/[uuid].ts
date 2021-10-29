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
  path = "/newsSubscriptions/:uuid";
  priority = 2;

  @Catch
  @Send(200)
  async GET(req: IncomingMessage) {
    const { query } = req;

    const selectedFields = query.fields ? query.fields.split(",") : null;
    const language = query.language;

    return news_subscriptions_with_validation.get_news_subscription_by_uuid({
      uuid: req.params.uuid,
      selectedFields,
      language,
    });
  }

  @Catch
  @Send(200)
  @ParseBody
  async PUT(req: IncomingMessage) {
    const { body } = req;

    return news_subscriptions_with_validation.update_news_subscription_by_uuid({
      uuid: req.params.uuid,
      ...(<any>body),
    });
  }

  @Catch
  @Send(200)
  @DecodeAccessToken(verifyToken as Decoder)
  async DELETE(
    req: IncomingMessage,
    res: ServerResponse,
    ctx: handler_context
  ) {
    return news_subscriptions_with_validation.delete_news_subscription_by_uuid({
      uuid: req.params.uuid,
      ctx: ctx,
    });
  }
}

export = new Controller();
