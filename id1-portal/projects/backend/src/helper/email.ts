import format from "pg-format";
import { db } from "../db";

import { EMAIL_PATTERNS } from "../constants";
import { sendMail } from "../handlers/email";
import { site_settings } from "../features/settings/index";

class EmailServices {
  public sendEmail = async (email: string, language: string, html: string) => {
    let siteName;
    const i18n = require("i18n");
    i18n.setLocale(language);
    try {
      let layout = await site_settings.get_site_name(language);
      siteName = layout.siteName;
    } catch {}

    let info = await sendMail({
      from: siteName ? siteName + "<foo@example.com>" : EMAIL_PATTERNS.SENDER,
      to: email,
      subject: i18n.__("Welcome to system"),
      text: i18n.__("Welcome to system"),
      html: format(html),
    });
    return info;
  };
}

export const emailServices = new EmailServices();
