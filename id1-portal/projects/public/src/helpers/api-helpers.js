import { getBearerToken, resetBearerToken } from '../services/auth-service.js'

export const getFromAPI = async (url, query, method = 'GET', body, headers = {}) => {
  const apiBase = `${process.env.API_HOST}`;
  const absUrl = new URL(`${apiBase}${url}`);
  const token = getBearerToken();

  if (query) {
    Object.keys(query).forEach((key) =>
      absUrl.searchParams.append(key, query[key])
    );
  }

  if (token) {
    headers['Authorization'] = `${token}`;
  }

  if (body) {
    body = JSON.stringify(body);
    headers['Content-Type'] = 'application/json';
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
    switch (resData.error_message) {
      case "User is not defined":
      case "Authorization error":
      case "invalid signature":
      case "invalid token":
      case "jwt malformed":
      case "jwt expired":
        resetBearerToken();
        break;
    }

    throw new Error(resData.error_message);
  }

  return resData.data;
};