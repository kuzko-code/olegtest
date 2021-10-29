import { IncomingMessage, ServerResponse } from "http";
import { MicroController, Catch } from "../../etc/http/micro_controller";

import { Seo } from "../../features/seo";

class Controller implements MicroController {
  @Catch
  async GET(req: IncomingMessage, res: ServerResponse) {
    let result: any = await Seo.get_sitemap({});
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(result);
  }
}

export = new Controller();
