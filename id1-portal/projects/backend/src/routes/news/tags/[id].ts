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

import { news_tags_with_validation } from '../../../domains/news/tags';

class Controller implements MicroController {
    path = "/news/tags/:id";

    @Catch
    @Send(200)
    async GET(req: IncomingMessage, res: ServerResponse) {
        const selectedFields = req.query.fields ? req.query.fields.split(",") : null;
        // const language = req.query.language;

        return news_tags_with_validation.get_tag_by_id({
            id: parseInt(req.params.id),
            selectedFields
            // language: language
        });
    }

    @Catch
    @Send(200)
    @DecodeAccessToken(verifyToken as Decoder)
    async DELETE(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
        return news_tags_with_validation.delete_tag_by_id({
            id: parseInt(req.params.id), ctx
        });
    }
}

export = new Controller