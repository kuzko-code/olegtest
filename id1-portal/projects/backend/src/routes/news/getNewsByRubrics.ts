import {IncomingMessage, ServerResponse} from 'http';
import {
    MicroController,
    Catch,
    Send
} from '../../etc/http/micro_controller';

import {news_with_validation} from '../../domains/news'

import {Helper} from "../../helper";

class Controller implements MicroController {
    path = "/getNewsByRubrics";

    @Catch
    @Send(200)
    async GET(req: IncomingMessage, res: ServerResponse) {
        const {query} = req;

        const selectedFields = query.fields ? query.fields.split(",") : null;
        const language = req.query.language;
        const rubrics = query.rubrics ? query.rubrics.split(",")
            .map((r: string) => parseInt(r)) : null;

        const filters = {
            from: query.from ? new Date(Date.parse(query.from)) : null,
            to: query.to ? new Date(Date.parse(query.to)) : null,
            isPublished: query.isPublished ? Helper.parseBoolean(query.isPublished) : null
        };

        const sort = {
            field: query.sortField || null,
            direction: query.sortDirection || "asc"
        };

        const limit = {
            count: query.count ? parseInt(query.count) : null
        };

        return news_with_validation.get_news_by_rubrics(<any>{
            selectedFields, rubrics, filters, sort, limit, language
        });
    }
}

export = new Controller