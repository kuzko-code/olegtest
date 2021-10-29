import { Telegraf } from "telegraf";
import { db } from "../../db";
import { DEFAULT_LANGUAGE } from "../../constants";
import { method_payload } from "../base_api_image";
import format from "pg-format";
import bot from "../telegram-bot/bot";
import { attachments } from "../attachments";
import {
  create_news_payload,
  get_news_payload,
  get_news_by_id_payload,
  update_news_payload,
  delete_news_by_id_payload,
  get_tags_rating_payload,
  add_view_to_news,
  news_for_social_media,
  get_news_by_rubric_payload,
  rubric_query,
} from "./types";
import { Helper } from "../../helper";
import { site_settings } from "../settings";
import FacebookBot from "../facebook-bot/bot";

class Api {
  private async checkIfPublishedFirstTime(id: number, client: any) {
    const sql = `
			SELECT is_published
			FROM news
			WHERE id = ${id};`;
    let result = (await client.query(sql)).rows[0];

    return result ? result.is_published : false;
  }

  private async getUrlTelegramNotification() {
    let result = await site_settings.get_site_settings_by_title({
      options: {
        title: "telegramNotification",
        language: "",
      },
    });

    return result.settings_object;
  }

  private async getUrlFacebookNotification() {
    let result = await site_settings.get_site_settings_by_title({
      options: {
        title: "facebookBotSettings",
        language: "",
      },
    });

    return result.settings_object;
  }

  private async sendSocialMediaNotification(news: news_for_social_media[]) {
    await this.sendTelegramMessage(news);
    await this.sendFacebookMessage(news);
  }

  private async sendTelegramMessage(news: news_for_social_media[]) {
    try {
      let telegram_params = await this.getUrlTelegramNotification();

      if (
        telegram_params.enabled === true &&
        telegram_params.channel_id &&
        telegram_params.telegram_token
      ) {
        const telegramBot = new Telegraf(telegram_params.telegram_token);
        const telegram = new bot(telegramBot);

        if (telegram)
          news.forEach((e) =>
            telegram.sendNews({ ...e, chat_id: telegram_params.channel_id })
          );
      }
    } catch (e) {
      console.log("error =>>" + e);
    }
  }

  private async sendFacebookMessage(news: news_for_social_media[]) {
    try {
      let facebook_client = await this.getUrlFacebookNotification();
      if (
        facebook_client.enableBot === true &&
        facebook_client.pageID &&
        facebook_client.pageAccessToken
      ) {
        const facebook = new FacebookBot();
        news.forEach((n) => {
          //Posting all the news on Facebook
          // facebook.sendFacebookNews(facebook_client, { ...n });
          // Specific category news publishing on Facebook
          if (facebook_client.rubrics.includes(n.rubric_id)) {
            facebook.sendFacebookNews(facebook_client, { ...n });
          }
        });
      } else {
        console.log("error =>> Facebook bot is not configured");
      }
    } catch (error) {
      console.log("error =>>" + error);
    }
  }

  public async create_news({
    options: {
      title,
      main_picture,
      description,
      content,
      rubric_id,
      tags,
      is_published,
      attachments,
      images,
      published_date,
      facebook_enable,
      language = DEFAULT_LANGUAGE,
    },
    client = db,
  }: method_payload<create_news_payload>) {
    const nowDate = new Date(Date.now());
    let published = Helper.getPublishDate(
      published_date,
      nowDate,
      is_published
    );

    const createNews = `
              INSERT INTO news
              (title, main_picture, description, content, rubric_id, tags, created_date, updated_date, is_published, published_date, language, images, facebook_enable)
              VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
              RETURNING id;
        `;
    const res = await client.query(createNews, [
      title,
      main_picture,
      description,
      content,
      rubric_id,
      tags,
      nowDate,
      nowDate,
      published.is_published,
      published.published_date,
      language,
      images,
      facebook_enable,
    ]);
    const newsId = res.rows[0].id;

    if (attachments) {
      let attacs = attachments.map((attac) =>
        format("ROW(%L, %L)", attac.id, attac.is_active)
      );

      const setAttachments = format(
        "SELECT set_attacs_to_news(%L, ARRAY[%s]::attachment[])",
        newsId,
        attacs
      );
      await client.query(setAttachments);
    }

    const updateTags = format(
      `SELECT add_tag(ARRAY[%L]::varchar[], %L)`,
      tags,
      language
    );
    client.query(updateTags);

    if (is_published === true) {
      let PUBLIC_HOST = process.env.PUBLIC_HOST ? process.env.PUBLIC_HOST : "";
      PUBLIC_HOST = PUBLIC_HOST.endsWith("/") ? PUBLIC_HOST : PUBLIC_HOST + "/";
      this.sendSocialMediaNotification([
        {
          title,
          main_picture,
          description,
          rubric_id: rubric_id ? rubric_id : 0,
          news_URL: PUBLIC_HOST + language + "/news/" + newsId,
        },
      ]);
    }
    return newsId;
  }

  public async get_news({
    options,
    client = db,
  }: method_payload<get_news_payload>) {
    const getNews = this.build_query_for_getting_news(options);

    const res = await client.query(getNews);

    if (options.aggregate.func) {
      return res.rows[0];
    } else {
      if (
        options.includedResources &&
        options.includedResources.includes("rubric")
      ) {
        res.rows = res.rows.map(this.includeRubric);
      }
      return res.rows;
    }
  }

  private build_query_for_getting_news({
    selectedFields,
    includedResources,
    aggregate,
    filters,
    sort,
    limit,
    language = DEFAULT_LANGUAGE,
  }: get_news_payload): string {
    let fieldsQuery;
    let joins = "";

    if (aggregate.func) {
      const field = aggregate.field ? format.ident(aggregate.field) : "*";
      fieldsQuery = `${aggregate.func}(${field})`;
    } else {
      if (
        selectedFields &&
        sort.field &&
        !selectedFields.includes("status") &&
        sort.field == "status"
      )
        selectedFields.push("status");
      fieldsQuery = selectedFields
        ? selectedFields
            .map((f) => {
              if (f == "status") return Helper.add_status_to_sql_query("news");
              return format("news.%I", f);
            })
            .join()
        : `news.*, ${Helper.add_status_to_sql_query("news")}`;
      if (sort.field == "date") {
        fieldsQuery +=
          format(
            ", CASE when published_date IS NULL THEN created_date ELSE published_date end as date"
          ) + "\n";
      }

      if (includedResources && includedResources.includes("rubric")) {
        fieldsQuery +=
          ",news_rubrics.id j_rubric_id, news_rubrics.title as j_rubric_title";
        joins += "LEFT JOIN news_rubrics ON news.rubric_id = news_rubrics.id";
      }
    }

    let sql = format(
      "SELECT %s FROM news %s WHERE news.language = %L \n",
      fieldsQuery,
      joins,
      language
    );

    if (filters.ids) {
      sql += "AND " + format("news.id IN (%L)", filters.ids) + "\n";
    }
    if (filters.search) {
      sql += Helper.add_search_to_sql_query(
        filters.search,
        filters.searchKeys,
        `news`
      );
    }

    if (filters.rubrics) {
      sql += "AND " + format("(news.rubric_id IN (%L)", filters.rubrics);
      if (filters.rubrics.includes(0)) {
        sql += "OR " + format("news.rubric_id IS null)") + "\n";
      } else {
        sql += ") \n";
      }
    }

    if (filters.tags) {
      sql +=
        "AND " +
        format("news.tags && ARRAY[%L]::varchar[]", filters.tags) +
        "\n";
    }

    if (filters.from) {
      sql += "AND " + format("news.published_date >= %L", filters.from) + "\n";
    }

    if (filters.to) {
      sql += "AND " + format("news.published_date <= %L", filters.to) + "\n";
    }

    if (filters.isPublished !== null) {
      sql +=
        "AND " + format("news.is_published = %L", filters.isPublished) + "\n";
    }

    if (sort.field && !aggregate.func) {
      if (sort.field == "date") {
        sql += format("ORDER BY date %s", sort.direction) + "\n";
      } else {
        sql +=
          format(
            "ORDER BY %s%I %s, news.published_date desc",
            sort.field != "status" ? "news." : "",
            sort.field,
            sort.direction
          ) + "\n";
      }
    }

    if (limit.count !== null || limit.start !== null) {
      sql += format("LIMIT %L OFFSET %L", limit.count, limit.start);
    }

    return sql;
  }

  public async get_news_by_rubrics({
    options,
    client = db,
  }: method_payload<get_news_by_rubric_payload>) {
    const sqlRubrics: rubric_query[] =
      this.build_query_for_getting_news_by_rubrics(options);
    let result = {};

    const promises = sqlRubrics.map(async (rubric) => {
      const res = await client.query(rubric.query);
      result = Object.assign(result, {
        [rubric.rubric_id]: res.rows.map(this.includeRubric),
      });
    });

    await Promise.all(promises);
    return result;
  }

  private build_query_for_getting_news_by_rubrics({
    selectedFields,
    rubrics,
    filters,
    sort,
    limit,
    language = DEFAULT_LANGUAGE,
  }: get_news_by_rubric_payload): rubric_query[] {
    let fieldsQuery;
    let joins = "";

    fieldsQuery = selectedFields
      ? selectedFields
          .map((f) => {
            return format("news.%I", f);
          })
          .join()
      : `news.*`;
    if (sort.field == "date") {
      fieldsQuery +=
        format(
          ", CASE when published_date IS NULL THEN created_date ELSE published_date end as date"
        ) + "\n";
    }

    fieldsQuery +=
      ",news_rubrics.id j_rubric_id, news_rubrics.title as j_rubric_title";
    joins += "LEFT JOIN news_rubrics ON news.rubric_id = news_rubrics.id";

    let querys: rubric_query[] = [];

    let sql = format(
      "SELECT %s FROM news %s WHERE news.language = %L \n",
      fieldsQuery,
      joins,
      language
    );

    if (filters.from) {
      sql += " AND " + format("news.published_date >= %L", filters.from) + "\n";
    }

    if (filters.to) {
      sql += " AND " + format("news.published_date <= %L", filters.to) + "\n";
    }

    if (filters.isPublished !== null) {
      sql +=
        " AND " + format("news.is_published = %L", filters.isPublished) + "\n";
    }

    if (rubrics) {
      rubrics.map((rubric) => {
        let tempSQL = sql;
        if (rubric == 0) {
          tempSQL += " AND " + format("news.rubric_id IS null") + "\n";
        } else {
          tempSQL += " AND " + format("news.rubric_id = (%L) \n", rubric);
        }

        if (sort.field) {
          if (sort.field == "date") {
            tempSQL += format(" ORDER BY news.date %s", sort.direction) + "\n";
          } else {
            tempSQL +=
              format(
                " ORDER BY news.%I %s, news.published_date desc",
                sort.field,
                sort.direction
              ) + "\n";
          }
        }

        if (limit.count !== null) {
          tempSQL += format("LIMIT %L", limit.count);
        }
        querys.push({ query: tempSQL, rubric_id: rubric });
      });
    }

    return querys;
  }

  private includeRubric(row: any) {
    delete row.rubric_id;
    if (!row.j_rubric_id) {
      delete row.j_rubric_id;
      delete row.j_rubric_title;
      row.rubric = null;
      return row;
    }
    row.rubric = {
      id: row.j_rubric_id,
      title: row.j_rubric_title,
    };
    delete row.j_rubric_id;
    delete row.j_rubric_title;
    return row;
  }

  public async get_news_by_id({
    options: { id, selectedFields, includedResources },
    client = db,
  }: method_payload<get_news_by_id_payload>) {
    let joins = "";
    let fieldsQuery = selectedFields
      ? selectedFields
          .map((f) => {
            if (f == "status") return Helper.add_status_to_sql_query("news");
            return format("news.%I", f);
          })
          .join()
      : `news.*, ${Helper.add_status_to_sql_query("news")}`;

    if (includedResources && includedResources.includes("rubric")) {
      fieldsQuery +=
        ",news_rubrics.id j_rubric_id, news_rubrics.title as j_rubric_title";
      joins += "LEFT JOIN news_rubrics ON news.rubric_id = news_rubrics.id";
    }

    const getNews = `
              SELECT ${fieldsQuery}
              FROM news ${joins}
              WHERE news.id = $1
        `;

    const res = await client.query(getNews, [id]);
    const news = res.rows[0];

    if (!news) {
      return {};
    }

    if (includedResources && includedResources.includes("rubric")) {
      this.includeRubric(news);
    }

    if (
      includedResources &&
      (includedResources.includes("nextNews") ||
        includedResources.includes("previousNews"))
    ) {
      let fields = "";
      if (includedResources.includes("nextNews")) {
        fields += `LEAD(news.id) OVER (ORDER BY news.published_date asc, news.id asc) next_news_id,
                LEAD(news.title) OVER (ORDER BY news.published_date asc, news.id asc) next_news_title,`;
      }

      if (includedResources.includes("previousNews")) {
        fields += `LAG(news.id) OVER (ORDER BY news.published_date asc, news.id asc) previous_news_id,
                LAG(news.title) OVER (ORDER BY news.published_date asc, news.id asc) previous_news_title,`;
      }

      const sql = `
            select * from (select
                ${fields}
                news.id
                from news WHERE news."language" = (select language from news where id = $1) and news.is_published = true ORDER BY news.published_date asc, news.id asc) as list_news 
                where list_news.id = $1
            `;

      const nextAndPreviousNews = (await client.query(sql, [id])).rows[0];

      if (includedResources.includes("nextNews")) {
        news.nextNews = {
          id: nextAndPreviousNews.next_news_id,
          title: nextAndPreviousNews.next_news_title,
        };
      }

      if (includedResources.includes("previousNews")) {
        news.previousNews = {
          id: nextAndPreviousNews.previous_news_id,
          title: nextAndPreviousNews.previous_news_title,
        };
      }
    }

    if (
      includedResources &&
      (includedResources.includes("attachments") ||
        includedResources.includes("allAttachments"))
    ) {
      let filter = includedResources.includes("attachments")
        ? "AND news_attachments.is_active = true"
        : "";
      const getAttachments = `
            SELECT 
                   attachments.id,
                   attachments.source_url,
                   attachments.storage_key,
                   news_attachments.is_active
            FROM news
              inner JOIN news_attachments
                ON news.id = news_attachments.news_id
              inner JOIN attachments
                ON news_attachments.attachment_id = attachments.id
            WHERE news.id = $1 ${filter} ORDER BY attachments.uploaded_at
            `;

      const attacs = (await client.query(getAttachments, [id])).rows;
      news.attachments = attacs;
    }

    return news;
  }

  public async update_news({
    options: {
      id,
      title,
      main_picture,
      description,
      content,
      rubric_id,
      tags,
      is_published,
      attachments,
      images,
      published_date,
      facebook_enable,
      language = DEFAULT_LANGUAGE,
    },
    client = db,
  }: method_payload<update_news_payload>) {
    const wasPublished = await this.checkIfPublishedFirstTime(id, client);

    const nowDate = new Date(Date.now());
    let published = Helper.getPublishDate(
      published_date,
      nowDate,
      is_published
    );
    //  TODO: Add the ability to update partial

    const updateNews = `
              UPDATE news
              SET title = $1, main_picture = $2, description = $3, content = $4, rubric_id = $5, tags = $6, is_published = $7, language = $8, images = $9, published_date = $10, updated_date = $11, facebook_enable = $12
              WHERE id = $13;
        `;
    await client.query(updateNews, [
      title,
      main_picture,
      description,
      content,
      rubric_id,
      tags,
      published.is_published,
      language,
      images,
      published.published_date,
      nowDate,
      facebook_enable,
      id,
    ]).then((res: any) => res.rows);

    let attacs = attachments
      ? attachments.map((attac) =>
          format("ROW(%L, %L)", attac.id, attac.is_active)
        )
      : [];
    const setAttachments = format(
      "SELECT set_attacs_to_news(%L, ARRAY[%s]::attachment[])",
      id,
      attacs
    );
    await client.query(setAttachments);

    const updateTags = format(
      `SELECT add_tag(ARRAY[%L]::varchar[], %L)`,
      tags,
      language
    );
    client.query(updateTags);

    if (!is_published) {
      await client.query(`SELECT delete_news_from_json_schemas($1)`, [id]);
    } else {
      if (!wasPublished) {
        let PUBLIC_HOST = process.env.PUBLIC_HOST
          ? process.env.PUBLIC_HOST
          : "";
        PUBLIC_HOST = PUBLIC_HOST.endsWith("/")
          ? PUBLIC_HOST
          : PUBLIC_HOST + "/";
        this.sendSocialMediaNotification([
          {
            title,
            main_picture,
            description,
            rubric_id: rubric_id ? rubric_id : 0,
            news_URL: PUBLIC_HOST + language + "/news/" + id,
          },
        ]);
      }
      // this.sendDigestMailing(await this.getEmailForDigestMailing(language));
    }
    return {};
  }

  public async delete_news_by_id({
    options: { id },
    client = db,
  }: method_payload<delete_news_by_id_payload>) {
    const deleteNews = `
              DELETE FROM news
              WHERE id = $1
              RETURNING images, main_picture`;

    let attachmentsFilesIds: string[] = await this.getAttachmentsByIds(id);

    await client.query(`SELECT delete_news_from_json_schemas($1)`, [id]);
    let res = await client.query(deleteNews, [id]).then((res: any) => res.rows);

    let imgFilesIds: string[] = Helper.get_attachment_id_by_url(
        res.map((arr: any) => [arr.images, arr.main_picture]).flat(2)
    );

    attachments.delete_attachments([...attachmentsFilesIds, ...imgFilesIds]);
    return {};
  }

  private async getAttachmentsByIds(id: number, client = db) {
    const getAttachments = `SELECT 
		attachment_id
		FROM news_attachments             
		WHERE news_attachments.news_id = $1`;

    let attacs = await client
      .query(getAttachments, [id])
      .then((res) => res.rows);
    return attacs.map((res) => res.attachment_id);
  }

  public async get_tags_rating({
    options: { limit, language = DEFAULT_LANGUAGE },
    client = db,
  }: method_payload<get_tags_rating_payload>) {
    let getTagsRating = format(
      `
              SELECT
                 unnest(tags) as tag,
                 COUNT(id)
              FROM
                 news
                 where is_published = true AND language = %L
              GROUP BY tag
              ORDER BY count desc `,
      language
    );

    if (limit.count !== null || limit.start !== null) {
      getTagsRating += format("LIMIT %L OFFSET %L", limit.count, limit.start);
    }

    const res = await client.query(getTagsRating);
    return res.rows.map((r) => r.tag);
  }

  public async add_view({
    options: { id },
    client = db,
  }: method_payload<add_view_to_news>) {
    const addView = `
              UPDATE news
              SET number_of_views = number_of_views + 1
              WHERE id = $1;
        `;

    await client.query(addView, [id]);
    return {};
  }

  public async auto_published(client = db) {
    const auto_published = `
        UPDATE public.news
        SET is_published=true,
         auto_published=true
        WHERE published_date <= NOW()::timestamp and  is_published = false
        returning id, title, "description", rubric_id, main_picture, language;`;

    let PUBLIC_HOST = process.env.PUBLIC_HOST ? process.env.PUBLIC_HOST : "";
    PUBLIC_HOST = PUBLIC_HOST.endsWith("/") ? PUBLIC_HOST : PUBLIC_HOST + "/";

    let newsList: news_for_social_media[] = [];
    await client.query(auto_published).then((res) => {
      res.rows.forEach((news) => {
        newsList.push({
          title: news.title,
          main_picture: news.main_picture,
          description: news.description,
          rubric_id: news.rubric_id ? news.rubric_id : 0,
          news_URL: PUBLIC_HOST + news.language + "/news/" + news.id,
        });
      });
    });
    this.sendSocialMediaNotification(newsList);
    return {};
  }
}

export const News = new Api();
