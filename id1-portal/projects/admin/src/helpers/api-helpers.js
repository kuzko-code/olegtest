export default class ApiService {
  constructor(apiBase,token) {
    this._token = token;
    this._apiBase = `${process.env.API_HOST}/${apiBase}`;
  }

  getResource = async (url, query, method = 'GET', body, headers = {}) => {
    const absUrl = new URL(`${this._apiBase}${url}`);

    if (query) {
      Object.keys(query).forEach((key) =>
        absUrl.searchParams.append(key, query[key])
      );
    }

    if (body) {
      body = JSON.stringify(body);
      headers['Content-Type'] = 'application/json';
    }

    if (this._token) {
      headers['Authorization'] = `${this._token}`;
    }

    const res = await fetch(absUrl, {
      method: method,
      body: body,
      headers: {
        ...headers,
      },
    });

    const resData = await res.json();

    if (!res.ok) {
      throw new Error(resData.error_message);
    }

    return resData.data;
  };

  getAllItems = async (query) => {
    return await this.getResource('', query);
  };

  getItemById = async (id, query) => {
    return await this.getResource(`/${id}`, query);
  };

  createItem = async (query) => {
    return await this.getResource('', null, 'POST', query);
  };

  updateItem = async (query) => {
    return await this.getResource('', null, 'PUT', query);
  };

  deleteItem = async (id) => {
    return await this.getResource(`/${id}`, null, 'DELETE');
  };

  indexUp = async (id) => {
    return await this.getResource(`/indexUp/${id}`, null, 'PUT',{});
  };
  
  indexDown = async (id) => {
    return await this.getResource(`/indexDown/${id}`, null, 'PUT',{});
  };
}

export const getResourceFromAPI = async (url, query, method = 'GET', body, headers = {}) => {
    const apiBase = `${process.env.API_HOST}`;
    const absUrl = new URL(`${apiBase}${url}`);
    const token = localStorage.getItem('token');
    if (query) {
      Object.keys(query).forEach((key) =>
        absUrl.searchParams.append(key, query[key])
      );
    }

    if (body) {
      body = JSON.stringify(body);
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `${token}`;
    }

    const res = await fetch(absUrl, {
      method: method,
      body: body,
      headers: {
        ...headers,
      },
    });

    const resData = await res.json();

    if (!res.ok) {
      throw new Error(resData.error_message);
    }

    return resData.data;
};