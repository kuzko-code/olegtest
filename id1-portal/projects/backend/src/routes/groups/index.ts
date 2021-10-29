import { IncomingMessage, ServerResponse } from 'http';
import {
    MicroController,
    Catch,
    handler_context,
    Decoder,
    DecodeAccessToken,
    Send,
    ParseBody,
    AcceptACL
} from '../../etc/http/micro_controller';
import { verifyToken } from '../../handlers/jwt';
import { groups_with_validation } from '../../domains/groups';

class Controller implements MicroController {
    priority = 1;

    @Catch
    @DecodeAccessToken(verifyToken as Decoder)
    @AcceptACL(["root_admin", "global_admin", "group_admin"])
    @Send(200)
    async GET(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
        const { query } = req;

        const selectedFields = query.fields ? query.fields.split(",") : null;

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

        return groups_with_validation.get_groups(<any>{
            selectedFields, aggregate, filters, sort, limit, ctx
        });
    }

    @Catch
    @Send(200)
    @DecodeAccessToken(verifyToken as Decoder)
    @AcceptACL(["root_admin", "global_admin"])
    @ParseBody
    async POST(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
        const {
            body
        } = req;

        return groups_with_validation.create_group({
            ...<any>body
        })
    }

    @Catch
    @Send(200)
    @DecodeAccessToken(verifyToken as Decoder)
    @AcceptACL(["root_admin", "global_admin", "group_admin"])
    @ParseBody
    async PUT(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
        const {
            body
        } = req;

        return groups_with_validation.update_group({
            ...<any>body, ctx
        });
    }
}

export = new Controller