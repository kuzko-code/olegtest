export const getBannerTypes = (position) =>
  fetch(`${process.env.API_HOST}/tabs/types?position=${position}`).then(
    (data) => data.json()
  );

export const getBannerById = (id) => {
  return fetch(`${process.env.API_HOST}/tabs/${id}?include=schemas`).then(
    (res) => res.json()
  );
};

export const getBannerByTitle = (title, language) => {
  return fetch(
    `${process.env.API_HOST}/tabs/${title}?language=${language}`
  ).then((res) => res.json());
};

export const putBanner = (data) => {
  return fetch(`${process.env.API_HOST}/tabs`, {
    method: 'PUT',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
    body: data,
  }).then((res) => res.json());
};

export const putBannerByTitle = (data, title, language) => {
  return fetch(`${process.env.API_HOST}/tabs/${title}?language=${language}`, {
    method: 'PUT',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
    body: data,
  }).then((res) => res.json());
};

export const getBanners = (language, shouldIncludeSchemas) =>
  fetch(
    `${process.env.API_HOST}/tabs?language=${language}${
      shouldIncludeSchemas ? '&include=schemas' : ''
    }`
  ).then((res) => res.json());

export const getBannersSettings = (language) =>
  fetch(
    `${process.env.API_HOST}/settings/locationOfBanners?language=${language}&fields=id,type_title,enabled`
  ).then((res) => res.json());

export const addBanner = (position, type_title, language) =>
  fetch(`${process.env.API_HOST}/tabs`, {
    method: 'POST',
    headers: {
      Authorization: localStorage.getItem('token'),
    },
    body: JSON.stringify({
      form_data: '',
      position,
      type_title,
      language,
    }),
  }).then((res) => res.json());

export const deleteBanner = (id, language) =>
  fetch(`${process.env.API_HOST}/tabs/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  }).then((res) => res.json());
