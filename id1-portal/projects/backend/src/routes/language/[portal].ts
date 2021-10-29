import { IncomingMessage, ServerResponse } from 'http';
import {
    MicroController,
    Catch,
    handler_context,
    Decoder,
    DecodeAccessToken,
    Send
} from '../../etc/http/micro_controller';

import { verifyToken } from '../../handlers/jwt';

import { languages_with_validation } from '../../domains/language';

class Controller implements MicroController {
    path = "/language/:portal";

    @Catch
    @Send(200)
    async GET(req: IncomingMessage, res: ServerResponse) {        
        return languages_with_validation.get_site_language({
            portal: req.params.portal
        });
    }
}

export = new Controller