export type update_schedule_updated_payload = {
	updatedFrequency: string;
	updatedTime: number;
	updatedDay: number;
};

export type get_portal_update_settings_payload = {
	titles: string[];
};

export type login_payload = {
	email: string;
};

export type registration_payload = {
	email: string;
	password: string;
	registrationData: any;
};

export type get_or_delete_portal_update_setting_payload = {
	title: string;
};
