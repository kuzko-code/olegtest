import { IncomingMessage, ServerResponse } from 'http';
import {
    MicroController,
    Catch,
    Send
} from '../../../etc/http/micro_controller';
import { news_with_validation } from '../../../domains/news';

class Controller implements MicroController {
    priority = 1;

    @Catch
    @Send(200)
    async GET(req: IncomingMessage, res: ServerResponse) {
        const { query } = req;
        const language = req.query.language;

        const limit = {
            start: query.start ? parseInt(query.start) : null,
            count: query.count ? parseInt(query.count) : null
        };

        return news_with_validation.get_tags_rating(<any>{
            limit,
            language
        });
    }
}

export = new Controller