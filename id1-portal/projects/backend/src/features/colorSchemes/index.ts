import { db } from "../../db";
import { method_payload } from "../base_api_image";
import format from "pg-format";
import {
  create_color_scheme_payload,
  get_color_schemes_payload,
  get_color_scheme_by_id_payload,
  update_color_scheme_payload,
  delete_color_scheme_by_id_payload,
} from "./types";

class Api {
  public async create_color_scheme({
    options: { color_scheme },
    client = db,
  }: method_payload<create_color_scheme_payload>) {
    const createcolor_scheme = format(
      "INSERT INTO color_schemes (color_scheme) VALUES(%L) RETURNING id",
      JSON.stringify(color_scheme)
    );

    return client.query(createcolor_scheme).then((res) => res.rows[0]);
  }

  public get_color_schemes({
    options,
    client = db,
  }: method_payload<get_color_schemes_payload>) {
    const getcolor_schemes = this.build_query(options);

    return client.query(getcolor_schemes).then((res) => {
      if (options.aggregate.func) return res.rows[0];
      else return res.rows;
    });
  }

  private build_query({
    selectedFields,
    aggregate,
    sort,
    limit,
  }: get_color_schemes_payload): string {
    let fieldsQuery;

    if (aggregate.func) {
      const field = aggregate.field ? format.ident(aggregate.field) : "*";
      fieldsQuery = `${aggregate.func}(${field})`;
    } else {
      fieldsQuery = selectedFields
        ? selectedFields.map((f) => format("color_schemes.%I", f)).join()
        : "color_schemes.*";
    }

    let sql = format(`SELECT %s FROM color_schemes WHERE true \n`, fieldsQuery);

    if (sort.field && !aggregate.func) {
      sql +=
        format("ORDER BY color_schemes.%I %s", sort.field, sort.direction) +
        "\n";
    }

    if (limit.count !== null || limit.start !== null) {
      sql += format("LIMIT %L OFFSET %L", limit.count, limit.start);
    }

    return sql;
  }

  public get_color_scheme_by_id({
    options: { id, selectedFields },
    client = db,
  }: method_payload<get_color_scheme_by_id_payload>) {
    let fieldsQuery = selectedFields
      ? selectedFields.map((f) => format("color_schemes.%I", f)).join()
      : "color_schemes.*";

    const sql = `
              SELECT ${fieldsQuery}
              FROM color_schemes
              WHERE color_schemes.id = $1
        `;

    return client.query(sql, [id]).then((res) => res.rows[0]);
  }

  public async update_color_scheme({
    options: { id, color_scheme },
    client = db,
  }: method_payload<update_color_scheme_payload>) {
    const sql = format(
      "UPDATE color_schemes SET color_scheme = %L WHERE id = %L",
      JSON.stringify(color_scheme),
      id
    );

    return client.query(sql).then((res) => {
      return {};
    });
  }

  public async delete_color_scheme_by_id({
    options: { id },
    client = db,
  }: method_payload<delete_color_scheme_by_id_payload>) {
    const sql = `
              DELETE FROM color_schemes
              WHERE id = $1`;

    return client.query(sql, [id]).then(() => {
      return {};
    });
  }

  public async isDefaultColorScheme(id: number, client = db) {
    const containsTag = `SELECT 1 FROM color_schemes WHERE id = $1 AND custom_color_scheme = false`;
    let result = await client.query(containsTag, [id]);
    if (result.rowCount != 0) return true;
  }
}

export const color_schemes = new Api();
