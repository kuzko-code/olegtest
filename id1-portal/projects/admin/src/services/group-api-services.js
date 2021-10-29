export const getGroups = () => {
  return fetch(`${process.env.API_HOST}/groups?fields=id,name,permission`, {
    method: 'GET',
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  }).then((res) => res.json());
};

export const getGroupById = (id) => {
  return fetch(`${process.env.API_HOST}/groups/${id}`, {
    method: 'GET',
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  }).then((res) => res.json());
};

export const createGroup = (data) => {
  return fetch(`${process.env.API_HOST}/groups`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
    body: data,
  }).then((res) => res.json());
};

export const updateGroups = (data) => {
  return fetch(`${process.env.API_HOST}/groups`, {
    method: 'PUT',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
    body: data,
  }).then((res) => res.json());
};

export const deleteGroup = (id) => {
  return fetch(`${process.env.API_HOST}/groups/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  }).then((res) => res.json());
};

