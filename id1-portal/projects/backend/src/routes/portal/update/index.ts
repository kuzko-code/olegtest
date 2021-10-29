import { IncomingMessage, ServerResponse } from 'http';
import {
	MicroController,
	handler_context,
	Catch,
	Send,
	DecodeAccessToken,
	Decoder,
	ParseBody,
	AcceptACL
} from '../../../etc/http/micro_controller';

import { verifyToken } from '../../../handlers/jwt';

import { portal_update_with_validation } from '../../../domains/portal/update';

class Controller implements MicroController {
	path = "/portal/update/:version";

	@Catch
	@Send(200)
	@DecodeAccessToken(verifyToken as Decoder)
	@AcceptACL(["root_admin", "global_admin"])
	async PUT(req: IncomingMessage, res: ServerResponse) {
		return portal_update_with_validation.update_portal({ version: req.params.version });
	}
}
export = new Controller();
