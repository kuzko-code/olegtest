import { db } from "../../../db";
import { method_payload } from "../../base_api_image";
import format from "pg-format";
import { Helper } from "../../../helper";
import {
  get_template_settings_payload,
  get_template_settings_by_title_payload,
  update_template_settings_payload,
} from "./types";
import { DEFAULT_LANGUAGE } from "../../../constants";

class Api {
  public get_template_settings({
    options,
    client = db,
  }: method_payload<get_template_settings_payload>) {
    const getSiteTemplateSettings = this.build_query(options);

    return client.query(getSiteTemplateSettings).then((res) => {
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
    language = DEFAULT_LANGUAGE,
  }: get_template_settings_payload): string {
    let fieldsQuery: string = "";
    let joins: string = "";

    if (aggregate.func) {
      const field = aggregate.field ? format.ident(aggregate.field) : "*";
      fieldsQuery = `${aggregate.func}(${field})`;
    } else {
      fieldsQuery = selectedFields
        ? selectedFields
            .map((f) => format("site_template_settings.%I", f))
            .join()
        : "site_template_settings.*";

      if (includedResources && includedResources.includes("schemas")) {
        fieldsQuery += ", json_schemas.json_schema, json_schemas.ui_schema ";
        joins +=
          " LEFT JOIN json_schemas ON site_template_settings.schema_id = json_schemas.id";
      }
    }
    let siteTemplateSettingsView = this.siteTemplateSettingsView(language);
    let sql = format(
      `SELECT %s FROM ${siteTemplateSettingsView} %s WHERE "language"= %L \n`,
      fieldsQuery,
      joins,
      language
    );
    if (filters.search) {
      sql += Helper.add_search_to_sql_query(
        filters.search,
        filters.searchKeys,
        `site_template_settings`
      );
    }

    if (sort.field && !aggregate.func) {
      sql +=
        format(
          "ORDER BY site_template_settings.%I %s",
          sort.field,
          sort.direction
        ) + "\n";
    }

    if (limit.count !== null || limit.start !== null) {
      sql += format("LIMIT %L OFFSET %L", limit.count, limit.start);
    }

    return sql;
  }

  public get_template_settings_by_title({
    options: {
      title,
      selectedFields,
      includedResources,
      language = DEFAULT_LANGUAGE,
    },
    client = db,
  }: method_payload<get_template_settings_by_title_payload>) {
    let fieldsQuery = selectedFields
      ? selectedFields
          .map((f: string) => format("site_template_settings.%I", f))
          .join()
      : "site_template_settings.*";

    let joins: string = "";

    if (includedResources && includedResources.includes("schemas")) {
      fieldsQuery += ", json_schemas.json_schema, json_schemas.ui_schema ";
      joins +=
        " LEFT JOIN json_schemas ON site_template_settings.schema_id = json_schemas.id";
    }
    let siteTemplateSettingsView = this.siteTemplateSettingsView(language);
    const sql = `
              SELECT ${fieldsQuery}
              FROM
                ${siteTemplateSettingsView}
                ${joins}
              WHERE site_template_settings.title = $1;
        `;

    return client.query(sql, [title]).then((res) => res.rows[0]);
  }

  public siteTemplateSettingsView(language: string) {
    return format(
      `(SELECT templates.title, templates.header, templates.footer, templates.preview, templates.configuration_form,  templates.custom_site_template, templates.schema_id,
        coalesce(template_settings.settings_object, '{}'::jsonb) as settings_object, coalesce(template_settings.language, %L) as language
        FROM templates     
        full JOIN template_settings on templates.title = template_settings.template and template_settings."language" = %L)
        as site_template_settings
      join active_languages on site_template_settings."language" = active_languages.cutback`,
      language,
      language
    );
  }

  public async update_template_settings({
    options: { settings_object, template, language = DEFAULT_LANGUAGE },
    client = db,
  }: method_payload<update_template_settings_payload>) {
    const updateNews = `select update_template_settings($1, $2, $3);`;
    await client.query(updateNews, [settings_object, template, language]);

    return {};
  }
}

export const SiteTemplateSettings = new Api();
