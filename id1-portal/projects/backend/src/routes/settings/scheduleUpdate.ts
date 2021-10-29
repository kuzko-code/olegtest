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
} from '../../etc/http/micro_controller';
import { verifyToken } from '../../handlers/jwt';
import { portal_update_settings_with_validation } from '../../domains/portal';

class Controller implements MicroController {
	priority = 1;

	@Catch
	@Send(200)
	@DecodeAccessToken(verifyToken as Decoder)
	async GET(req: IncomingMessage, res: ServerResponse) {
		return portal_update_settings_with_validation.get_portal_update_settings({
			titles: ['portalUpdateSchedule']
		});
	}

	@Catch
	@Send(200)
	@DecodeAccessToken(verifyToken as Decoder)
	@AcceptACL(['root_admin', 'global_admin'])
	@ParseBody
	async PUT(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
		const { body } = req;
		return portal_update_settings_with_validation.update_schedule_updated({
			...(<any>body),
			ctx
		});
	}
}
export = new Controller();
