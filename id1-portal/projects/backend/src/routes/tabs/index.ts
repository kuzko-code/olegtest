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
import { Helper } from '../../helper';
class Controller implements MicroController {
	@Catch
	@Send(200)
	async GET(req: IncomingMessage, res: ServerResponse) {
		const { query } = req;

		const selectedFields = query.fields ? query.fields.split(',') : null;
		const includedResources = query.include ? query.include.split(',') : null;
		const language = req.query.language;

		const aggregate = {
			func: query.aggFunc || null,
			field: query.aggField || null
		};
		const filters = {
			ids: query.ids ? query.ids.split(',').map((id: string) => parseInt(id)) : null,
			search: query.search || null,
			searchKeys: query.searchKeys ? query.searchKeys.split(',') : ['id'],
			position: req.query.position,
			enabled: query.enabled ? Helper.parseBoolean(query.enabled) : null
		};

		return tabs_with_validation.get_tabs(<any>{
			selectedFields,
			includedResources,
			aggregate,
			filters,
			language
		});
	}

	@Catch
	@Send(200)
	@DecodeAccessToken(verifyToken as Decoder)
	@ParseBody
	async POST(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
		const { body } = req;

		return tabs_with_validation.create_tabs({
			...(<any>body), ctx
		});
	}

	@Catch
	@Send(200)
	@DecodeAccessToken(verifyToken as Decoder)
	@ParseBody
	async PUT(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
		
		const { id, form_data } = req.body;
		return await tabs_with_validation.update_tabs({
			id,
			form_data,
			ctx
		});
	}

	@Catch
	@Send(200)
	@DecodeAccessToken(verifyToken as Decoder)
	@AcceptACL(['root_admin', 'global_admin'])
	async DELETE(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
		const ids = req.query.ids ? req.query.ids.split(',').map((id: string) => parseInt(id)) : null;

		return tabs_with_validation.delete_tab_by_ids({
			ids, ctx
		});
	}
}

export = new Controller();
