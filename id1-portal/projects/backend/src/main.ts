import * as path from "path";
import { server } from "./server";
import { CONFIGURATIONS } from "./config";
import { db } from "./db";
import { ApiLanguages } from "./features/language/index";
import { News } from "./features/news";
import { NewsSubscriptions } from "./features/newsSubscriptions";
import { Portal } from "./features/portal";
import { Host } from "./features/changeHost";

async function main() {
  let languages = await ApiLanguages.get_all_languages().then((res) => res);
  const i18n = require("i18n");

  i18n.configure({
    locales: languages,
    directory: path.join(__dirname, "/locales"),
  });

  await db.connect();
  let fs = require("fs-extra");
  let plugins = fs.readdirSync(path.resolve(__dirname, "../src/plugins"));

  let receivers: any[] = [];

  for (let i = 0; i < plugins.length; i++) {
    try {
      let { eventReceiver } = await import(
        "./plugins/" + plugins[i] + "/eventReceiver/index"
      );
      receivers.push(eventReceiver);
      eventReceiver.plugin_installing();
    } catch {}
  }

  let schedule = require("node-schedule-tz");

  Portal.Initialize();
  Host.change_host();

  schedule.scheduleJob("1 */1 * * *", async function (fireDate: any) {
    await News.auto_published();

    for (let i = 0; i < receivers.length; i++) {
      try {
        receivers[i].perform_every_hour();
      } catch {}
    }
  });
  schedule.scheduleJob("1 */24 * * *", async function (fireDate: any) {
    for (let i = 0; i < receivers.length; i++) {
      try {
        receivers[i].perform_every_day();
      } catch {}
    }
  });
  schedule.scheduleJob("1 * * * */1", async function (fireDate: any) {
    for (let i = 0; i < receivers.length; i++) {
      try {
        receivers[i].perform_every_week();
      } catch {}
    }
  });

  schedule.scheduleJob("0 17 * * *", async function () {
    await NewsSubscriptions.sendNewsMessageMail("EveryDay");
  });
  schedule.scheduleJob("3 17 * * */5", async function () {
    await NewsSubscriptions.sendNewsMessageMail("EveryWeek");
  });
  schedule.scheduleJob("5 * 1 */1 *", async function () {
    await NewsSubscriptions.sendNewsMessageMail("EveryMonth");
  });

  server.listen(CONFIGURATIONS.SERVER.PORT);
}

main();
