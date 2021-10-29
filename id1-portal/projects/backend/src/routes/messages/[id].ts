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
import { messages_with_validation } from '../../domains/messages';

class Controller implements MicroController {
    path = "/messages/:id";

    @Catch
    @Send(200)
    @DecodeAccessToken(verifyToken as Decoder)
    async GET(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
        const selectedFields = req.query.fields ? req.query.fields.split(",") : null;
        
        return messages_with_validation.get_messages_by_id({
            id: parseInt(req.params.id),
            selectedFields,
            ctx
        });
    }

    @Catch
    @Send(200)
    @DecodeAccessToken(verifyToken as Decoder)
    async DELETE(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
        return messages_with_validation.delete_messages_by_id({
            id: parseInt(req.params.id), ctx
        });
    }
}

export = new Controller