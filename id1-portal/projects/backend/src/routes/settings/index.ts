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

import { settings_with_validation } from '../../domains/settings'

class Controller implements MicroController {

    @Catch
    @Send(200)
    async GET(req: IncomingMessage, res: ServerResponse) {
        const titles = req.query.titles !== undefined ?
            req.query.titles.split(",") :
            undefined;
        const language = req.query.language;

        return settings_with_validation.get_site_settings({
            titles,
            language: language
        });
    }

    @Catch
    @Send(200)
    @DecodeAccessToken(verifyToken as Decoder)
    @AcceptACL(["root_admin", "global_admin"])
    @ParseBody
    async POST(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
        const { body } = req;

        return settings_with_validation.create_site_settings({
            ...<any>body
        });
    }

    @Catch
    @Send(200)
    @DecodeAccessToken(verifyToken as Decoder)
    @ParseBody
    async PUT(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
        const { body } = req;
        return settings_with_validation.update_site_settings({
            ...<any>body, ctx
        });
    }

    @Catch
    @Send(200)
    @DecodeAccessToken(verifyToken as Decoder)
    @AcceptACL(["root_admin", "global_admin"])
    async DELETE(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
        const titles = req.query.titles !== undefined ?
            req.query.titles.split(",") :
            undefined;
        const language = req.query.language;
        return settings_with_validation.delete_site_settings({
            titles,
            language: language
        });
    }
}

export = new Controller