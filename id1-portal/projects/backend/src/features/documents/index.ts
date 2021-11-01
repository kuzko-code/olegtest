import { db } from "../../db";
import { method_payload } from "../base_api_image";
import {
  get_documents_payload,
  get_document_by_id_payload,
  update_documents_payload,
} from "./types";
import format from "pg-format";
import { Helper } from "../../helper";

class Api {
  public async update_document({
    options: { id, storage_key, content },
    client = db,
  }: method_payload<update_documents_payload>) {
    const sql = format(
      `
                UPDATE documents
                SET storage_key = %L, content = ARRAY[%L]::varchar[]
                WHERE id = %L`,
      storage_key,
      content,
      id
    );
    return await client.query(sql).then((res: any) => res.rows);
  }

  public async get_documents_search({
    options,
    client = db,
  }: method_payload<get_documents_payload>) {
    const getCatalog = this.build_query("documents.search", options);

    return client.query(getCatalog).then((res: any) => {
      if (options.aggregate.func) return res.rows[0];
      else return res.rows;
    });
  }

  public async get_document_by_id({
    options: { id, selectedFields },
    client = db,
  }: method_payload<get_document_by_id_payload>) {
    let fieldsQuery = selectedFields
      ? selectedFields.map((f) => format("documents.%I", f)).join()
      : "documents.*";

    const sql = `
              SELECT ${fieldsQuery}
              FROM documents
              WHERE documents.id = $1
        `;

    const res = await client.query(sql, [id]);
    return res.rows[0];
  }

  public async get_documents({
    options,
    client = db,
  }: method_payload<get_documents_payload>) {
    const getCatalog = this.build_query("documents", options);

    return client.query(getCatalog).then((res: any) => {
      if (options.aggregate.func) return res.rows[0];
      else return res.rows;
    });
  }

  private build_query(
    table: string,
    { filters, sort, limit, aggregate, selectedFields }: get_documents_payload
  ): string {
    let fieldsQuery;

    if (aggregate.func) {
      const field = aggregate.field ? format.ident(aggregate.field) : "*";
      fieldsQuery = `${aggregate.func}(${field})`;
    } else {
      fieldsQuery = selectedFields
        ? selectedFields.map((f) => format(`"%s".%I`, table, f)).join()
        : `*`;
    }
    let sql = format(
      `
                SELECT %s
                FROM "%s"
                WHERE true   `,
      fieldsQuery,
      table
    );

    if (filters.search) {
      sql += Helper.add_search_to_sql_query(
        filters.search,
        filters.searchKeys,
        `"${table}"`
      );
    }
    if (sort.field && !aggregate.func) {
      sql +=
        format(`ORDER BY "${table}".%I %s`, sort.field, sort.direction) + "\n";
    }
    if (limit.count !== null || limit.start !== null) {
      sql += format("LIMIT %L OFFSET %L", limit.count, limit.start);
    }

    return sql;
  }
}

export const Documents = new Api();
