import { db } from "../../../db";
import { DEFAULT_LANGUAGE } from "../../../constants";
import { method_payload } from "../../base_api_image";
import format from "pg-format";
import {
  create_rubric_payload,
  get_rubrics_payload,
  get_rubric_by_id_payload,
  update_rubric_payload,
  delete_rubric_by_id_payload,
} from "./types";

class Api {
  public async create_rubric({
    options: { title, language = DEFAULT_LANGUAGE },
    client = db,
  }: method_payload<create_rubric_payload>) {
    const containsRubric = `SELECT 1 FROM news_rubrics WHERE title = $1 AND language = $2`;
    let result = await client.query(containsRubric, [title, language]);
    if (result.rowCount != 0)
      throw new Error(
        `duplicate key value violates unique constraint "news_rubrics_title_unique"`
      );

    const createRubric = `
              INSERT INTO news_rubrics
              (title, language)
              VALUES($1, $2)
              RETURNING id;
        `;

    return client
      .query(createRubric, [title, language])
      .then((res) => res.rows[0]);
  }

  public get_rubrics({
    options,
    client = db,
  }: method_payload<get_rubrics_payload>) {
    const getRubrics = this.build_query(options);

    return client.query(getRubrics).then((res) => {
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
  }: get_rubrics_payload): string {
    let fieldsQuery;

    if (aggregate.func) {
      const field = aggregate.field ? format.ident(aggregate.field) : "*";
      fieldsQuery = `${aggregate.func}(${field})`;
    } else {
      fieldsQuery = selectedFields
        ? selectedFields.map((f) => format("news_rubrics.%I", f)).join()
        : "news_rubrics.*";
    }

    let sql = format(
      `SELECT %s FROM news_rubrics WHERE language = %L \n`,
      fieldsQuery,
      language
    );

    if (filters.search) {
      sql +=
        "AND " +
        format("news_rubrics.title ILIKE %L", "%%%" + filters.search + "%%") +
        "\n";
    }

    if (sort.field && !aggregate.func) {
      sql +=
        format("ORDER BY news_rubrics.%I %s", sort.field, sort.direction) +
        "\n";
    }

    if (limit.count !== null || limit.start !== null) {
      sql += format("LIMIT %L OFFSET %L", limit.count, limit.start);
    }

    return sql;
  }

  public get_rubric_by_id({
    options: { id, selectedFields },
    client = db,
  }: method_payload<get_rubric_by_id_payload>) {
    let fieldsQuery = selectedFields
      ? selectedFields.map((f) => format("news_rubrics.%I", f)).join()
      : "news_rubrics.*";

    const sql = `
              SELECT ${fieldsQuery}
              FROM news_rubrics
              WHERE news_rubrics.id = $1
        `;

    return client.query(sql, [id]).then((res) => res.rows[0]);
  }

  public async update_rubric({
    options: { id, title, language = DEFAULT_LANGUAGE },
    client = db,
  }: method_payload<update_rubric_payload>) {
    const containsRubric = `SELECT 1 FROM news_rubrics WHERE title = $1 AND language = $2 AND id != $3`;
    let result = await client.query(containsRubric, [title, language, id]);
    if (result.rowCount != 0)
      throw new Error(
        `duplicate key value violates unique constraint "news_rubrics_title_unique"`
      );

    const sql = `
              UPDATE news_rubrics
              SET title = $1, language = $2
              WHERE id = $3
        `;

    return client.query(sql, [title, language, id]).then((res) => {
      return {};
    });
  }

  public async delete_rubric_by_id({
    options: { id },
    client = db,
  }: method_payload<delete_rubric_by_id_payload>) {
    const sql = `
              DELETE FROM news_rubrics
              WHERE id = $1`;

    return client.query(sql, [id]).then(() => {
      return {};
    });
  }
}

export const NewsRubrics = new Api();
