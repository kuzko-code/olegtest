import { Validate } from '../../etc/helpers';
import { Validation } from '../../helper/validationElements';
import { tabsAPI } from '../../features/tabs';
import { AjvServices } from '../../helper/ajv'
import {
	get_tab_payload,
	get_tabs_payload,
	create_tabs_payload,
	update_tabs_payload,
	get_tabs_types_payload,
	delete_tabs_payload,
	get_banners_settings_payload,
	update_position_tabs_payload
} from './types';
const Entities = 'mainSettings';
import { Users } from '../../features/users';
const bar = {
	type: 'array',
	// empty: false,
	items: {
		type: 'object',
		strict: true,
		props: {
			id: Validation.id,
			enabled: { type: 'boolean' }
		}
	},
	optional: true
};

export class tabs_with_validation {
	@Validate((args) => args[0], {
		form_data: {
			type: 'object',
			strict: true,
			props: {
				topBar: bar,
				bottomBar: bar,
				rightBar: bar,
				leftBar: bar
			}
		},
		language: Validation.language
	})
	static async update_tabs_position(data: update_position_tabs_payload) {
		await Users.checkIfUserHavePermissionToAccess(parseInt(data.ctx.userId!), Entities, data.ctx.role!);
		return await tabsAPI.update_tabs_position({
			options: data
		});
	}

	@Validate((args) => args[0], {
		language: Validation.language
	})
	static async get_preview_tabs(data: update_position_tabs_payload) {		
		return await tabsAPI.get_preview_tabs({
			options: data
		});
	}

	@Validate((args) => args[0], {
		filters: {
			type: 'object',
			props: {
				enabled: {
					type: 'boolean',
					optional: true
				},
				position: {
					type: 'enum',
					values: ['topBar', 'bottomBar', 'rightBar', 'leftBar'],
					optional: true
				}
			}
		},
		selectedFields: Validation.selectedFields,
		language: Validation.language
	})
	static async get_banners_settings(data: get_banners_settings_payload) {
		return await tabsAPI.get_banners_settings({
			options: data
		});
	}

	@Validate((args) => args[0], {
		id: Validation.id,
		form_data: { type: 'any' }
	})
	static async update_tabs(data: update_tabs_payload) {
		await AjvServices.validate_json_schema(await tabsAPI.get_json_schema_by_tab_id(data.id), data.form_data);
		await Users.checkIfUserHavePermissionToAccess(parseInt(data.ctx.userId!), Entities, data.ctx.role!);
		return await tabsAPI.update_tabs({
			options: data
		});
	}

	@Validate((args) => args[0], {
		form_data: { type: 'any', optional: true, default: '' },
		type_title: { type: 'string' },
		language: { type: 'string' },
		enabled: {
			type: 'boolean',
			default: false,
			optional: true
		},
		position: {
			type: 'enum',
			values: ['topBar', 'bottomBar', 'rightBar', 'leftBar']
		}
	})
	static async create_tabs(data: create_tabs_payload) {
		if (data.form_data)
			await AjvServices.validate_json_schema(await tabsAPI.get_json_schema_by_tab_types(data.form_data), data.form_data);
		await Users.checkIfUserHavePermissionToAccess(parseInt(data.ctx.userId!), Entities, data.ctx.role!);
		if(!await tabsAPI.validate_tab_position(data.type_title, data.position)){
			const preconditionFailedEx = new Error('The value of the banner position does not match the schema');
			preconditionFailedEx.statusCode = 412;
			throw preconditionFailedEx;
		}

		return await tabsAPI.create_tabs({
			options: data
		});
	}

	@Validate((args) => args[0], {
		selectedFields: Validation.selectedFields,
		includedResources: Validation.includedResources,
		aggregate: Validation.aggregate,
		filters: {
			type: 'object',
			props: {
				ids: {
					type: 'array',
					optional: true,
					empty: false,
					items: {
						type: 'number',
						integer: true,
						positive: true
					}
				},
				enabled: {
					type: 'boolean',
					optional: true
				},
				position: {
					type: 'enum',
					values: ['topBar', 'bottomBar', 'rightBar', 'leftBar'],
					optional: true
				},
				search: Validation.search,
				searchKeys: Validation.searchKeys
			}
		},
		language: Validation.language
	})
	static async get_tabs(data: get_tabs_payload) {
		return await tabsAPI.get_tabs({ options: data });
	}

	@Validate((args) => args[0], {
		id: Validation.id,
		selectedFields: Validation.selectedFields,
		includedResources: Validation.includedResources,
		language: Validation.language
	})
	public static async get_tabs_by_id(data: get_tab_payload) {
		return await tabsAPI.get_tab_by_id({ options: data });
	}

	@Validate((args) => args[0], {
		ids: Validation.ids
	})
	static async delete_tab_by_ids(data: delete_tabs_payload) {
		await Users.checkIfUserHavePermissionToAccess(parseInt(data.ctx.userId!), Entities, data.ctx.role!);
		return await tabsAPI.delete_tab_by_ids({
			options: data
		});
	}

	@Validate((args) => args[0], {
		tab_position: {
			type: 'array',
			optional: true,
			empty: false,
			items: {
				type: 'string',
				min: 3
			}
		},
		includedResources: Validation.includedResources
	})
	static async get_tabs_types(data: get_tabs_types_payload) {
		return await tabsAPI.get_tabs_types({
			options: data
		});
	}
}
