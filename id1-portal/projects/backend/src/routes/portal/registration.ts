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

import { portal_update_settings_with_validation } from '../../domains/portal';

class Controller implements MicroController {
	@Catch
	@Send(200)
	@ParseBody
	@DecodeAccessToken(verifyToken as Decoder)
	@AcceptACL(['root_admin', 'global_admin'])
	async POST(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
		const { userId } = ctx;
		const { body } = req;

		return portal_update_settings_with_validation.user_registration({
			...(<any>body),
			userId
		});
	}
}

export = new Controller();
