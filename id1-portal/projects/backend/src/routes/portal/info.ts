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
import { Portal } from '../../features/portal'

class Controller implements MicroController {
	@Catch
	@Send(200)
	@DecodeAccessToken(verifyToken as Decoder)
	@AcceptACL(["root_admin", "global_admin"])
	async GET(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
		return await Portal.checkIfTheUserRegistration();
	}
}

export = new Controller();
