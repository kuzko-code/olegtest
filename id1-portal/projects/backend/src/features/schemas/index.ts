import { db } from '../../db';
import format from 'pg-format';

import { method_payload } from '../base_api_image';
import { create_tabs_schema_payload, get_or_delete_tabs_schema_payload, update_tabs_schema_payload } from './types';

class Api {
	public async get_tabs_schema({ options: { ids }, client = db }: method_payload<get_or_delete_tabs_schema_payload>) {
		let sql = format('SELECT id, json_schema, ui_schema FROM json_schemas');

		if (ids) {
			sql += format(` WHERE id IN (%L)`, ids) + '\n';
		}

		const res = await client.query(sql);
		return res.rows;
	}

	public async create_tabs_schema({
		options: { json_schema, ui_schema },
		client = db
	}: method_payload<create_tabs_schema_payload>) {
		const sql = `
            INSERT INTO json_schemas
                (json_schema, ui_schema)
            VALUES ($1, $2) RETURNING id;
        `;

		const res = await client.query(sql, [JSON.stringify(json_schema), JSON.stringify(ui_schema)]);
		return res.rows[0].id;
	}

	public async update_tabs_schema({
		options: { id, json_schema, ui_schema },
		client = db
	}: method_payload<update_tabs_schema_payload>) {
		const sql = `
            UPDATE json_schemas
            SET json_schema = $1,
                ui_schema   = $2
            WHERE id = $3;`;

		const res = await client.query(sql, [JSON.stringify(json_schema), JSON.stringify(ui_schema), id]);
		return res.rows;
	}

	public async delete_tabs_schema({
		options: { ids },
		client = db
	}: method_payload<get_or_delete_tabs_schema_payload>) {
		let sql = format(
			`DELETE
                          FROM json_schema
                          WHERE id IN (%L)`,
			ids
		);

		const res = await client.query(sql);
		return res.rows;
	}
}

export const tabsSchemaApi = new Api();
