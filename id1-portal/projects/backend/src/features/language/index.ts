import { db } from "../../db";
import { DEFAULT_LANGUAGE } from "../../constants";
import { method_payload } from "../base_api_image";
import format from "pg-format";
import { get_languages_payload, get_site_language_payload } from "./types";

class Api {
  public async get_all_languages() {
    let sql = `SELECT cutback FROM languages WHERE active=true\n`;
    return await db.query(sql).then((res) => {
      return res.rows.map((el) => el.cutback);
    });
  }

  public get_languages({
    options,
    client = db,
  }: method_payload<get_languages_payload>) {
    const getlanguages = this.build_query(options);

    return client.query(getlanguages).then((res) => {
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
  }: get_languages_payload): string {
    let fieldsQuery;

    if (aggregate.func) {
      const field = aggregate.field ? format.ident(aggregate.field) : "*";
      fieldsQuery = `${aggregate.func}(${field})`;
    } else {
      fieldsQuery = selectedFields
        ? selectedFields.map((f) => format("languages.%I", f)).join()
        : "languages.*";
    }

    let sql = `SELECT ${fieldsQuery} FROM languages WHERE active=true\n`;

    if (filters.cutbacks) {
      sql +=
        "AND " + format("languages.cutback IN (%L)", filters.cutbacks) + "\n";
    }

    if (filters.search) {
      sql +=
        "AND " +
        format("languages.title ILIKE %L", "%%%" + filters.search + "%%") +
        "\n";
    }

    if (sort.field && !aggregate.func) {
      sql +=
        format("ORDER BY languages.%I %s", sort.field, sort.direction) + "\n";
    }

    if (limit.count !== null || limit.start !== null) {
      sql += format("LIMIT %L OFFSET %L", limit.count, limit.start);
    }

    return sql;
  }

  public async get_site_language({
    options: { portal },
    client = db,
  }: method_payload<get_site_language_payload>) {
    const getSettingsObjectSQL = format(
      `
            SELECT settings_object
            FROM "site_settings"
            WHERE title = %L
        `,
      portal === "admin"
        ? "languagesOnTheAdminSite"
        : "languagesOnThePublicSite"
    );

    let languages = await client.query(getSettingsObjectSQL);

    const sql = format(
      `SELECT title, cutback
        FROM languages
        WHERE languages.cutback IN (%L) ORDER BY POSITION(cutback IN '%s');`,
      languages.rows[0].settings_object,
      languages.rows[0].settings_object
    );

    return client.query(sql).then((res) => res.rows);
  }
}

export const ApiLanguages = new Api();
