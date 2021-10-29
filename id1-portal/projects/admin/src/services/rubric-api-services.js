
export const getRubrics = (language) => {
  return fetch(
    `${process.env.API_HOST}/news/rubrics?language=${language}`
  ).then((res) => res.json());
};

const addOrUpdateRubrics = (rawData, method) => {
  return fetch(`${process.env.API_HOST}/news/rubrics`, {
    method: method,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
    body: JSON.stringify(rawData),
  }).then((res) => res.json());
};

export const putRubrics = (rawData) => {
  return addOrUpdateRubrics(rawData, 'PUT');
};

export const postRubrics = (rawData) => {
  return addOrUpdateRubrics(rawData, 'POST');
};

export const delRubrics = (id) => {
  return fetch(`${process.env.API_HOST}/news/rubrics/${id}`, {
    method: 'DELETE',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
  }).then((res) => res.json());
};