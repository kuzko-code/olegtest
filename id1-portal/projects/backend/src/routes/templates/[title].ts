import { IncomingMessage, ServerResponse } from "http";
import { MicroController, Catch, Send } from "../../etc/http/micro_controller";
import { template_with_validation } from "../../domains/templates";

class Controller implements MicroController {
  path = "/templates/:title";

  @Catch
  @Send(200)
  async GET(req: IncomingMessage, res: ServerResponse) {
    const { query } = req;

    const selectedFields = query.fields ? query.fields.split(",") : null;
    const title = req.params.title;
    const includedResources = query.include ? query.include.split(",") : null;

    return template_with_validation.get_template_by_title({
      title,
      selectedFields,
      includedResources,
    });
  }
}

export = new Controller();
