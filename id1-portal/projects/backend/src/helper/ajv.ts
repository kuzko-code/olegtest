import Ajv from 'ajv';

class Services {
	validate_json_schema = async (json_schema: any, form_data: string) => {
		const ajv = new Ajv();
		if (!json_schema || !ajv.validate(json_schema, form_data)) {
			const preconditionFailedEx = new Error('The banner value does not match the schema');
			preconditionFailedEx.statusCode = 412;
			throw preconditionFailedEx;
		}
	}
}

export const AjvServices = new Services();