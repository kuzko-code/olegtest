import { Validate } from '../../etc/helpers';
import { Portal } from '../../features/portal';
import {
	get_or_delete_portal_update_setting_payload,
	update_schedule_updated_payload,
	registration_payload,
	get_portal_update_settings_payload
} from './types';

export class portal_update_settings_with_validation {
	@Validate((args) => args[0], {
		titles: {
			type: 'array',
			optional: true,
			empty: false,
			items: {
				type: 'string',
				min: 3
			}
		}
	})
	static async get_portal_update_settings(data: get_portal_update_settings_payload) {
		return await Portal.get_portal_update_settings({ options: data });
	}

	@Validate((args) => args[0], {
		email: 'email'
	})
	static async user_registration(user_data: registration_payload) {
		return await Portal.user_registration({
			options: user_data
		});
	}

	@Validate((args) => args[0], {
		title: {
			type: 'string',
			min: 3
		}
	})
	static async get_portal_update_setting(data: get_or_delete_portal_update_setting_payload) {
		return await Portal.get_portal_update_setting({ options: data });
	}

	@Validate((args) => args[0], {
		updatedFrequency: {
			type: 'enum',
			values: ['never', 'every_week', 'every_month', 'every_year']
		},
		updatedTime: {
			type: 'number',
			default: 23,
			min: 0,
			max: 23,
			empty: false
		},
		updatedDay: {
			type: 'number',
			default: 0,
			min: 0,
			max: 6
		}
	})
	static async update_schedule_updated(data: update_schedule_updated_payload) {
		try {
			await Portal.checkIfTheUserRegistration();
			return await Portal.update_portal_update_schedule({
				options: data
			});
		} catch {
			await Portal.update_portal_update_schedule({
				options: { updatedFrequency: 'never', updatedTime: 0, updatedDay: 0 }
			});
		}
	}
}
