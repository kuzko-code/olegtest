import { db } from "../../db";
import { method_payload } from "../base_api_image";
import {
  create_user_payload,
  get_users_payload,
  get_user_by_id_payload,
  update_user_payload,
  delete_user_payload,
} from "./types";
import crypto from "crypto";
import { EMAIL_PATTERNS } from "../../constants";
import { private_key } from "../../config";
import { sendMail } from "../../handlers/email";
import format from "pg-format";
import randomize from "randomatic";
import { site_settings } from "../../features/settings/index";
import { DEFAULT_LANGUAGE } from "../../constants";
import { EXCEPTION_MESSAGES } from "../../constants";

class Api {
  private async sendWelcomeMessage(
    email: string,
    user: any,
    password: string,
    language: string
  ) {
    let siteName;
    try {
      let layout = await site_settings.get_site_name(language);
      siteName = layout.siteName;
    } catch {}

    const i18n = require("i18n");
    i18n.setLocale(language);
    let html = `<div style="color: #585F73; font-weight:600">${i18n.__(
      "dear"
    )} ${user.username}, 
        ${i18n.__("emailTextForCreateUser")}:<br /></div>
        <div style="color: #585F73">
        ${i18n.__("login")}: ${user.email}<br />
        ${i18n.__("password")}: ${password}</div>`;

    let info = await sendMail({
      from: siteName ? siteName + "<foo@example.com>" : EMAIL_PATTERNS.SENDER,
      to: email,
      subject: i18n.__("Welcome to system"),
      text: i18n.__("Welcome to system"),
      html: format(html),
    });
    return info;
  }

  public async create_user({
    options: {
      email,
      role,
      username,
      groups,
      ctx,
      language = DEFAULT_LANGUAGE,
    },
    client = db,
  }: method_payload<create_user_payload>) {
    const createUser = `
            INSERT INTO users
            (role, email, password, username)
            VALUES($1, $2, $3, $4)
            RETURNING *;
        `;

    const randomPassword = randomize("Aa0!", 10);
    const passwordHash = crypto
      .createHmac("sha256", private_key)
      .update(randomPassword)
      .digest("hex");

    let res = await client.query(createUser, [
      role,
      email,
      passwordHash,
      username,
    ]);
    let result = res.rows[0];

    if (ctx.role != "root_admin" && ctx.role != "global_admin" && groups) {
      const getUserGroups = `SELECT group_id FROM user_groups where user_id = $1`;
      const resUserGroups = await client.query(getUserGroups, [ctx.userId]);

      groups = groups.filter(function (x) {
        if (resUserGroups.rows.map((r) => r.group_id).indexOf(x) != -1)
          return true;
        else return false;
      });
    }

    if (groups && groups.length > 0) {
      const values = groups
        .map((s) => format("(%s, %s)", s, res.rows[0].id))
        .join(",");

      const addUserGroups = `
            INSERT INTO user_groups(group_id, user_id)
                SELECT val.id, val.user_id
                FROM (VALUES ${values}) val (id, user_id)
                join groups USING (id)
            ON CONFLICT ON CONSTRAINT user_groups_pk DO NOTHING
            returning group_id
            `;
      const userGroups = await client.query(addUserGroups);
      result = Object.assign(res.rows[0], {
        userGroups: userGroups.rows.map((e) => e.group_id),
      });
    }

    await this.sendWelcomeMessage(email, res.rows[0], randomPassword, language);
    return result;
  }

  public async get_users({
    options: { includedResources, selectedFields, ctx },
    client = db,
  }: method_payload<get_users_payload>) {
    let fieldsQuery;
    let joins = "";
    let where =
      ctx.role === "global_admin" || ctx.role === "root_admin"
        ? "true"
        : format(
            ` user_groups.group_id IN (select group_id from user_groups where user_groups.user_id = %L) AND USERS.role = 'content_admin'\n`,
            ctx.userId
          );

    fieldsQuery = selectedFields
      ? selectedFields.map((f) => format(`USERS.%I`, f)).join()
      : `USERS.*`;

    if (includedResources && includedResources.includes("groups")) {
      fieldsQuery += `, users.id as user_id, groups.id as groups_id, groups.name as groups_name`;
      joins += `left JOIN user_groups ON users.id = user_groups.user_id left join groups on groups.id = user_groups.group_id`;
    }

    let sql = format(
      `SELECT %s FROM USERS %s WHERE %s \n`,
      fieldsQuery,
      joins,
      where
    );

    const res = await client.query(sql);

    if (includedResources && includedResources.includes("groups")) {
      let groupByUser = res.rows.reduce(
        (objectsByKeyValue, obj) => ({
          ...objectsByKeyValue,
          [obj["user_id"]]: (objectsByKeyValue[obj["user_id"]] || []).concat(
            obj
          ),
        }),
        {}
      );
      let result: any[] = [];
      Object.keys(groupByUser).forEach(function (key) {
        let value = groupByUser[key];

        let groups: any[] = [];
        value.map((val: any) => {
          if (val.groups_id)
            groups.push({ id: val.groups_id, name: val.groups_name });
        });

        let temp = value[0];
        delete temp.groups_name;
        delete temp.groups_id;
        delete temp.suser_id;

        result.push(Object.assign(temp, { groups: groups }));
      });
      return result;
    }

    return res.rows;
  }

  public async get_user_by_id({
    options: { id },
    client = db,
  }: method_payload<get_user_by_id_payload>) {
    const getUser = `
            SELECT * FROM USERS
            WHERE id = $1
        `;

    const res = await client.query(getUser, [id]);
    if (!res.rows[0])
      throw new Error(EXCEPTION_MESSAGES.ON_USER_IS_NOT_DEFINED);
    return res.rows[0];
  }

  public async get_user_includes_permissions(
    permissions: string,
    role: string[],
    client = db
  ) {
    const getUser = format(
      `
        select users.email, users.username from user_groups join (
            select * from (select json_array_elements(groups.permission)::varchar as permission, id  from groups) as allowed_groups
            where allowed_groups.permission = '%I') as groups
            on user_groups.group_id = groups.id join users on user_groups.user_id = users.id where role in (%L)
        `,
      permissions,
      role
    );

    const res = await client.query(getUser);
    return res.rows;
  }

  public async update_user({
    options: { id, role, email, is_active, username, groups, ctx },
    client = db,
  }: method_payload<update_user_payload>) {
    let updatingFields: string[] = [];

    if (role) {
      updatingFields.push(format("role = %L", role));
    }

    if (email) {
      updatingFields.push(format("email = %L", email));
    }

    if (is_active !== undefined) {
      updatingFields.push(format("is_active = %L", is_active));
    }

    if (username) {
      updatingFields.push(format("username = %L", username));
    }
    let result = {};

    if (groups && groups.length > 0) {
      const values = groups.map((s) => format("(%s, %s)", s, id)).join(",");

      const addUserGroups = `
            delete from user_groups where user_id = ${id};
            INSERT INTO user_groups(group_id, user_id)
                SELECT val.id, val.user_id
                FROM (VALUES ${values}) val (id, user_id)
                join groups USING (id)
            ON CONFLICT ON CONSTRAINT user_groups_pk DO NOTHING
            returning group_id;`;

      const userGroups = await client.query(addUserGroups);
      result = {
        userGroups: Object.assign({ userGroups }).userGroups[1].rows.map(
          (tmp: any) => tmp.group_id
        ),
      };
    }
    if (groups && groups.length === 0) {
      const addUserGroups = `delete from user_groups where user_id = ${id};`;
      await client.query(addUserGroups);
    }

    if (!updatingFields.length) {
      return;
    }
    const updateUser = `
        UPDATE users
        SET ${updatingFields.join(",")}
        WHERE id = $1
        `;
    const res = await client.query(updateUser, [id]);
    return { id, ...result };
  }

  public async get_user_groups(id: number, client = db) {
    const getUserGroups = `SELECT group_id FROM user_groups where user_id = $1`;
    const resUserGroups = await client.query(getUserGroups, [id]);
    let groupsCurrentUser = resUserGroups.rows.map((r) => r.group_id);

    return groupsCurrentUser;
  }

  public async delete_user({
    options: { id },
    client = db,
  }: method_payload<delete_user_payload>) {
    const deleteUser = `
            DELETE FROM USERS
            WHERE id = $1
        `;

    const res = await client.query(deleteUser, [id]);
    return {};
  }

  public async checkIfUserHaveCorrectPermission(
    id: number,
    substance: string,
    role: string,
    client = db
  ) {
    if (role === "root_admin" || role === "global_admin") return true;
    const res = await this.getPermissionList(id, client);
    if (!res.map((e) => e.list).includes(substance)) {
      return false;
    }
    return true;
  }

  public async checkIfUserHavePermissionToAccess(
    id: number,
    substance: string,
    role: string,
    client = db
  ) {
    const permissionToAccess = await this.checkIfUserHaveCorrectPermission(
      id,
      substance,
      role,
      client
    );
    if (!permissionToAccess) {
      let err = new Error(EXCEPTION_MESSAGES.ON_ACCESS_DENIED_EXCEPTION);
      err.statusCode = 401;
      throw err;
    }
  }

  public async checkIfUserHavePermissionForSettings(
    id: number,
    substance: string[],
    role: string,
    client = db
  ) {
    if (role === "root_admin" || role === "global_admin") return true;
    if (substance.length < 1) {
      let err = new Error(EXCEPTION_MESSAGES.ON_ACCESS_DENIED_EXCEPTION);
      err.statusCode = 401;
      throw err;
    }
    const res = await this.getPermissionList(id, client);
    substance.map((sub) => {
      if (!res.map((e) => e.list).includes(sub)) {
        let err = new Error(EXCEPTION_MESSAGES.ON_ACCESS_DENIED_EXCEPTION);
        err.statusCode = 401;
        throw err;
      }
    });
  }

  public async getPermissionList(id: number, client = db) {
    const permissionList = `
            select json_array_elements(groups.permission) list FROM groups    
            join user_groups on groups.id = user_groups.group_id where user_groups.user_id = $1
            `;

    return await client.query(permissionList, [id]).then((res) => res.rows);
  }

  public async usersVelongToOneGroup(
    id: number,
    deletedId: number,
    client = db
  ) {
    const usersVelongToOneGroup = `
        select * from
        (
         select * from groups join user_groups on groups.id = user_groups.group_id
         where user_groups.user_id = $1
        ) tbl1
        join (
          select * from groups join user_groups on groups.id = user_groups.group_id
          where user_groups.user_id = $2
        ) tbl2
        on tbl1.id = tbl2.id
            `;

    const res = await client.query(usersVelongToOneGroup, [id, deletedId]);

    if (res.rowCount != 0) return true;
    return false;
  }
}

export const Users = new Api();
