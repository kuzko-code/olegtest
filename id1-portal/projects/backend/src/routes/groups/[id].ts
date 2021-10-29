import { IncomingMessage, ServerResponse } from 'http';
import {
    MicroController,
    Catch,
    handler_context,
    Decoder,
    DecodeAccessToken,
    Send,
    AcceptACL
} from '../../etc/http/micro_controller';

import { verifyToken } from '../../handlers/jwt';

import { groups_with_validation } from '../../domains/groups';

class Controller implements MicroController {
    path = "/groups/:id";

    @Catch
    @Send(200)
    @DecodeAccessToken(verifyToken as Decoder)
    @AcceptACL(["root_admin", "global_admin", "group_admin"])
    async GET(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
        const selectedFields = req.query.fields ? req.query.fields.split(",") : null;
        
        return groups_with_validation.get_group_by_id({
            id: parseInt(req.params.id),
            selectedFields
        });
    }

    @Catch
    @Send(200)
    @DecodeAccessToken(verifyToken as Decoder)
    @AcceptACL(["root_admin", "global_admin"])
    async DELETE(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
        return groups_with_validation.delete_group_by_id({
            id: parseInt(req.params.id)
        });
    }
}

export = new Controller