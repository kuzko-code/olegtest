import { IncomingMessage } from "http";
import { db } from "../../db";
import path from "path";
import fs from "fs";
import {
  attachment_payload,
  get_attachments_payload,
  get_attachment_by_id_payload,
  delete_attachment_by_id_payload,
  delete_attachments_by_ids_payload,
  save_attachment_payload,
} from "./types";
import uuidv4 from "uuid";
import format, { string } from "pg-format";
import { method_payload } from "../base_api_image";
import util from "util";
import Jimp from "jimp";
import { CONFIGURATIONS } from "../../config";
import { EXCEPTION_MESSAGES } from "../../constants/index";

class Api {
  public async save_attachment({
    options: { bodyFile, userId, imgWidth, imgHeight, imgQuality, content },
    client = db,
  }: method_payload<save_attachment_payload>) {
    const dir = CONFIGURATIONS.UPLOAD.LOCAL_PATH as string;
    const newUuid = uuidv4();
    const fileName = bodyFile.name;
    const mimeType = bodyFile.type;
    const newFileName = `${newUuid}_${fileName}`;
    const documents = content ? true : false;
    let sql: string;
    let oldPath = bodyFile.path;
    let expansion = path.extname(newFileName);

    if (fileName.length > 100) {
      let error = new Error(EXCEPTION_MESSAGES.ON_NAME_TOO_LONG);
      error.statusCode = 500;
      throw error;
    }

    if (expansion === ".jpg" || expansion === ".png" || expansion === ".jpeg") {
      let width: number = 500;
      let height: number = Jimp.AUTO;
      if (imgWidth || imgHeight) {
        width = imgWidth ? Number(imgWidth) : Jimp.AUTO;
        height = imgHeight ? Number(imgHeight) : Jimp.AUTO;
      }
      let quality = imgQuality ? Number(imgQuality) : 100;

      await Jimp.read(oldPath)
        .then((image) => {
          image.resize(width, height);
          image.quality(quality);
          image.write(path.join(dir, newFileName));
        })
        .catch((errorMessage) => {
          let err = new Error(errorMessage);
          err.statusCode = 500;
          throw err;
        });
    } else {
      await fs.copyFile(oldPath, path.join(dir, newFileName), function (err) {
        if (err) {
          let error = new Error(err.toString());
          error.statusCode = 500;
          throw error;
        }
      });
    }

    const sourceUrl = `${CONFIGURATIONS.UPLOAD.ATTACHMENT_URL}/${newFileName}`;
    if (documents) {
      sql = format(
        `
            INSERT INTO documents(id, storage_key, owner_id, mimetype, source_url, content)
            VALUES (%L, %L, %L, %L, %L, ARRAY[%L]::varchar[]) RETURNING id, storage_key, mimetype, source_url, content;
        `,
        newUuid,
        fileName,
        userId,
        mimeType,
        sourceUrl,
        content
      );
    } else {
      sql = format(
        `
            INSERT INTO attachments(id, storage_key, owner_id, mimetype, source_url)
            VALUES (%L, %L, %L, %L, %L) RETURNING id, storage_key, mimetype, source_url;
        `,
        newUuid,
        fileName,
        userId,
        mimeType,
        sourceUrl
      );
    }
    return client.query(sql).then((res: any) => res.rows[0]);
  }

  public async get_attachments({
    options,
    client = db,
  }: method_payload<get_attachments_payload>) {
    const getAttachments = this.build_query(options);

    const res = await client.query(getAttachments);

    if (options.aggregate.func) {
      return res.rows[0];
    } else {
      return res.rows;
    }
  }

  private build_query({
    selectedFields,
    aggregate,
    filters,
    sort,
    limit,
  }: get_attachments_payload): string {
    let fieldsQuery;

    if (aggregate.func) {
      const field = aggregate.field ? format.ident(aggregate.field) : "*";
      fieldsQuery = `${aggregate.func}(${field})`;
    } else {
      fieldsQuery = selectedFields
        ? selectedFields.map((f) => format("attachments.%I", f)).join()
        : "attachments.*";
    }

    let sql = `SELECT ${fieldsQuery} FROM attachments WHERE true\n`;

    if (filters.search) {
      sql +=
        "AND " +
        format(
          "attachments.storage_key ILIKE %L",
          "%%%" + filters.search + "%%"
        ) +
        "\n";
    }

    if (filters.author) {
      sql +=
        "AND " + format("attachments.owner_id = %L", filters.author) + "\n";
    }

    if (sort.field && !aggregate.func) {
      sql +=
        format("ORDER BY attachments.%I %s", sort.field, sort.direction) + "\n";
    }

    if (limit.count !== null || limit.start !== null) {
      sql += format("LIMIT %L OFFSET %L", limit.count, limit.start);
    }

    return sql;
  }

  public async get_attachment_by_id({
    options: { id, selectedFields },
    client = db,
  }: method_payload<get_attachment_by_id_payload>) {
    let fieldsQuery = selectedFields
      ? selectedFields.map((f) => format("attachments.%I", f)).join()
      : "attachments.*";

    const sql = `
              SELECT ${fieldsQuery}
              FROM attachments
              WHERE attachments.id = $1
        `;

    const res = await client.query(sql, [id]);
    return res.rows[0];
  }

  public async delete_attachment_by_id({
    options: { id },
    client = db,
  }: method_payload<delete_attachment_by_id_payload>) {
    const deleteAttachment = `
              DELETE FROM attachments
              WHERE id = $1
              RETURNING source_url
        `;

    const sourceUrl = (await client.query(deleteAttachment, [id])).rows[0]
      .source_url;
    if (sourceUrl != null) {
      await this.delete_attachment_from_filesystem(sourceUrl);
    }

    return {};
  }

  public async delete_attachment_from_filesystem(sourceUrl: string) {
    const fileName = sourceUrl.substring(sourceUrl.lastIndexOf("/") + 1);
    const dir = CONFIGURATIONS.UPLOAD.LOCAL_PATH as string;

    const deleteFile = util.promisify(fs.unlink);
    await deleteFile(path.join(dir, fileName));
  }

  public async delete_attachments_by_ids({
    options: { ids },
    client = db,
  }: method_payload<delete_attachments_by_ids_payload>) {
    if (ids && ids.length > 0) {
      const deleteAttachments = format(
        `
        DELETE
        FROM attachments
        WHERE id IN (%L) RETURNING source_url
      `,
        ids
      );

      const sourceUrls = (await client.query(deleteAttachments)).rows;

      sourceUrls
        .filter((row) => !!row.source_url)
        .forEach((row) =>
          this.delete_attachment_from_filesystem(row.source_url)
        );
    }
    return {};
  }

  public async delete_attachments(ids: string[]) {
    await this.delete_attachments_by_ids({ options: { ids: ids } });
  }
}

export const attachments = new Api();
