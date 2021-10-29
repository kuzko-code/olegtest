
const addOrUpdateNews = (news, method) => {
  return fetch(`${process.env.API_HOST}/news`, {
    method: method,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
    body: news,
  }).then((res) => res.json());
};

export const putNews = (news) => {
  return addOrUpdateNews(news, 'PUT');
};

export const postNews = (news) => {
  return addOrUpdateNews(news, 'POST');
};

export const getNews = (params) => {
  return fetch(`${process.env.API_HOST}/news${params}`).then((res) =>
    res.json()
  );
};

export const getAllNews = (language) => {
  return fetch(
    `${process.env.API_HOST}/news?fields=id,title,published_date&include=rubric&isPublished=true&language=${language}`
  ).then((res) => res.json());
};

export const getNewsById = (id) => {
  return fetch(
    `${process.env.API_HOST}/news/${id}?include=allAttachments`
  ).then((res) => res.json());
};
//todo

export const delNews = ({ id }) => {
  return fetch(`${process.env.API_HOST}/news/${id}`, {
    method: 'DELETE',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
  }).then((res) => res.json());
};