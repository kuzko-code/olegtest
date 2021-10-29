import { IncomingMessage, ServerResponse } from 'http';

import { attachment_domain } from '../../domains/attachments';

import {
	MicroController,
	Catch,
	handler_context,
	Decoder,
	DecodeAccessToken,
	Send
} from '../../etc/http/micro_controller';

import { verifyToken } from '../../handlers/jwt';

class Controller implements MicroController {
	path = '/attachment/:id';

	@Catch
	@Send(200)
	@DecodeAccessToken(verifyToken as Decoder)
	async GET(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
		const { query } = req;

		const selectedFields = query.fields ? query.fields.split(',') : null;

		return attachment_domain.get_attachment_by_id({
			id: req.params.id,
			selectedFields
		});
	}

	@Catch
	@Send(200)
	@DecodeAccessToken(verifyToken as Decoder)
	async DELETE(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
		return attachment_domain.delete_attachment_by_id({
			id: req.params.id
		});
	}
}

export = new Controller();
