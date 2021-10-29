
export const getUserByToken = () => {
  return fetch(`${process.env.API_HOST}/auth/user`, {
    method: 'GET',
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  }).then((res) => res.json());
};

export const getUsers = () => {
  return fetch(`${process.env.API_HOST}/users?include=groups`, {
    method: 'GET',
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  }).then((res) => res.json());
};

export const getUserById = (id) => {
  return fetch(`${process.env.API_HOST}/users/${id}`, {
    method: 'GET',
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  }).then((res) => res.json());
};

export const postUser = (data) => {
  return fetch(`${process.env.API_HOST}/users`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
    body: data,
  }).then((res) => res.json());
};

export const putUser = (data) => {
  return fetch(`${process.env.API_HOST}/users`, {
    method: 'PUT',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
    body: data,
  }).then((res) => res.json());
};

export const delUser = (id) => {
  return fetch(`${process.env.API_HOST}/users/${id}`, {
    method: 'DELETE',
    headers: {
      //   'accept': 'application/json',
      //   'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
  }).then((res) => res.json());
};