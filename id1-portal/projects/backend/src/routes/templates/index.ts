import { IncomingMessage, ServerResponse } from "http";
import { MicroController, Catch, Send } from "../../etc/http/micro_controller";
import { template_with_validation } from "../../domains/templates";
class Controller implements MicroController {
  @Catch
  @Send(200)
  async GET(req: IncomingMessage, res: ServerResponse) {
    const { query } = req;

    const selectedFields = query.fields ? query.fields.split(",") : null;
    const aggregate = {
      func: query.aggFunc || null,
      field: query.aggField || null,
    };
    const sort = {
      field: query.sortField || null,
      direction: query.sortDirection || "asc",
    };
    const limit = {
      start: query.start ? parseInt(query.start) : null,
      count: query.count ? parseInt(query.count) : null,
    };
    const filters = {
      search: query.search || null,
      searchKeys: query.searchKeys ? query.searchKeys.split(",") : ["title"],
    };

    const includedResources = query.include ? query.include.split(",") : null;

    return template_with_validation.get_templates(<any>{
      selectedFields,
      aggregate,
      sort,
      limit,
      filters,
      includedResources,
    });
  }
}

export = new Controller();
