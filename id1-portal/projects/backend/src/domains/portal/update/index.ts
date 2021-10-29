import { Validate } from '../../../etc/helpers';
import { UpdatePortal } from '../../../features/portal/update';
import { update_portal_payload } from './types';

export class portal_update_with_validation {
	@Validate((args) => args[0], {
		version: {
			type: 'string',
			empty: false
		}
	})
	static async update_portal(data: update_portal_payload) {
		return await UpdatePortal.update_portal({ options: data });
	}
}
