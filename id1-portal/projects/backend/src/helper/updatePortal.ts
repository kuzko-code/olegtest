import { db } from '../db';
class Services {
	public async getPortalUpdateSetting(title: string, client = db) {
		let sql = 'SELECT title, settings_object FROM portal_update_settings WHERE title = $1';

		return client.query(sql, [title]).then((res) => res.rows[0]);
	}

	public getPortalVersion = async (client = db) => {
		let sql = `select version from portal_versions where status = 'currentVersion'`;

		try{
		return client.query(sql).then((res) => res.rows[0].version);
		}catch{
			return ''
		}
	};

	public getOGPMarketCredentials = async () => {
		let authenticationInOGPMarket = await this.getPortalUpdateSetting('authenticationInOGPMarket');
		if (
			!(
				authenticationInOGPMarket &&
				authenticationInOGPMarket.settings_object.hash &&
				authenticationInOGPMarket.settings_object.email
			)
		)
			throw new Error(`Authentication on OGP market failed`);

		return authenticationInOGPMarket.settings_object;
	};

	public getOGPMarketUrl = async () => {
		let OGPMarketUrl = await this.getPortalUpdateSetting('OGPMarketUrl');
		if (!(OGPMarketUrl && OGPMarketUrl.settings_object.url)) throw new Error(`No market link found`);

		return OGPMarketUrl.settings_object.url;
	};
}

export const UpdatePortalServices = new Services();
