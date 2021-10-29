import { IncomingMessage, ServerResponse } from 'http';
import {
    MicroController,
    Catch,
    handler_context,
    Decoder,
    DecodeAccessToken,
    AcceptACL,
    Send
} from '../../etc/http/micro_controller';

import { verifyToken } from '../../handlers/jwt';

import { users_with_validation } from '../../domains/users';

class Controller implements MicroController {
    path = "/users/:id";

    @Catch
    @Send(200)
    @DecodeAccessToken(verifyToken as Decoder)
    async GET(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
        return users_with_validation.get_user_by_id({
            id: parseInt(req.params.id)
        });
    }

    @Catch
    @Send(200)
    @DecodeAccessToken(verifyToken as Decoder)
    @AcceptACL(["root_admin", "global_admin", "group_admin"])
    async DELETE(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
        return users_with_validation.delete_user({
            id: parseInt(req.params.id),
            ctx
        });
    }
}

export = new Controller