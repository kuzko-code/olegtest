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
    @Send(200)
    @DecodeAccessToken(verifyToken as Decoder)
    @AcceptACL(["root_admin", "global_admin", "group_admin"])
    @ParseBody
    async POST(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
        const {
            body
        } = req;

        return groups_with_validation.added_users_to_group({
            ...<any>body, ctx
        })
    }
  
}

export = new Controller