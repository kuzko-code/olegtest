import { handler_context } from '../../etc/http/micro_controller';

export type create_group_payload = {
	name: string;
	permission: any;
};

export type added_user_to_group_payload = {
	group_id: number;
	users_id: number[];
};

export type get_groups_payload = {
	selectedFields: string[];
	aggregate: {
		func: string;
		field: string;
	};
	filters: {
		search: string;
	};
	sort: {
		field: string;
		direction: string;
	};
	limit: {
		start: number;
		count: number;
	};
	ctx: handler_context;
};

export type get_group_by_id_payload = {
	id: number;
	selectedFields: string[];
};

export type update_group_payload = {
	id: number;
	name: string;
	permission: any;
	ctx: handler_context;
};

export type delete_group_by_id_payload = {
	id: number;
};
