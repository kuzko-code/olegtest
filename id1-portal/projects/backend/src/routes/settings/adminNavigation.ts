import { IncomingMessage, ServerResponse } from 'http';
import {
    MicroController,
    Catch,
    handler_context,
    Decoder,
    DecodeAccessToken,
    Send,
} from '../../etc/http/micro_controller';

import { verifyToken } from '../../handlers/jwt';

import { settings_with_validation } from '../../domains/settings'

class Controller implements MicroController {
    path = "/adminNavigation";
    @Catch
    @Send(200)
    @DecodeAccessToken(verifyToken as Decoder)
    async GET(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {

        return settings_with_validation.get_admin_navigation({
            ctx
        });
    }
}

export = new Controller