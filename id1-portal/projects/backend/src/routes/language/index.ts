import { IncomingMessage, ServerResponse } from 'http';
import {
    MicroController,
    Catch,
    handler_context,
    Decoder,
    DecodeAccessToken,
    Send,
    ParseBody
} from '../../etc/http/micro_controller';

import { verifyToken } from '../../handlers/jwt';

import { languages_with_validation } from '../../domains/language';

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
            search: query.search || null,
            cutbacks: query.cutbacks ? query.cutbacks.split(",") : null
        };


        let sort = {
            field: query.sortField || null,
            direction: query.sortDirection || "asc"
        };

        let limit = {
            start: query.start ? parseInt(query.start) : null,
            count: query.count ? parseInt(query.count) : null
        };

        return languages_with_validation.get_languages(<any>{
            selectedFields, aggregate, filters, sort, limit, language
        });
    }
}

export = new Controller