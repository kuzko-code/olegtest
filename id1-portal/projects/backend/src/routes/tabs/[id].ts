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
import { tabs_with_validation } from '../../domains/tabs';

class Controller implements MicroController {
	path = '/tabs/:id';

	@Catch
	@Send(200)
	async GET(req: IncomingMessage, res: ServerResponse) {
		const { query } = req;

		const selectedFields = query.fields ? query.fields.split(',') : null;
		const includedResources = query.include ? query.include.split(',') : null;
		const id = parseInt(req.params.id);

		return tabs_with_validation.get_tabs_by_id({
			id,
			selectedFields,
			includedResources
		});
	}

	@Catch
	@Send(200)
	@DecodeAccessToken(verifyToken as Decoder)
	async DELETE(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
		const id = parseInt(req.params.id);

		return await tabs_with_validation.delete_tab_by_ids({
			ids: [id], ctx
		});
	}
}

export = new Controller();
