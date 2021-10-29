import { IncomingMessage, ServerResponse } from 'http';
import {
    MicroController,
    Catch,
    handler_context,
    AcceptACL,
    Decoder,
    DecodeAccessToken,
    Send,
    ParseBody
} from '../../etc/http/micro_controller';

import { verifyToken } from '../../handlers/jwt';

import { plugins_info_with_validation } from '../../domains/pluginsInfo';

class Controller implements MicroController {
    path = "/pluginsInfo/:name";

    @Catch
    @Send(200)
    async GET(req: IncomingMessage, res: ServerResponse) {
        return plugins_info_with_validation.get_plugin_by_name({
            name: req.params.name
        });
    }

    @Catch
    @Send(200)
    @DecodeAccessToken(verifyToken as Decoder)
    @AcceptACL(["root_admin", "global_admin"])
    async DELETE(req: IncomingMessage, res: ServerResponse) {
        return plugins_info_with_validation.delete_plugin_by_name({
            name: req.params.name
        });
    }
}

export = new Controller