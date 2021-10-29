import { IncomingMessage, ServerResponse } from 'http';
import {
    MicroController,
    Catch,
    handler_context,
    Decoder,
    DecodeAccessToken,
    Send
} from '../../../etc/http/micro_controller';

import { verifyToken } from '../../../handlers/jwt';

import { news_with_validation } from '../../../domains/news';

class Controller implements MicroController {
    path = "/news/:id";

    @Catch
    @Send(200)
    async GET(req: IncomingMessage, res: ServerResponse) {
        const { query } = req;

        const selectedFields = query.fields ? query.fields.split(",") : null;
        const includedResources = query.include ? query.include.split(",") : null;

        return news_with_validation.get_news_by_id({
            id: parseInt(req.params.id),
            selectedFields,
            includedResources
        });
    }

    @Catch
    @Send(200)
    @DecodeAccessToken(verifyToken as Decoder)
    async DELETE(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
        return news_with_validation.delete_news_by_id({
            id: parseInt(req.params.id), ctx: ctx
        });
    }
}

export = new Controller