import { IncomingMessage, ServerResponse } from 'http';
import {
	MicroController,
	Catch,
	handler_context,
	Decoder,
	DecodeAccessToken,
	Send,
	ParseBody
} from '../../etc/http/micro_controller';
import { Helper } from '../../helper';
import { verifyToken } from '../../handlers/jwt';
import { messages_with_validation } from '../../domains/messages';

class Controller implements MicroController {
	priority = 1;
	path = '/messages';

	@Catch
	@Send(200)
	@DecodeAccessToken(verifyToken as Decoder)
	async GET(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
		const { query } = req;

		const selectedFields = query.fields ? query.fields.split(',') : null;

		const aggregate = {
			func: query.aggFunc || null,
			field: query.aggField || null
		};

		let sort = {
			field: query.sortField || null,
			direction: query.sortDirection || 'asc'
		};

		let limit = {
			start: query.start ? parseInt(query.start) : null,
			count: query.count ? parseInt(query.count) : null
		};

		const filters = {
			isRead: query.isRead ? Helper.parseBoolean(query.isRead) : null
		};

		return messages_with_validation.get_messages(<any>{
			selectedFields,
			aggregate,
			sort,
			limit,
			ctx,
            filters
		});
	}

	@Catch
	@Send(200)
	// @DecodeAccessToken(verifyToken as Decoder)
	@ParseBody
	async POST(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
		const { body } = req;

		return messages_with_validation.create_messages({
			...(<any>body),
			ctx
		});
	}

	@Catch
	@Send(200)
	@DecodeAccessToken(verifyToken as Decoder)
	@ParseBody
	async PUT(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
		const { body } = req;

		return messages_with_validation.update_messages({
			...(<any>body),
			ctx
		});
	}
}

export = new Controller();
