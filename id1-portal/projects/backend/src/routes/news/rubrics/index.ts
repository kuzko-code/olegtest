import { IncomingMessage, ServerResponse } from 'http';
import {
    MicroController,
    Catch,
    handler_context,
    Decoder,
    DecodeAccessToken,
    Send,
    ParseBody
} from '../../../etc/http/micro_controller';

import { verifyToken } from '../../../handlers/jwt';

import { news_rubrics_with_validation } from '../../../domains/news/rubrics';

class Controller implements MicroController {
    priority = 1;

    @Catch
    @Send(200)
    async GET(req: IncomingMessage, res: ServerResponse) {
        const { query } = req;

        const selectedFields = query.fields ? query.fields.split(",") : null;
        const language = req.query.language;

        const aggregate = {
            func: query.aggFunc || null,
            field: query.aggField || null
        };

        let filters = {
            search: query.search || null
        };


        let sort = {
            field: query.sortField || null,
            direction: query.sortDirection || "asc"
        };

        let limit = {
            start: query.start ? parseInt(query.start) : null,
            count: query.count ? parseInt(query.count) : null
        };

        return news_rubrics_with_validation.get_rubrics(<any>{
            selectedFields, aggregate, filters, sort, limit, language
        });
    }

    @Catch
    @Send(200)
    @DecodeAccessToken(verifyToken as Decoder)
    @ParseBody
    async POST(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
        const {
            body
        } = req;

        return news_rubrics_with_validation.create_rubric({
            ...<any>body, ctx
        })
    }

    @Catch
    @Send(200)
    @DecodeAccessToken(verifyToken as Decoder)
    @ParseBody
    async PUT(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
        const {
            body
        } = req;

        return news_rubrics_with_validation.update_rubric({
            ...<any>body, ctx
        });
    }
}

export = new Controller