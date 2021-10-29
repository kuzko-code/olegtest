import { db } from "../../db";
import { method_payload } from "../base_api_image";
import {
  create_visitor_payload,
  get_visitors_payload,
  get_visitor_by_id_payload,
  update_visitor_payload,
  delete_visitor_payload,
} from "./types";
import crypto from "crypto";
import { EMAIL_PATTERNS } from "../../constants";
import { private_key } from "../../config";
import { sendMail } from "../../handlers/email";
import format from "pg-format";
import randomize from "randomatic";
import { site_settings } from "../settings/index";
import { DEFAULT_LANGUAGE } from "../../constants";
import { EXCEPTION_MESSAGES, AUTH } from "../../constants";
import { Helper } from "../../helper";
import { Auth } from "../../helper/auth";

class Api {
  public async create_visitor({
    options: {
      email,
      password,
      first_name,
      last_name,
      patronymic,
      language = DEFAULT_LANGUAGE,
    },
    client = db,
  }: method_payload<create_visitor_payload>) {
    const nowDate = new Date(Date.now());
    const deleteVisitor = `
         DELETE FROM public.visitors USING pg_class p
         WHERE is_active=false AND email=$1 AND p.relname='visitors';
      `;

    const createVisitor = `
          INSERT INTO public.visitors
          ("role", email, "password", is_active, first_name, last_name, patronymic, confirmation_password, code_updated)
          VALUES('visitor', $1, $2, false, $3, $4, $5, $6, $7)
          RETURNING *;
      `;

    const passwordHash = crypto
      .createHmac("sha256", private_key)
      .update(password)
      .digest("hex");
    const code = Auth.generateCode();

    await client.query(deleteVisitor, [email]);

    let result = await client
      .query(createVisitor, [
        email,
        passwordHash,
        first_name,
        last_name,
        patronymic,
        code,
        nowDate,
      ])
      .then((e) => e.rows[0]);

    await Auth.sendMessageWithCode(email, code.toString(), language);
    return result.id;
  }

  public async get_visitors({
    options: { selectedFields, filters, limit, sort, aggregate, ctx },
    client = db,
  }: method_payload<get_visitors_payload>) {
    let fieldsQuery;

    if (aggregate.func) {
      fieldsQuery = `${aggregate.func}(${
        aggregate.field ? format.ident(aggregate.field) : "*"
      })`;
    } else {
      fieldsQuery = selectedFields
        ? selectedFields.map((f) => format(`visitors.%I`, f)).join()
        : `visitors.*`;
    }

    let sql = format(`SELECT %s FROM visitors WHERE true\n`, fieldsQuery);

    if (filters.ids) {
      sql += "AND " + format("visitors.id IN (%L)", filters.ids) + "\n";
    }
    if (filters.search) {
      sql += Helper.add_search_to_sql_query(
        filters.search,
        filters.searchKeys,
        `visitors`
      );
    }

    if (filters.is_active !== null) {
      sql +=
        "AND " + format("visitors.is_active = %L", filters.is_active) + "\n";
    }

    if (sort.field && !aggregate.func) {
      sql +=
        format("ORDER BY visitors.%I %s ", sort.field, sort.direction) + "\n";
    }

    if (limit.count !== null || limit.start !== null) {
      sql += format("LIMIT %L OFFSET %L", limit.count, limit.start);
    }

    const res = await client.query(sql);
    if (aggregate.func) {
      return res.rows[0];
    } else {
      return res.rows;
    }
  }

  public async get_visitor_by_id({
    options: { id, selectedFields },
    client = db,
  }: method_payload<get_visitor_by_id_payload>) {
    let fieldsQuery = selectedFields
      ? selectedFields.map((f) => format(`visitors.%I`, f)).join()
      : "visitors.*";

    const getVisitor = `
            SELECT ${fieldsQuery} FROM visitors
            WHERE id = $1
        `;

    const res = await client.query(getVisitor, [id]);

    if (!res.rows[0])
      throw new Error(EXCEPTION_MESSAGES.ON_USER_IS_NOT_DEFINED);
    return res.rows[0];
  }

  public async update_visitor({
    options,
    client = db,
  }: method_payload<update_visitor_payload>) {
    let updatingFields: string[] = [];

    options.hasOwnProperty("first_name")
      ? updatingFields.push(format("first_name = %L", options.first_name))
      : null;
    options.hasOwnProperty("last_name")
      ? updatingFields.push(format("last_name = %L", options.last_name))
      : null;
    options.hasOwnProperty("patronymic")
      ? updatingFields.push(format("patronymic = %L", options.patronymic))
      : null;
    options.hasOwnProperty("phone")
      ? updatingFields.push(format("phone = %L", options.phone))
      : null;
    options.hasOwnProperty("birthday")
      ? updatingFields.push(format("birthday = %L", options.birthday))
      : null;

    if (!updatingFields.length) {
      return;
    }
    const updateVisitor = `
      UPDATE visitors
      SET ${updatingFields.join(",")}
      WHERE id = $1
      `;
    const res = await client.query(updateVisitor, [options.id]);
    return res.rows[0];
  }

  public async delete_visitor({
    options: { id },
    client = db,
  }: method_payload<delete_visitor_payload>) {
    const deleteVisitor = `
            DELETE FROM visitors
            WHERE id = $1
        `;
    const res = await client.query(deleteVisitor, [id]);
    return {};
  }
}

export const Visitors = new Api();
