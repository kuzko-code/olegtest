import { Messages } from '../../features/messages';
import { Validate } from '../../etc/helpers';
import { Validation } from '../../helper/validationElements';
import {
	create_message_payload,
	get_messages_payload,
	get_message_by_id_payload,
	update_message_payload,
	delete_message_by_id_payload
} from './types';

export class messages_with_validation {
	@Validate((args) => args[0], {
		title: {
			type: 'string',
			empty: false
		},
		link: {
			type: 'string',
			optional:true,
			max: 1000
		}
	})
	static async create_messages(data: create_message_payload) {
		return await Messages.create_message({
			options: data
		});
	}

	@Validate((args) => args[0], {
		selectedFields: Validation.selectedFields,
		aggregate: Validation.aggregate,
		sort: Validation.sort,
		limit: {
			type: 'object',
			props: {
				start: {
					type: 'number',
					optional: true,
					integer: true
				},
				count: {
					type: 'number',
					optional: true,
					integer: true,
					min: 1
				}
			}
		},
		filters: {
			type: 'object',
			props: {
				isRead: {
					type: 'boolean',
					optional: true
				}
			}
		}
	})
	static async get_messages(data: get_messages_payload) {
		return await Messages.get_messages({
			options: data
		});
	}

	@Validate((args) => args[0], {
		id: Validation.id,
		selectedFields: {
			type: 'array',
			optional: true,
			empty: false,
			items: {
				type: 'string',
				empty: false
			}
		}
	})
	static async get_messages_by_id(data: get_message_by_id_payload) {
		return await Messages.get_message_by_id({
			options: data
		});
	}

	@Validate((args) => args[0], {
		id: Validation.id,
		isRead: {
			type: 'boolean'
		}
	})
	static async update_messages(data: update_message_payload) {
		return await Messages.update_message({
			options: data
		});
	}

	@Validate((args) => args[0], {
		id: Validation.id
	})
	static async delete_messages_by_id(data: delete_message_by_id_payload) {
		return await Messages.delete_message_by_id({
			options: data
		});
	}
}
