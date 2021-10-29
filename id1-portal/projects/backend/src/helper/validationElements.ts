import { REGULAR_EXPRESSIONS } from '../constants';
export const Validation = {
	id: {
		type: 'number',
		positive: true,
		integer: true
	},
	optionalParentId: {
		type: 'number',
		positive: true,
		integer: true,
		optional: true,
	},
	ids: {
		type: 'array',
		optional: true,
		empty: false,
		items: {
			type: 'number',
			positive: true,
			integer: true
		}
	},
	selectedFields: {
		type: 'array',
		optional: true,
		empty: false,
		items: {
			type: 'string',
			empty: false
		}
	},
	includedResources: {
		type: 'array',
		optional: true,
		empty: false,
		items: {
			type: 'string',
			empty: false
		}
	},
	sort: {
		type: 'object',
		props: {
			field: {
				type: 'string',
				optional: true,
				empty: false
			},
			direction: {
				type: 'enum',
				values: ['asc', 'desc']
			}
		}
	},
	limit: {
		type: 'object',
		props: {
			start: {
				type: 'number',
				optional: true,
				integer: true
			},
			count: {
				type: 'number',
				optional: true,
				integer: true,
				min: 1
			}
		}
	},
	language: {
		type: 'string',
		optional: true
	},
	aggregate: {
		type: 'object',
		props: {
			func: {
				type: 'enum',
				values: ['avg', 'count', 'max', 'min', 'sum'],
				optional: true
			},
			field: {
				type: 'string',
				optional: true,
				empty: false
			}
		}
	},
	search: {
		type: 'string',
		optional: true,
		empty: false
	},
	searchKeys: {
		type: 'array',
		optional: true,
		empty: false,
		items: {
			type: 'string',
			empty: false
		}
	},
	optionalLink: {
		type: 'string',
		pattern: REGULAR_EXPRESSIONS.LINK,
		optional: true
	},
	link: {
		type: 'string',
		pattern: REGULAR_EXPRESSIONS.LINK,
		empty: false
	},
	optionalUrlAttachment: {
		type: 'string',
		pattern: REGULAR_EXPRESSIONS.ATTACHMENTS,
		optional: true
	},
	urlAttachment: {
		type: 'string',
		pattern: REGULAR_EXPRESSIONS.ATTACHMENTS,
		empty: false
	},
	optionalPhone: {
		type: 'string',
		pattern: REGULAR_EXPRESSIONS.TELEPHONE,
		optional: true
	},
	phone: {
		type: 'string',
		pattern: REGULAR_EXPRESSIONS.TELEPHONE
	},
	optionalEmail: {
		type: 'string',
		pattern: REGULAR_EXPRESSIONS.EMAIL,
		optional: true
	},
	email: {
		type: 'string',
		pattern: REGULAR_EXPRESSIONS.EMAIL
	},
	date: {
		type: "date",
		empty: false,
		convert: true
	},
	optionalDate: {
		type: "date",
		convert: true,
		optional: true
	}
};

export default {
	Validation
};
