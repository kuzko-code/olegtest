import { Telegraf } from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { news_for_telegram } from "./types";
const fetch = require("node-fetch");
export default class Bot {
  constructor(private bot: Telegraf<TelegrafContext>) {}

  public static async spawn(token: string): Promise<Bot | undefined> {
    try {
      const telegramBot = new Telegraf(token);
      await telegramBot.launch();
      return new Bot(telegramBot);
    } catch (error) {
      console.log("👎 Bot failed to initialize");
      return undefined;
    }
  }

  public sendNews = async (news: news_for_telegram) => {
    let PUBLIC_HOST = process.env.PUBLIC_HOST || "";
    let caption = `<a href="${news.news_URL}"><b>${news.title}</b></a>
            ${news.description}`;

    try {
      let image = await fetch(
        news.main_picture.startsWith(PUBLIC_HOST)
          ? news.main_picture
          : PUBLIC_HOST + news.main_picture
      );
      const buffer = await image.buffer();
      this.bot.telegram.sendPhoto(
        news.chat_id,
        { source: buffer },
        {
          caption: caption,
          parse_mode: "HTML",
        }
      );
      return;
    } catch (error) {}

    this.bot.telegram.sendPhoto(news.chat_id, news.main_picture, {
      caption: caption,
      parse_mode: "HTML",
    });
  };
}
