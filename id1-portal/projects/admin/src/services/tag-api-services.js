export const getTags = (language) => {
  return fetch(
    `${process.env.API_HOST}/news/tags?language=${language}`
  ).then((res) => res.json());
};

const addOrUpdateTags = (rawData, method) => {
  return fetch(`${process.env.API_HOST}/news/tags`, {
    method: method,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },

    body: JSON.stringify(rawData),
  }).then((res) => res.json());
};

export const putTags = (rawData) => {
  return addOrUpdateTags(rawData, 'PUT');
};

export const postTags = (rawData) => {
  return addOrUpdateTags(rawData, 'POST');
};

export const delTags = (id) => {
  return fetch(`${process.env.API_HOST}/news/tags/${id}`, {
    method: 'DELETE',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
  }).then((res) => res.json());
};