import { IncomingMessage, ServerResponse } from 'http';
import {
    MicroController,
    Catch,
    handler_context,
    Decoder,
    DecodeAccessToken,
    AcceptACL,
    Send,
    ParseBody
} from '../../etc/http/micro_controller';

import { verifyToken } from '../../handlers/jwt';

import { users_with_validation } from '../../domains/users';

class Controller implements MicroController {
    @Catch
    @Send(200)    
    @DecodeAccessToken(verifyToken as Decoder)
    @AcceptACL(["root_admin", "global_admin", "group_admin"])
    async GET(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
        const { query } = req;
        const selectedFields = query.fields ? query.fields.split(",") : null;
        const includedResources = query.include ? query.include.split(",") : null;
        return users_with_validation.get_users({selectedFields, includedResources, ctx});
    }

    @Catch
    @Send(200)
    @DecodeAccessToken(verifyToken as Decoder)
    @AcceptACL(["root_admin", "global_admin", "group_admin"])
    @ParseBody
    async POST(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
        const { body } = req;
      
        return users_with_validation.create_user({
            ...<any>body, ctx
        })
    }

    @Catch
    @Send(200)
    @DecodeAccessToken(verifyToken as Decoder)
    @ParseBody
    async PUT(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
        const { body } = req;
        return users_with_validation.update_user({
            ...<any>body, ctx
        })
    }
}

export = new Controller