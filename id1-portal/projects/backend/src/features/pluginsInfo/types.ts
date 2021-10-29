export type get_plugins_payload = {};

export type get_plugin_by_name_payload = {
	name: string;
};

export type delete_plugin_by_name_payload = {
	name: string;
};

export type activate_plugin_payload = {
	name: string;
	activate: boolean;
};

export type install_plugins_payload = {
	bodyFile: any;
};
