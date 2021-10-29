const fetch = require('node-fetch');

class Services {
	getDataFromExternalResource = async (
		_apiBase: string,
		url: string,
		query: any,
		method = 'GET',
		body: string | null,
		headers = {}
	) => {
		const absUrl = new URL(`${_apiBase}${url}`);

		if (query) {
			Object.keys(query).forEach((key) => absUrl.searchParams.append(key, query[key]));
		}

		const res = await fetch(absUrl, {
			method: method,
			body: body,
			headers: {
				...headers
			}
		});

		const resData = await res.json();

		if (!res.ok) {
			throw new Error(resData.error_message);
		}

		return resData.data;
	};
}

export const apiServices = new Services();
