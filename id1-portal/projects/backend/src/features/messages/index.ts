import { db } from '../../db';
import { method_payload } from '../base_api_image';
import format from 'pg-format';
import {
	create_message_payload,
	get_messages_payload,
	get_message_by_id_payload,
	update_message_payload,
	delete_message_by_id_payload
} from './types';

class Api {
	public async create_message({ options: { title, link }, client = db }: method_payload<create_message_payload>) {
		const createMessage = `
			INSERT INTO messages
			(title, link)
			VALUES($1, $2)
			RETURNING id;
        `;

		return client.query(createMessage, [title, link]).then((res) => res.rows[0]);
	}

	public async create_messages({ options, client = db }: method_payload<create_message_payload[]>) {
		const values = options.map((s) => format(`('%s', %L)`, s.title, s.link)).join(',');

		const createMessages = `
			INSERT INTO messages
			(title, link)
			VALUES ${values};
        `;

		return client.query(createMessages).then((res) => res.rows[0]);
	}

	public get_messages({ options, client = db }: method_payload<get_messages_payload>) {
		const getMessages = this.build_query(options);

		return client.query(getMessages).then((res) => {
			if (options.aggregate.func) return res.rows[0];
			else return res.rows;
		});
	}

	private build_query({ selectedFields, aggregate, sort, limit, filters }: get_messages_payload): string {
		let fieldsQuery;

		if (aggregate.func) {
			const field = aggregate.field ? format.ident(aggregate.field) : '*';
			fieldsQuery = `${aggregate.func}(${field})`;
		} else {
			fieldsQuery = selectedFields ? selectedFields.map((f) => format('messages.%I', f)).join() : 'messages.*';
		}

		let sql = format(`SELECT %s FROM messages WHERE true \n`, fieldsQuery);

		if (filters.isRead !== null) {
			sql += 'AND ' + format('messages.is_read = %L', filters.isRead) + '\n';
		}

		if (sort.field && !aggregate.func) {
			sql += format('ORDER BY messages.%I %s ', sort.field, sort.direction) + '\n';
		}

		if (limit.count !== null || limit.start !== null) {
			sql += format('LIMIT %L OFFSET %L ', limit.count, limit.start);
		}

		return sql;
	}

	public get_message_by_id({
		options: { id, selectedFields },
		client = db
	}: method_payload<get_message_by_id_payload>) {
		let fieldsQuery = selectedFields
			? selectedFields.map((f: any) => format('messages.%I', f)).join()
			: 'messages.*';

		const sql = `
              SELECT ${fieldsQuery}
              FROM messages
              WHERE messages.id = $1
        `;

		return client.query(sql, [id]).then((res) => res.rows[0]);
	}

	public async update_message({ options: { id, isRead }, client = db }: method_payload<update_message_payload>) {
		const sql = `
              UPDATE messages
              SET is_read = $1
              WHERE id = $2
        `;

		return client.query(sql, [isRead, id]).then((res) => {
			return {};
		});
	}

	public delete_message_by_id({ options: { id }, client = db }: method_payload<delete_message_by_id_payload>) {
		const sql = `
              DELETE FROM messages
              WHERE id = $1
        `;

		return client.query(sql, [id]).then((res) => {
			return {};
		});
	}
}

export const Messages = new Api();
