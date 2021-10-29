import { db } from "../../../db";
import { DEFAULT_LANGUAGE } from "../../../constants";
import { method_payload } from "../../base_api_image";
import format from "pg-format";
import {
  create_tag_payload,
  get_tags_payload,
  get_tag_by_id_payload,
  update_tag_payload,
  delete_tag_by_id_payload,
} from "./types";

class Api {
  public async create_tag({
    options: { title, language = DEFAULT_LANGUAGE },
    client = db,
  }: method_payload<create_tag_payload>) {
    const containsTag = `SELECT 1 FROM news_tags WHERE title = $1 AND language = $2`;
    let result = await client.query(containsTag, [title, language]);

    if (result.rowCount != 0)
      throw new Error(
        `duplicate key value violates unique constraint "news_tags_title_unique"`
      );

    const createTag = `
              INSERT INTO news_tags
              (title, language)
              VALUES($1, $2)
              RETURNING id;
        `;

    return client
      .query(createTag, [title, language])
      .then((res) => res.rows[0]);
  }

  public get_tags({ options, client = db }: method_payload<get_tags_payload>) {
    const getTags = this.build_query(options);

    return client.query(getTags).then((res) => {
      if (options.aggregate.func) return res.rows[0];
      else return res.rows;
    });
  }

  private build_query({
    selectedFields,
    aggregate,
    filters,
    sort,
    limit,
    language = DEFAULT_LANGUAGE,
  }: get_tags_payload): string {
    let fieldsQuery;

    if (aggregate.func) {
      const field = aggregate.field ? format.ident(aggregate.field) : "*";
      fieldsQuery = `${aggregate.func}(${field})`;
    } else {
      fieldsQuery = selectedFields
        ? selectedFields.map((f) => format("news_tags.%I", f)).join()
        : "news_tags.*";
    }

    let sql = format(
      `SELECT %s FROM news_tags WHERE language = %L \n`,
      fieldsQuery,
      language
    );

    if (filters.search) {
      sql +=
        "AND " +
        format("news_tags.title ILIKE %L ", "%%%" + filters.search + "%%") +
        "\n";
    }

    if (sort.field && !aggregate.func) {
      sql +=
        format("ORDER BY news_tags.%I %s ", sort.field, sort.direction) + "\n";
    }

    if (limit.count !== null || limit.start !== null) {
      sql += format("LIMIT %L OFFSET %L ", limit.count, limit.start);
    }

    return sql;
  }

  public get_tag_by_id({
    options: { id, selectedFields },
    client = db,
  }: method_payload<get_tag_by_id_payload>) {
    let fieldsQuery = selectedFields
      ? selectedFields.map((f) => format("news_tags.%I", f)).join()
      : "news_tags.*";

    const sql = `
              SELECT ${fieldsQuery}
              FROM news_tags
              WHERE news_tags.id = $1
        `;

    return client.query(sql, [id]).then((res) => res.rows[0]);
  }

  public async update_tag({
    options: { id, title, language = DEFAULT_LANGUAGE },
    client = db,
  }: method_payload<update_tag_payload>) {
    const containsTag = `SELECT 1 FROM news_tags WHERE title = $1 AND language = $2 AND id != $3`;
    let result = await client.query(containsTag, [title, language, id]);
    if (result.rowCount != 0)
      throw new Error(
        `duplicate key value violates unique constraint "news_tags_title_unique"`
      );

    const sql = `
              UPDATE news_tags
              SET title = $1, language = $2
              WHERE id = $3
        `;

    return client.query(sql, [title, language, id]).then((res) => {
      return {};
    });
  }

  public delete_tag_by_id({
    options: { id },
    client = db,
  }: method_payload<delete_tag_by_id_payload>) {
    const sql = `
              DELETE FROM news_tags
              WHERE id = $1
        `;

    return client.query(sql, [id]).then((res) => {
      return {};
    });
  }
}

export const NewsTags = new Api();
