import { page_client, news_for_facebook } from "./types";

export default class FacebookBot {
  public sendFacebookNews = async (
    client: page_client,
    news: news_for_facebook
  ) => {
    const fetch = require("node-fetch");
    let pictureURL = (process.env.PUBLIC_HOST || "") + news.main_picture;
    pictureURL = encodeURI(pictureURL);
    const data = {
      message: `${news.title}\n${news.description}\n${news.news_URL}`,
      url: pictureURL,
      access_token: client.pageAccessToken,
    };
    const url = `https://graph.facebook.com/${client.pageID}/photos`;
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    console.log("Facebook bot response: ", res);
  };
}
