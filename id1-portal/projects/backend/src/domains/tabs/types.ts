import { handler_context } from '../../etc/http/micro_controller';

export type get_preview_tabs_payload = {
	language: string;
};

export type update_position_tabs_payload = {
	form_data: any;
	language: string;
	ctx: handler_context;
};

export type update_tabs_payload = {
	id: number;
	form_data: any;
	ctx: handler_context;
};

export type create_tabs_payload = {
	form_data: any;
	type_title: string;
	enabled: boolean;
	position: string;
	language: string;
	ctx: handler_context;
};

export type get_tabs_payload = {
	selectedFields: string[];
	includedResources: string[];
	aggregate: {
		func: string;
		field: string;
	};
	filters: {
		ids: number[];
		search: string;
		searchKeys: string[];
		enabled: boolean;
		position: string;
	};
	language: string;
};

export type get_tab_payload = {
	id: number;
	selectedFields: string[];
	includedResources: string[];
};

export type delete_tabs_payload = {
	ctx: handler_context;
	ids: number[];
};

export type get_tabs_types_payload = {
	tab_position: string[];
	includedResources: string[];
};

export type get_banners_settings_payload = {
	filters: {
		enabled: boolean;
		position: string;
	};
	selectedFields: string[];
	language: string;
};
