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

import { news_rubrics_with_validation } from '../../../domains/news/rubrics';

class Controller implements MicroController {
    path = "/news/rubrics/:id";

    @Catch
    @Send(200)
    async GET(req: IncomingMessage, res: ServerResponse) {
        const selectedFields = req.query.fields ? req.query.fields.split(",") : null;
        
        return news_rubrics_with_validation.get_rubric_by_id({
            id: parseInt(req.params.id),
            selectedFields
        });
    }

    @Catch
    @Send(200)
    @DecodeAccessToken(verifyToken as Decoder)
    async DELETE(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
        return news_rubrics_with_validation.delete_rubric_by_id({
            id: parseInt(req.params.id), ctx
        });
    }
}

export = new Controller