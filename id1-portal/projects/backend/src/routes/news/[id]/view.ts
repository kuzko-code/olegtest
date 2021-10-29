import { IncomingMessage, ServerResponse } from 'http';
import {
    MicroController,
    Catch,
    Send
} from '../../../etc/http/micro_controller';
import { news_with_validation } from '../../../domains/news';

class Controller implements MicroController {
    path = "/news/:id/view";

    @Catch
    @Send(200)
    async PUT(req: IncomingMessage, res: ServerResponse) {
        return news_with_validation.add_view({
            id: parseInt(req.params.id)
        });
    }
}

export = new Controller