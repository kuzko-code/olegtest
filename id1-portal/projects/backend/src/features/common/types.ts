import { handler_context } from '../../etc/http/micro_controller';

export type id_fields_is_published_included_payload = {
	id: number;
	selectedFields: string[];
	includedResources: string[];
	is_published: boolean;
};

export type id_fields_included_payload = {
	id: number;
	selectedFields: string[];
	includedResources: string[];
};

export type id_fields_ctx_payload = {
	id: number;
	selectedFields: string[];
	ctx: handler_context;
};

export type id_ctx_payload = {
	id: number;
	ctx: handler_context;
};

export type id_fields_payload = {
	id: number;
	selectedFields: string[];
};

export type id_payload = {
	id: number;
};

export type get_item_by_id_payload = {
	id: number;
	selectedFields: string[];
	table: string;
};

export type delete_item_by_id_payload = {
	id: number;
	table: string;
};
