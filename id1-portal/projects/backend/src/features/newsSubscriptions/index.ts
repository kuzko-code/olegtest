import { db } from "../../db";
import { DEFAULT_LANGUAGE, EMAIL_PATTERNS } from "../../constants";
import { method_payload } from "../base_api_image";
import format from "pg-format";
import {
  create_news_subscription_payload,
  delete_news_subscription_by_uuid_payload,
  get_news_subscription_by_uuid_payload,
  get_news_subscriptions_payload,
  update_news_subscription_by_uuid_payload,
} from "./types";
import { Helper } from "../../helper";
import { site_settings } from "../settings";
import { sendMail } from "../../handlers/email";

const i18n = require("i18n");

class Api {
  public async create_news_subscription({
    options: { email, status, language = DEFAULT_LANGUAGE },
    client = db,
  }: method_payload<create_news_subscription_payload>) {
    status = status ? status : "EveryDay";
    const createNewsSubscription = format(
      `SELECT * from add_news_subscription(%L, %L, %L)`,
      email,
      status,
      language
    );
    const res = await client
      .query(createNewsSubscription)
      .then((res: any) => res.rows[0]);
    await this.sendGreetingMail(res.uuid, res.email, res.status, res.language);
    return {};
  }

  public async get_news_subscriptions({
    options,
    client = db,
  }: method_payload<get_news_subscriptions_payload>) {
    const getNewsSubs =
      this.build_query_for_getting_news_subscriptions(options);

    return await client.query(getNewsSubs).then((res: any) => {
      if (options.aggregate.func) return res.rows[0];
      else return res.rows;
    });
  }

  public async get_news_subscription_by_uuid({
    options: { uuid, selectedFields, language },
    client = db,
  }: method_payload<get_news_subscription_by_uuid_payload>) {
    let fieldsQuery = selectedFields
      ? selectedFields
          .map((f) => {
            return format(`"mailing".%I`, f);
          })
          .join()
      : `*`;

    let getNewsSubByUUID = format(
      `
                SELECT %s
                FROM "mailing"
                WHERE uuid = %L
            `,
      fieldsQuery,
      uuid
    );
    if (language) getNewsSubByUUID += format(` AND language = %L`, language);
    return await client.query(getNewsSubByUUID).then((res: any) => res.rows[0]);
  }

  public async update_news_subscription_by_uuid({
    options: { uuid, status },
    client = db,
  }: method_payload<update_news_subscription_by_uuid_payload>) {
    const updateNewsSub = format(
      `
                UPDATE "mailing"
                SET status = %L
                WHERE uuid = %L 
                RETURNING uuid, email, status, language;
            `,
      status,
      uuid
    );
    const res = await client
      .query(updateNewsSub)
      .then((res: any) => res.rows[0]);
    await this.sendGreetingMail(res.uuid, res.email, res.status, res.language);
    return {};
  }

  public async delete_news_subscription_by_uuid({
    options: { uuid },
    client = db,
  }: method_payload<delete_news_subscription_by_uuid_payload>) {
    const deleteNewsSub = format(
      `
                DELETE
                FROM "mailing"
                WHERE uuid = %L`,
      uuid
    );

    return await client.query(deleteNewsSub).then((res: any) => res.rows);
  }

  public async sendNewsMessageMail(status: string, client = db) {
    const languages = await this.get_language_from_digest(status);

    for (let lang of languages) {
      i18n.setLocale(lang.language);
      const usersToSend = await this.get_emails_for_send_news(
        status,
        lang.language
      );
      const newsToSend = await this.get_news_for_mail(status, lang.language);

      if (newsToSend && newsToSend.length > 0) {
        let html: string = `<h2 style = 'color: black'>${i18n.__("News")}</h2>`;

        for (let news of newsToSend) {
          let news_date: string = await this.get_date_for_mail(
            news.published_date,
            lang.language
          );

          html += `<div style='color: darkgray'>${news_date}</div><a href='${process.env.PUBLIC_HOST}/news/${news.id}' style='color: mediumblue; font-weight: bolder; font-size: medium; font-family: Arial;'>${news.title}</a><br/><br/>`;
        }

        for (let user of usersToSend) {
          let settingsHTML = `<h2 style = 'color: black'>${i18n.__(
            "mailing_settings"
          )} <a href='${process.env.PUBLIC_HOST}/mailing/settings/${
            user.uuid
          }' style='color: mediumblue; font-weight: bolder; font-size: medium; font-family: Arial;'>${i18n.__(
            "mailing_settings_click"
          )}</a></h2>`;
          await this.sendMailWithNews(
            user.email,
            html + settingsHTML,
            lang.language
          );
        }
      }
    }
    return {};
  }

  private build_query_for_getting_news_subscriptions({
    selectedFields,
    filters,
    sort,
    limit,
    aggregate,
    language = DEFAULT_LANGUAGE,
  }: get_news_subscriptions_payload): string {
    let fieldsQuery;

    if (aggregate.func) {
      const field = aggregate.field ? format.ident(aggregate.field) : "*";
      fieldsQuery = `${aggregate.func}(${field})`;
    } else {
      fieldsQuery = selectedFields
        ? selectedFields.map((f) => format(`"mailing".%I`, f)).join()
        : `*`;
    }

    let sql = format(
      `
                SELECT %s
                FROM "mailing"
                WHERE "mailing".language = %L   `,
      fieldsQuery,
      language
    );

    if (filters.uuids) {
      sql += "AND" + format(`"mailing".uuid IN (%L)`, filters.uuids) + "\n";
    }
    if (filters.search) {
      sql += Helper.add_search_to_sql_query(
        filters.search,
        filters.searchKeys,
        `"mailing"`
      );
    }
    if (filters.from) {
      sql +=
        "AND" +
        format(`"mailing".subscription_date >= %L`, filters.from) +
        "\n";
    }
    if (filters.to) {
      sql +=
        "AND" + format(`"mailing".subscription_date <= %L`, filters.to) + "\n";
    }
    if (filters.status) {
      sql += "AND" + format(`"mailing".status = %L`, filters.status) + "\n";
    }
    if (sort.field && !aggregate.func) {
      sql +=
        format(`ORDER BY "mailing".%I %s`, sort.field, sort.direction) + "\n";
    }
    if (limit.count !== null || limit.start !== null) {
      sql += format(`LIMIT %L OFFSET %L`, limit.count, limit.start);
    }

    return sql;
  }

  private async get_date_for_mail(date: Date, language: string) {
    i18n.setLocale(language);
    const optionsMonth = { month: "long" };

    const dateString =
      ("0" + date.getHours()).slice(-2) +
      ":" +
      ("0" + date.getMinutes()).slice(-2) +
      ", " +
      `${i18n.__(
        `${date.toLocaleDateString(
          i18n.__("plugins_store_liqpay_lang"),
          optionsMonth
        )}`
      )}` +
      " " +
      ("0" + date.getDate()).slice(-2) +
      ", " +
      date.getFullYear();

    return `${dateString}`;
  }

  private async get_language_from_digest(status: string, client = db) {
    const res = await client.query(
      format(
        `SELECT distinct "mailing".language
                 FROM "mailing"
                 WHERE "mailing".status = %L  `,
        status
      )
    );

    return res.rows;
  }

  private async get_emails_for_send_news(
    status: string,
    language: string,
    client = db
  ) {
    const res = await client.query(
      format(
        `
                    SELECT "mailing".email, "mailing".uuid
                    FROM "mailing"
                    WHERE "mailing".status = %L AND "mailing".language = %L  `,
        status,
        language
      )
    );

    return res.rows;
  }

  private async get_news_for_mail(
    status: string,
    language = DEFAULT_LANGUAGE,
    client = db
  ) {
    const nowDate = new Date(Date.now());
    let fromDate = new Date(Date.now());

    if (status == "EveryDay") {
      fromDate.setDate(fromDate.getDate() - 1);
    } else if (status == "EveryWeek") {
      fromDate.setDate(fromDate.getDate() - 7);
    } else if (status == "EveryMonth") {
      fromDate.setMonth(fromDate.getMonth() - 1);
    }

    let sql = format(
      `
                SELECT "news".id, "news".title, "news".published_date
                FROM "news"
                WHERE "news".language = %L
                  AND "news".published_date >= %L
                  AND "news".published_date <= %L  `,
      language,
      fromDate,
      nowDate
    );

    return await client.query(sql).then((res: any) => res.rows);
  }

  private async sendGreetingMail(
    uuid: string,
    email: string,
    status: string,
    language: string
  ) {
    i18n.setLocale(language);
    let html = `
        <h2 style = 'color: black'>${i18n.__(
          "mailing_settings_congratulation"
        )}</h2>
        <p>${i18n.__(`mailing_settings_congratulation_${status}`)}</p>
    `;

    if (status != "Never") {
      html += `
        <p>
            ${i18n.__("mailing_settings")} 
            <a href='${
              process.env.PUBLIC_HOST
            }/${language}/mailing/settings/${uuid}'>
                ${i18n.__("mailing_settings_click")}
            </a>
        </p>`;
    }
    await this.sendMailWithNews(email, html, language);
  }

  private async sendMailWithNews(
    email: string,
    html: string,
    language: string
  ) {
    let siteName;
    try {
      let layout = await site_settings.get_site_name(language);
      siteName = layout.siteName;
    } catch {}
    i18n.setLocale(language);

    await sendMail({
      from: siteName ? siteName + "<foo@example.com>" : EMAIL_PATTERNS.SENDER,
      to: email,
      subject: i18n.__("News"),
      text: i18n.__("News"),
      html: format(html),
    });
  }
}

export const NewsSubscriptions = new Api();
