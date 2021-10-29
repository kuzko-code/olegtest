export const getPluginsInfo = () => {
  return fetch(`${process.env.API_HOST}/pluginsinfo`).then((res) => res.json());
};

export const getPlugins = () => {
  return fetch(`${process.env.API_HOST}/pluginsinfo`).then((res) => res.json());
};

export const getPluginsByName = (name) => {
  return fetch(`${process.env.API_HOST}/pluginsinfo/${name}`).then((res) =>
    res.json()
  );
};

export const deletePluginsByName = (name) => {
  return fetch(`${process.env.API_HOST}/pluginsinfo/${name}`, {
    method: 'DELETE',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
  }).then((res) => res.json());
};

export const installPlugins = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  var options = {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  };
  return fetch(
    `${process.env.API_HOST}/pluginsinfo`,
    options
  ).then((response) => response.json());
};

export const activatePlugin = (data, url) => {
  var array = [
    fetch(`${process.env.API_HOST}/pluginsinfo`, {
      method: 'PUT',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: data,
    }),
  ];

  if (url)
    array.push(
      fetch(`${process.env.API_HOST}${url}`, {
        method: 'PUT',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
        body: data,
      })
    );

  return Promise.all(array).then((responses) => {
    return responses;
  });
};