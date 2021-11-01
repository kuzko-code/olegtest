import { db } from "../../db";
import { method_payload } from "../base_api_image";
import format from "pg-format";
import { Helper } from "../../helper";
import { get_templates_payload, get_template_by_title_payload } from "./types";

class Api {
  public get_templates({
    options,
    client = db,
  }: method_payload<get_templates_payload>) {
    const getSiteTemplates = this.build_query(options);

    return client.query(getSiteTemplates).then((res) => {
      if (options.aggregate.func) return res.rows[0];
      else return res.rows;
    });
  }

  private build_query({
    selectedFields,
    aggregate,
    sort,
    limit,
    filters,
    includedResources,
  }: get_templates_payload): string {
    let fieldsQuery: string = "";
    let joins: string = "";

    if (aggregate.func) {
      const field = aggregate.field ? format.ident(aggregate.field) : "*";
      fieldsQuery = `${aggregate.func}(${field})`;
    } else {
      fieldsQuery = selectedFields
        ? selectedFields.map((f) => format("templates.%I", f)).join()
        : "templates.*";

      if (includedResources && includedResources.includes("schemas")) {
        fieldsQuery += ", json_schemas.json_schema, json_schemas.ui_schema ";
        joins +=
          " LEFT JOIN json_schemas ON templates.schema_id = json_schemas.id";
      }
    }

    let sql = format(
      `SELECT %s FROM templates %s WHERE true \n`,
      fieldsQuery,
      joins
    );
    if (filters.search) {
      sql += Helper.add_search_to_sql_query(
        filters.search,
        filters.searchKeys,
        `templates`
      );
    }

    if (sort.field && !aggregate.func) {
      sql +=
        format("ORDER BY templates.%I %s", sort.field, sort.direction) + "\n";
    }

    if (limit.count !== null || limit.start !== null) {
      sql += format("LIMIT %L OFFSET %L", limit.count, limit.start);
    }

    return sql;
  }

  public get_template_by_title({
    options: { title, selectedFields, includedResources },
    client = db,
  }: method_payload<get_template_by_title_payload>) {
    let fieldsQuery = selectedFields
      ? selectedFields.map((f: string) => format("templates.%I", f)).join()
      : "templates.*";

    let joins: string = "";

    if (includedResources && includedResources.includes("schemas")) {
      fieldsQuery += ", json_schemas.json_schema, json_schemas.ui_schema ";
      joins +=
        " LEFT JOIN json_schemas ON templates.schema_id = json_schemas.id";
    }

    const sql = `
              SELECT ${fieldsQuery}
              FROM templates
              ${joins}
              WHERE templates.title = $1
        `;

    return client.query(sql, [title]).then((res) => res.rows[0]);
  }

  public getJsonSchemasBySiteTemplate(title: string, client = db) {
    const sql = `select json_schemas.json_schema from templates join json_schemas on json_schemas.id = templates.schema_id where templates.title = $1 `;

    return client
      .query(sql, [title])
      .then((res) => (res.rows[0] ? res.rows[0].json_schema : null));
  }
}

export const SiteTemplates = new Api();
