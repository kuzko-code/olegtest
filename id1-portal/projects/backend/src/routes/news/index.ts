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

import { news_with_validation } from '../../domains/news'

import {Helper} from "../../helper";

class Controller implements MicroController {

    @Catch
    @Send(200)
    async GET(req: IncomingMessage, res: ServerResponse) {
        const { query } = req;

        const selectedFields = query.fields ? query.fields.split(",") : null;

        const includedResources = query.include ? query.include.split(",") : null;
        const language = req.query.language;

        const aggregate = {
            func: query.aggFunc || null,
            field: query.aggField || null
        };

        const filters = {
            ids: query.ids ? query.ids.split(",")
                .map((id: string) => parseInt(id)) : null,
            search: query.search || null,
            searchKeys: query.searchKeys ? query.searchKeys.split(",") : ["title"],
            rubrics: query.rubrics ? query.rubrics.split(",")
                .map((r: string) => parseInt(r)) : null,
            tags: query.tags ? query.tags.split(",") : null,
            from: query.from ? new Date(Date.parse(query.from)) : null,
            to: query.to ? new Date(Date.parse(query.to)) : null,
            isPublished: query.isPublished ? Helper.parseBoolean(query.isPublished) : null
        };


        const sort = {
            field: query.sortField || null,
            direction: query.sortDirection || "asc"
        };

        const limit = {
            start: query.start ? parseInt(query.start) : null,
            count: query.count ? parseInt(query.count) : null
        };

        return news_with_validation.get_news(<any>{
            selectedFields, includedResources, aggregate, filters, sort, limit, language
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

        return news_with_validation.create_news({
            ...<any>body, ctx
        });
    }

    @Catch
    @Send(200)
    @DecodeAccessToken(verifyToken as Decoder)
    @ParseBody
    async PUT(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
        const {
            body
        } = req;

        return news_with_validation.update_news({
            ...<any>body, ctx
        });
    }
}

export = new Controller