import { IncomingMessage, ServerResponse } from 'http';
import { attachment_domain } from '../../domains/attachments';

import {
	MicroController,
	Catch,
	handler_context,
	Decoder,
	DecodeAccessToken,
	Send,
} from '../../etc/http/micro_controller';

import { verifyToken } from '../../handlers/jwt';

class Controller implements MicroController {
	@Catch
	@Send(200)
	@DecodeAccessToken(verifyToken as Decoder)
	async POST(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
		const { userId } = ctx;
		let bodyFields = null;
		let bodyFile;

		const formidable = require("formidable");
    	let form = new formidable.IncomingForm();
    	form.maxFileSize = 100 * 1024 * 1024;

    	await new Promise((resolve, reject) => {
			form.parse(req, (err: string, fields: any, files: any) => {
				if (err) {
					reject(err);
					return;
				}
				bodyFields = { ...(<any>fields) };
        		bodyFile = files[Object.keys(files)[0]];
        		resolve();
			});
		});
    
		return attachment_domain.save_attachments({
			bodyFile: {...(<any>bodyFile)},
			userId: Number(userId),
			...(<any>bodyFields)
	});
  }


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

		const filters = {
			search: query.search || null,
			author: query.author ? parseInt(query.author) : null
		};

		const sort = {
			field: query.sortField || null,
			direction: query.sortDirection || 'asc'
		};

		const limit = {
			start: query.start ? parseInt(query.start) : null,
			count: query.count ? parseInt(query.count) : null
		};

		return attachment_domain.get_attachments(<any>{
			selectedFields,
			aggregate,
			filters,
			sort,
			limit
		});
	}
}

export = new Controller();
