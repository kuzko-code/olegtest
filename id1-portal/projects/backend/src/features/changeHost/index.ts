import { db } from '../../db';
import { site_settings } from '../settings';

class Api {
	public async change_host(client = db ) {
		let host = process.env.PUBLIC_HOST;
		let serviceHost = process.env.TECHNICAL_HOST_NAME;
		if (!serviceHost) return;

		let serviceHostSettings = await site_settings.get_site_settings_by_title({
			options: { title: 'serviceHost', language: '' }
		});

		if (
			serviceHostSettings &&
			serviceHostSettings.settings_object &&
			serviceHostSettings.settings_object.serviceHost != serviceHost
		) {
			let sql = `select (SELECT f_replace_everywhere( $1, $2
            , format($$"%1$s" $$, table_name)))as ROW_COUNT
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name;`;

			await client.query(sql, [`http://${serviceHost}`, host]);
			await client.query(sql, [`https://${serviceHost}`, host]);
			await site_settings.update_site_settings({
				options: {
					settings: [{ title: 'serviceHost', settings_object: { serviceHost: serviceHost } }],
					language: ''
				}
			});
			return await client.query(sql, [`http://${serviceHost}`, host]);
		}
	}
}

export const Host = new Api();
