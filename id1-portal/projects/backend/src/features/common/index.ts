import { db } from '../../db';
import { DEFAULT_LANGUAGE } from '../../constants';
import { method_payload } from '../../features/base_api_image';
import format from 'pg-format';
import {
	get_item_by_id_payload,
	delete_item_by_id_payload
} from './types';

class Api {

	public get_item_by_id({
		options: { id, selectedFields, table },
		client = db
	}: method_payload<get_item_by_id_payload>) {
		let fieldsQuery = selectedFields
			? selectedFields.map((f: string) => format(`${table}.%I`, f)).join()
			: '"plugins.store.product_categories".*';

		const sql = `
              SELECT ${fieldsQuery}
              FROM ${table}
              WHERE ${table}.id = $1
        `;

		return client.query(sql, [id]).then((res: any) => res.rows[0]);
	}

	public async delete_item_by_id({
		options: { id, table },
		client = db
	}: method_payload<delete_item_by_id_payload>) {
		const sql = `
              DELETE FROM ${table}
              WHERE id = $1`;
		return await (await client.query(sql, [id])).rows;
	}
}

export const FeaturesElementByID = new Api();