import {
  Catch,
  Send,
  MicroController,
  DecodeAccessToken,
  Decoder,
  handler_context,
  ParseBody,
} from "../../etc/http/micro_controller";
import { documents_with_validation } from "../../domains/documents";
import { IncomingMessage, ServerResponse } from "http";
import { verifyToken } from "../../handlers/jwt";

class Controller implements MicroController {
  priority = 1;

  @Catch
  @Send(200)
  async GET(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
    const { query } = req;

    const selectedFields = query.fields ? query.fields.split(",") : null;

    const aggregate = {
      func: query.aggFunc || null,
      field: query.aggField || null,
    };

    const filters = {
      search: query.search || null,
      searchKeys: query.searchKeys ? query.searchKeys.split(",") : ["title"],
    };

    let sort = {
      field: query.sortField || null,
      direction: query.sortDirection || "asc",
    };

    let limit = {
      start: query.start ? parseInt(query.start) : null,
      count: query.count ? parseInt(query.count) : null,
    };

    return documents_with_validation.get_documents(<any>{
      selectedFields,
      aggregate,
      filters,
      sort,
      limit,
      ctx: ctx,
    });
  }

  @Catch
  @Send(200)
  @DecodeAccessToken(verifyToken as Decoder)
  async POST(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
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
        if (bodyFields.content != undefined) {
          bodyFields.content =
            bodyFields.content != "" ? bodyFields.content.split(",") : [];
        }
        bodyFile = files[Object.keys(files)[0]];
        resolve();
      });
    });

    return documents_with_validation.save_document({
      bodyFile: { ...(<any>bodyFile) },
      userId: parseInt(ctx.userId!),
      ...(<any>bodyFields),
      ctx,
    });
  }

  @Catch
  @Send(200)
  @DecodeAccessToken(verifyToken as Decoder)
  @ParseBody
  async PUT(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
    const { body } = req;

    return documents_with_validation.update_document({
      ...(<any>body),
      ctx,
    });
  }
}

export = new Controller();
