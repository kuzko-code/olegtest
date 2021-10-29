import { db } from "../../db";
import {
  get_or_delete_settings_payload,
  get_settings_by_title_payload,
  create_settings_payload,
  update_settings_payload,
  get_admin_navigation_payload,
  get_banners_include_form_data,
} from "./types";
import { method_payload } from "../base_api_image";
import format from "pg-format";
import { DEFAULT_LANGUAGE } from "../../constants";
import { PluginsInfo } from "../../features/pluginsInfo";

class Api {
  public async get_admin_navigation({
    options: { ctx },
    client = db,
  }: method_payload<get_admin_navigation_payload>) {
    let sqlAdminNavigation = `
            SELECT settings_object
            FROM "site_settings"
            WHERE title = $1 AND language is null
        `;
    var pluginMenu = await PluginsInfo.getAdminMenuForPlugin();

    var adminNavigation: any[] = await client
      .query(sqlAdminNavigation, ["adminNavigation"])
      .then(({ rows }) => rows[0].settings_object);

    let getPermission = `SELECT groups.permission
                             FROM groups
                                      join user_groups on groups.id = user_groups.group_id
                             where user_groups.user_id = $1;`;
    var usersPermissions: string[] = [];
    var userCountGroups = 0;

    await client.query(getPermission, [ctx.userId]).then((permission) => {
      userCountGroups = permission.rowCount;
      permission.rows.map(
        (r) => (usersPermissions = [...usersPermissions, ...r.permission])
      );
    });

    var adminNavigationWidth: any[] = [];

    if (
      ctx.role === "group_admin" &&
      !usersPermissions.includes("users") &&
      userCountGroups != 0
    )
      usersPermissions.push("users");
    if (ctx.role === "content_admin" && usersPermissions.includes("users"))
      usersPermissions = usersPermissions.filter((e) => e != "users");

    if (!(ctx.role === "global_admin" || ctx.role === "root_admin")) {
      var tempAdminNavigationWidth = [
        ...adminNavigation.filter(function (meanyItem: any) {
          return meanyItem.permission != "plugins";
        }),
        ...pluginMenu,
      ];

      tempAdminNavigationWidth.map((itemAdminNavigation) => {
        var contentItems = [];

        if (itemAdminNavigation.content) {
          contentItems = itemAdminNavigation.content.filter(function (
            itemContent: any
          ) {
            return usersPermissions.includes(itemContent.permission);
          });
        }
        if (
          usersPermissions.includes(itemAdminNavigation.permission) ||
          (contentItems && contentItems.length > 0)
        ) {
          itemAdminNavigation.content = contentItems;
          adminNavigationWidth.push(itemAdminNavigation);
        }
      });
    } else {
      adminNavigationWidth = [...adminNavigation, ...pluginMenu];
    }

    return adminNavigationWidth;
  }

  public async get_banners_include_form_data({
    options: { title, includedResources, language = DEFAULT_LANGUAGE },
    client = db,
  }: method_payload<get_banners_include_form_data>) {
    let sqlLocationOfBanners = `
            SELECT settings_object
            FROM "site_settings"
            WHERE title = $1
              AND (language = $2 or language is null)
        `;

    var locationOfBanners: any = await client
      .query(sqlLocationOfBanners, [title, language])
      .then(({ rows }) => rows[0].settings_object);
    var banners: string[] = [];
    if (!locationOfBanners) return null;

    [
      ...locationOfBanners.topBar,
      ...locationOfBanners.leftBar,
      ...locationOfBanners.rightBar,
      ...locationOfBanners.bottomBar,
    ].map((banner) => {
      if (banner.enabled === true) {
        banners.push(`id = '${banner.tab_id}'`);
      }
    });

    if (banners.length === 0) return locationOfBanners;

    let fields: string = "t.id";
    let joins: string = '"tabs" as "t"';
    if (includedResources && includedResources.includes("formData")) {
      fields += ", t.form_data";
    }
    if (includedResources && includedResources.includes("type")) {
      fields += ', tt.title as "type_title", tt.tab_position as "position"';
      joins += ' INNER JOIN "tabs_type" as "tt" ON t.type_title = tt.title';
    }

    let sqlFormDataBanners = `
            SELECT ${fields}
            FROM ${joins}
            WHERE (${banners.join(" or ")})
        `;

    var formDataBanners: any = await client
      .query(sqlFormDataBanners)
      .then(({ rows }) => {
        var result = {};

        Object.entries(locationOfBanners).forEach(([key, value]: any) => {
          var bar = [...value].map((banner) => {
            if (banner.enabled === true) {
              var temp = rows.find((row) => row.id === banner.tab_id);
              banner.form_data = temp ? temp.form_data : null;
              banner.type_title = temp ? temp.type_title : null;
              banner.picture = temp ? temp.picture : null;
              banner.position = temp ? temp.position : null;
            } else {
              banner.form_data = null;
            }
            return banner;
          });

          result = Object.assign(result, { [key]: bar });
        });

        return result;
      });
    return formDataBanners;
  }

  public get_site_name(language = DEFAULT_LANGUAGE, client = db) {
    let sql = `
            SELECT settings_object
            FROM "site_settings"
            WHERE title = 'layout'
              AND (language = $1)
        `;

    return client
      .query(sql, [language])
      .then(({ rows }) => rows[0].settings_object);
  }

  //TODO to delete after update plugins
  public get_site_neme(language = DEFAULT_LANGUAGE, client = db) {
    let sql = `
            SELECT settings_object
            FROM "site_settings"
            WHERE title = 'layout'
              AND (language = $1)
        `;

    return client
      .query(sql, [language])
      .then(({ rows }) => rows[0].settings_object);
  }

  public get_site_settings({
    options: { titles, language = DEFAULT_LANGUAGE },
    client = db,
  }: method_payload<get_or_delete_settings_payload>) {
    let sql = format(
      `
                SELECT ss.title, ss.settings_object, js.json_schema as "settings_schema", js.ui_schema, ss.language
                FROM site_settings as "ss"
                         INNER JOIN json_schemas as "js" ON ss.json_schema_id = js.id
                WHERE (language = %L or language is null)
            `,
      language
    );

    if (titles) {
      sql += format("AND title IN (%L)", titles);
    }

    return client.query(sql).then(({ rows }) => rows);
  }

  public get_site_settings_by_title({
    options: { title, language = DEFAULT_LANGUAGE },
    client = db,
  }: method_payload<get_settings_by_title_payload>) {
    let sql = `
            SELECT ss.settings_object, js.json_schema as "settings_schema", js.ui_schema
            FROM site_settings as "ss"
            LEFT JOIN json_schemas as "js" ON ss.json_schema_id = js.id
            WHERE title = $1
              AND (language = $2 or language is null)
        `;

    return client.query(sql, [title, language]).then(({ rows }) => rows[0]);
  }

  public create_site_settings({
    options: { settings, language = DEFAULT_LANGUAGE },
    client = db,
  }: method_payload<create_settings_payload>) {
    const values = settings
      .map((s) =>
        format(
          "(%L, %L, %L, %L)",
          s.title,
          JSON.stringify(s.settings_object),
          s.settings_schema_id,
          language
        )
      )
      .join(",");

    const sql = `
            INSERT INTO public.site_settings
            (title, settings_object, json_schema_id, "language")
            VALUES ${values}`;

    return client.query(sql).then((res) => {
      return {};
    });
  }

  public async get_setting_schema_by_id({
    options: { settings, language = DEFAULT_LANGUAGE },
    client = db,
  }: method_payload<create_settings_payload>) {
    let sql = format(
      `
                SELECT js.json_schema as "settings_schema"
                FROM json_schemas as "js"
                WHERE js.id IN (%L)
            `,
      settings.map((s) => s.settings_schema_id)
    );

    return client.query(sql).then((res) => res.rows);
  }

  public update_site_settings({
    options: { settings, language = DEFAULT_LANGUAGE },
    client = db,
  }: method_payload<update_settings_payload>) {
    const values = settings
      .map((s) =>
        format(
          "(%L, cast(%L as json))",
          s.title,
          JSON.stringify(s.settings_object)
        )
      )
      .join(",");

    const sql = format(
      `
                UPDATE site_settings AS ss
                SET settings_object = v.settings_object FROM (VALUES %s) AS v(title, settings_object)
                WHERE v.title = ss.title AND (language = %L or language is null)`,
      values,
      language
    );

    return client.query(sql).then((res) => {
      return {};
    });
  }

  public async get_settings_schema({
    options: { settings, language = DEFAULT_LANGUAGE },
    client = db,
  }: method_payload<update_settings_payload>) {
    let sql = format(
      `
                SELECT ss.title, js.json_schema as "settings_schema"
                FROM site_settings as "ss"
                         INNER JOIN json_schemas as "js" ON ss.json_schema_id = js.id
                WHERE title IN (%L)
                  AND (language = %L or language is null)
            `,
      settings.map((s) => s.title),
      language
    );

    return client.query(sql).then((res) => res.rows);
  }

  public delete_site_settings({
    options: { titles, language = DEFAULT_LANGUAGE },
    client = db,
  }: method_payload<get_or_delete_settings_payload>) {
    let sql = format(
      `
                DELETE
                FROM "site_settings"
                WHERE title IN (%L)
                  AND (language = %L or language is null)
            `,
      titles,
      language
    );

    return client.query(sql).then((res) => {
      return {};
    });
  }
}

export const site_settings = new Api();
