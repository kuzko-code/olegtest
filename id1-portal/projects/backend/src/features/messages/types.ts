export type create_message_payload = {
	title: string;
	link: string;
};

export type get_messages_payload = {
	selectedFields: string[];
	aggregate: {
		func: string;
		field: string;
	};
	sort: {
		field: string;
		direction: string;
	};
	limit: {
		start: number;
		count: number;
	};
	filters: {
		isRead: boolean;
	};
};

export type get_message_by_id_payload = {
	id: number;
	selectedFields: string[];
};

export type update_message_payload = {
	id: number;
	isRead: boolean;
};

export type delete_message_by_id_payload = {
	id: number;
};
