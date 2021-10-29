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
}
export = new Controller();
