import { db } from "../../db";
import { method_payload } from "../base_api_image";
import format from "pg-format";
import {
  create_group_payload,
  get_groups_payload,
  get_group_by_id_payload,
  update_group_payload,
  delete_group_by_id_payload,
  added_user_to_group_payload,
} from "./types";
import { PluginsInfo } from "../../features/pluginsInfo";

class Api {
  public async create_group({
    options: { name, permission },
    client = db,
  }: method_payload<create_group_payload>) {
    const creategroup = `
              INSERT INTO groups
              (name, permission)
              VALUES($1, $2)
              RETURNING id;`;

    return client
      .query(creategroup, [name, JSON.stringify(permission ? permission : [])])
      .then((res) => res.rows[0]);
  }

  public async added_users_to_group({
    options: { group_id, users_id },
    client = db,
  }: method_payload<added_user_to_group_payload>) {
    const values = users_id
      .map((s) => format("(%L, %L)", group_id, s))
      .join(",");

    const sql = `
            INSERT INTO user_groups
            (group_id, user_id)
            VALUES ${values} ON CONFLICT ON CONSTRAINT user_groups_pk 
            DO NOTHING;`;

    return client.query(sql).then((res) => res.rows[0]);
  }

  public get_groups({
    options,
    client = db,
  }: method_payload<get_groups_payload>) {
    const getgroups = this.build_query(options);

    return client.query(getgroups).then((res) => {
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
    ctx,
  }: get_groups_payload): string {
    let fieldsQuery;
    let joins = "";
    let where = "true";

    if (aggregate.func) {
      const field = aggregate.field ? format.ident(aggregate.field) : "*";
      fieldsQuery = `${aggregate.func}(${field})`;
    } else {
      fieldsQuery = selectedFields
        ? selectedFields.map((f) => format("groups.%I", f)).join()
        : "groups.*";
    }

    if (ctx.role != "root_admin" && ctx.role != "global_admin") {
      {
        joins += `JOIN user_groups ON groups.id = user_groups.group_id`;
        where = format(`user_groups.user_id = %L`, ctx.userId);
      }
    }

    let sql = format(
      `SELECT %s FROM groups %s WHERE %s \n`,
      fieldsQuery,
      joins,
      where
    );

    if (filters.search) {
      sql +=
        "AND " +
        format("groups.name ILIKE %L", "%%%" + filters.search + "%%") +
        "\n";
    }

    if (sort.field && !aggregate.func) {
      sql += format("ORDER BY groups.%I %s", sort.field, sort.direction) + "\n";
    }

    if (limit.count !== null || limit.start !== null) {
      sql += format("LIMIT %L OFFSET %L", limit.count, limit.start);
    }

    return sql;
  }

  public async get_group_by_id({
    options: { id, selectedFields },
    client = db,
  }: method_payload<get_group_by_id_payload>) {
    let fieldsQuery = selectedFields
      ? selectedFields.map((f) => format("groups.%I", f)).join()
      : "groups.*";

    const sql = `
              SELECT ${fieldsQuery}
              FROM groups
              WHERE groups.id = $1
        `;

    let result = await client.query(sql, [id]).then((res) => res.rows[0]); //.then(permission => usersPermissions = permission.rows[0].permission);//(r => usersPermissions = [...usersPermissions, ...r.permission]));

    if (!selectedFields || selectedFields.includes("permission")) {
      let sqlAdminNavigation = `
                SELECT settings_object
                FROM "site_settings"
                WHERE title = $1 AND language is null
            `;
      let pluginMenu = await PluginsInfo.getAdminMenuForPlugin();

      let adminNavigation: any[] = await client
        .query(sqlAdminNavigation, ["adminNavigation"])
        .then(({ rows }) => rows[0].settings_object);
      let usersPermissions: string[] = result.permission;

      let tempAdminNavigationWidth: any[] = [
        ...adminNavigation.filter(function (menyItem: any) {
          if (menyItem.permission == "settings") {
            menyItem.content = menyItem.content.filter(function (
              itemContent: any
            ) {
              return itemContent.permission != "users";
            });
            return menyItem;
          } else if (menyItem.permission == "plugins") {
            return;
          }
          return menyItem;
        }),
        ...pluginMenu,
      ];

      let s = tempAdminNavigationWidth.map((item) => {
        let content: any[] = [];
        if (item.content) {
          content = item.content.map(function (itemContent: any) {
            if (usersPermissions.includes(itemContent.permission)) {
              itemContent.enable = true;
            } else {
              itemContent.enable = false;
            }
            return itemContent;
          });
        }

        if (content.length > 0) {
          item.content = content;
        }
        if (usersPermissions.includes(item.permission)) {
          item.enable = true;
        } else {
          item.enable = false;
        }
        return item;
      });
      result.permission = s;
    }

    return result;
  }

  public async update_group({
    options: { id, name, permission, ctx },
    client = db,
  }: method_payload<update_group_payload>) {
    let tempPermission = "";
    if (ctx.role != "group_admin") {
      tempPermission = format(
        `, permission = %L`,
        JSON.stringify(permission ? permission : [])
      );
    }

    const sql = format(
      `UPDATE groups SET name = %L %s WHERE id = %L`,
      name,
      tempPermission,
      id
    );

    return client.query(sql).then((res) => {
      return {};
    });
  }

  public async containsUserInGroup(id: number, userId: number, client = db) {
    const containsTag = `SELECT 1 FROM user_groups WHERE group_id = $1 AND user_id = $2`;
    let result = await client.query(containsTag, [id, userId]);

    if (result.rowCount != 0) return true;
  }

  public async delete_group_by_id({
    options: { id },
    client = db,
  }: method_payload<delete_group_by_id_payload>) {
    const sql = `
              DELETE FROM groups
              WHERE id = $1`;

    return client.query(sql, [id]).then(() => {
      return {};
    });
  }
}

export const Groups = new Api();
