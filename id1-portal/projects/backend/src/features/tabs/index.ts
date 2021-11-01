import { db } from "../../db";
import format from "pg-format";
import { DEFAULT_LANGUAGE } from "../../constants";
import { method_payload } from "../base_api_image";
import {
  get_tab_payload,
  create_tabs_payload,
  update_tabs_payload,
  get_tabs_payload,
  get_tabs_types_payload,
  delete_tabs_payload,
  get_banners_settings_payload,
  update_position_tabs_payload,
  get_preview_tabs_payload,
} from "./types";
import { Helper } from "../../helper";
import { PluginsInfo } from "../pluginsInfo";

class Api {
  public async update_tabs({
    options: { id, form_data },
    client = db,
  }: method_payload<update_tabs_payload>) {
    const sql = ` UPDATE tabs
                SET form_data  = $1 
                WHERE id = $2`;

    return client
      .query(sql, [JSON.stringify(form_data), id])
      .then((res) => res.rows);
  }

  public async update_tabs_position({
    options: { form_data, language = DEFAULT_LANGUAGE },
    client = db,
  }: method_payload<update_position_tabs_payload>) {
    if (!form_data) return;

    let locationOfBanners = await this.get_banners_settings({
      options: <any>{
        selectedFields: ["id", "enabled"],
        filters: {
          position: null,

          enabled: null,
        },
        language,
      },
    });

    if (!locationOfBanners) return;

    let tab_position: any = {};
    for (const [key, value] of Object.entries(form_data)) {
      let temp: any[] = [];
      if (!locationOfBanners[key]) continue;
      temp = form_data[key].filter((e: any) =>
        locationOfBanners[key].find((lOfB: any) => lOfB.id == e.id)
      );

      let result = temp.concat(
        locationOfBanners[key].filter((e: any) => {
          return temp.find((lOfB: any) => lOfB.id == e.id) ? false : true;
        })
      );
      tab_position = Object.assign(tab_position, { [key]: result });
    }

    const sql = `select update_tabs_position($1)`;

    return client.query(sql, [JSON.stringify(tab_position)]).then((res) => {});
  }

  public async get_preview_tabs({
    options: { language = DEFAULT_LANGUAGE },
    client = db,
  }: method_payload<get_preview_tabs_payload>) {
    let sqlLocationOfBanners = `
        SELECT settings_object
        FROM "site_settings"
        WHERE title = $1 AND (language = $2 or language is null)
    `;

    let locationOfBanners: any = await client
      .query(sqlLocationOfBanners, ["locationPreviewOfBanners", language])
      .then(({ rows }) => rows[0].settings_object);

    if (!locationOfBanners) return null;
    let banners: string[] = [`id = 0`];

    for (const [key, value] of Object.entries(locationOfBanners)) {
      locationOfBanners[key].map((banner: any) => {
        if (banner.enabled === true) {
          banners.push(`id = ${banner.id}`);
        }
      });
    }

    if (banners.length === 0) return locationOfBanners;
    let sqlFormDataBanners = `
            SELECT id, form_data, type_title
            FROM "tabs"
            WHERE (${banners.join(" or ")}) AND language = $1
        `;
    let formDataBanners: any = await client
      .query(sqlFormDataBanners, [language])
      .then(({ rows }) => {
        let result = {};

        Object.entries(locationOfBanners).forEach(([key, value]: any) => {
          let bar = [...value]
            .map((banner) => {
              if (banner.enabled === true) {
                let temp = rows.find((row) => row.id === banner.id);
                if (!temp) return;
                banner.form_data = temp ? temp.form_data : null;
                banner.type_title = temp.type_title;
                return banner;
              }
            })
            .filter((banner) => banner != null);

          if (bar.length > 0) result = Object.assign(result, { [key]: bar });
        });

        return result;
      });
    return formDataBanners;
  }

  public async get_tabs_types({
    options: { tab_position, includedResources },
    client = db,
  }: method_payload<get_tabs_types_payload>) {
    let fields: string = "tt.title, tt.tab_position::varchar[]";
    let joins: string = '"tabs_type" as "tt"';

    if (includedResources && includedResources.includes("schemas")) {
      fields +=
        ', js.json_schema as "json_schema", js.ui_schema as "ui_schema"';
      joins +=
        ' INNER JOIN "json_schemas" as "js" ON tt.tabs_schema_id = js.id';
    }

    let sql = format(`
      		SELECT ${fields}
      		FROM ${joins} 
    	`);

    if (tab_position != null) {
      sql += format("WHERE tab_position && '{");
      sql += tab_position.map((p) => format("%s", p)).join(",");
      sql += format("}'");
    }

    const res = await client.query(sql);

    if (includedResources && includedResources.includes("pluginsInfo")) {
      const pluginsTabs = await this.getPluginsTabInfo();

      for (let tabs of pluginsTabs) {
        for (let tab of tabs) {
          for (let resTab of res.rows) {
            if (resTab.title == tab.type) {
              resTab.translateName = tab.translateName;
              resTab.formTabSettings = tab.formTabSettings;
              resTab.viewOfTab = tab.viewOfTab;
              resTab.picture = tab.picture;
            }
          }
        }
      }
    }
    return res.rows;
  }

  private async getPluginsTabInfo() {
    let tabs: any[] = [];
    const plugins: any[] = await PluginsInfo.get_plugins({ options: {} });

    for (let plugin of plugins) {
      if (plugin.tabs) {
        tabs.push(plugin.tabs);
      }
    }
    return tabs;
  }

  public async get_banners_settings({
    options: { selectedFields, filters, language = DEFAULT_LANGUAGE },
    client = db,
  }: method_payload<get_banners_settings_payload>) {
    let fieldsQuery;

    if (selectedFields && !selectedFields.includes("position"))
      selectedFields.push("position");

    fieldsQuery = selectedFields
      ? selectedFields
          .map((f) => {
            return format(`"tabs".%I`, f);
          })
          .join()
      : `tabs.*`;

    let subSql = format(
      'select %s from tabs where "language"= %L ',
      fieldsQuery,
      language
    );

    if (filters.enabled != null) {
      subSql += "AND " + format(`tabs.enabled = (%L)`, filters.enabled) + "\n";
    }

    if (filters.position) {
      subSql +=
        "AND " + format(`tabs.position = (%L)`, filters.position) + "\n";
    }

    subSql += `order by index`;

    let sql = format(
      `SELECT json_object_agg(each.position, each.names) as result FROM (    
				SELECT position, array_agg(row_to_json(t)) as names FROM				
				(%s)			
				as t GROUP BY position 
				) AS each;`,
      subSql,
      language
    );

    return await client.query(sql).then(({ rows }) => rows[0].result);
  }

  public async get_tabs({
    options,
    client = db,
  }: method_payload<get_tabs_payload>) {
    const getTabs = this.build_query_for_getting_tabs(options);

    const res = await client.query(getTabs);

    if (options.aggregate.func) {
      return res.rows[0];
    } else {
      return res.rows;
    }
  }

  private build_query_for_getting_tabs({
    selectedFields,
    includedResources,
    aggregate,
    filters,
    language = DEFAULT_LANGUAGE,
  }: get_tabs_payload): string {
    let fieldsQuery;
    let joins = "";

    if (aggregate.func) {
      const field = aggregate.field ? format.ident(aggregate.field) : "*";
      fieldsQuery = `${aggregate.func}(${field})`;
    } else {
      fieldsQuery = selectedFields
        ? selectedFields
            .map((f) => {
              return format(`"tabs".%I`, f);
            })
            .join()
        : `"tabs".*`;

      if (includedResources && includedResources.includes("schemas")) {
        fieldsQuery += `
				, (SELECT js.json_schema as "json_schema"
					FROM tabs as t, tabs_type as tt, json_schemas as js
					WHERE t.id = tabs.id and t.type_title = tt.title and tt.tabs_schema_id = js.id)
			    , (SELECT js.ui_schema as "ui_schema"
					FROM tabs as t, tabs_type as tt, json_schemas as js
					WHERE t.id = tabs.id and t.type_title = tt.title and tt.tabs_schema_id = js.id)
				`;
      }
    }

    let sql = format(
      `SELECT %s
             FROM tabs %s
             WHERE tabs.language = %L   `,
      fieldsQuery,
      joins,
      language
    );

    if (filters.ids) {
      sql += "AND " + format(`tabs.id IN (%L)`, filters.ids) + "\n";
    }

    if (filters.enabled != null) {
      sql += "AND " + format(`tabs.enabled = (%L)`, filters.enabled) + "\n";
    }

    if (filters.position) {
      sql += "AND " + format(`tabs.position = (%L)`, filters.position) + "\n";
    }

    if (filters.search) {
      sql += Helper.add_search_to_sql_query(
        filters.search,
        filters.searchKeys,
        `tabs`
      );
    }

    return sql;
  }

  public async create_tabs({
    options: {
      form_data,
      type_title,
      enabled,
      position,
      language = DEFAULT_LANGUAGE,
    },
    client = db,
  }: method_payload<create_tabs_payload>) {
    let index = await this.get_index(position, language);

    const sql = `
        INSERT INTO public.tabs
        (form_data, type_title, enabled, position, index, language)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, type_title`;
    let newBanners = await client.query(sql, [
      form_data ? JSON.stringify(form_data) : null,
      type_title,
      enabled || false,
      position,
      index,
      language,
    ]);

    return newBanners.rows[0];
  }

  public async get_json_schema_by_tab_types(titleTabType: string, client = db) {
    let jsonSchema = await client.query(
      format(
        `SELECT json_schemas.json_schema FROM json_schemas 
				INNER JOIN tabs_type ON json_schemas.id = tabs_type.tabs_schema_id 
				INNER JOIN tabs ON tabs.type_title = tabs_type.title
				WHERE tabs_type.title = %s`,
        titleTabType
      )
    );

    return jsonSchema.rows[0] ? jsonSchema.rows[0].json_schema : "";
  }

  public async get_json_schema_by_tab_id(tab_id: number, client = db) {
    let jsonSchema = await client.query(
      format(
        `SELECT json_schemas.json_schema FROM json_schemas 
				INNER JOIN tabs_type ON json_schemas.id = tabs_type.tabs_schema_id 
				INNER JOIN tabs ON tabs.type_title = tabs_type.title
				WHERE tabs.id = %s`,
        tab_id
      )
    );

    return jsonSchema.rows[0] ? jsonSchema.rows[0].json_schema : "";
  }

  private async get_index(position: string, language: string, client = db) {
    let getMaxIndex = `SELECT MAX(index) FROM tabs where position=$1 and language=$2`;

    let maxIndex = await client
      .query(getMaxIndex, [position, language])
      .then((res) => res.rows[0]);
    return maxIndex.max || maxIndex.max == 0 ? parseInt(maxIndex.max) + 1 : 0;
  }

  public async get_tab_by_id({
    options: { id, selectedFields, includedResources },
    client = db,
  }: method_payload<get_tab_payload>) {
    let fieldsQuery;
    let joins = "";

    fieldsQuery = selectedFields
      ? selectedFields
          .map((f) => {
            return format(`"tabs".%I`, f);
          })
          .join()
      : `"tabs".*`;

    if (includedResources && includedResources.includes("type")) {
      fieldsQuery += `
				, (SELECT (json_build_object(  'title', tt.title, 'positions', tt.tab_position))
					FROM tabs as t, tabs_type as tt
					WHERE t.id = tabs.id and t.type_title = tt.title) as "type"
				`;
    }

    if (includedResources && includedResources.includes("schemas")) {
      fieldsQuery += `
				, (SELECT js.json_schema as "json_schema"
					FROM tabs as t, tabs_type as tt, json_schemas as js
					WHERE t.id = tabs.id and t.type_title = tt.title and tt.tabs_schema_id = js.id)
			    , (SELECT js.ui_schema as "ui_schema"
					FROM tabs as t, tabs_type as tt, json_schemas as js
					WHERE t.id = tabs.id and t.type_title = tt.title and tt.tabs_schema_id = js.id)
				`;
    }

    let sql = format(
      `SELECT %s
             FROM tabs %s
             WHERE tabs.id = %L `,
      fieldsQuery,
      joins,
      id
    );

    return await client.query(sql).then(({ rows }) => rows[0]);
  }

  public async delete_tab_by_ids({
    options: { ids },
    client = db,
  }: method_payload<delete_tabs_payload>) {
    let sql = format(`
            DELETE
            FROM tabs
            WHERE id IN (`);
    sql += ids.map((t: any) => format("%L", t)).join(",");
    sql += format(")");

    return client.query(sql).then((res) => {
      return {};
    });
  }

  public async validate_tab_position(
    title: string,
    tab_position: string,
    client = db
  ) {
    let sql = format(
      `SELECT 1 FROM tabs_type WHERE title = %L AND tab_position && '{%s}'`,
      title,
      tab_position
    );

    let result = await client.query(sql);

    if (result.rowCount != 0) return true;
    return false;
  }
}

export const tabsAPI = new Api();
