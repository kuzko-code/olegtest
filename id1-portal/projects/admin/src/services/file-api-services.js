export const postFile = async (file, fileName = file.name) => {
  const formData = new FormData();
  formData.append('file', file, fileName);
  const options = {
    method: 'POST',
    headers: {
      Authorization: localStorage.getItem('token'),
    },
    body: formData,
  };

  return fetch(`${process.env.API_HOST}/attachment`, options).then((res) =>
    res.json()
  );
};

export const delFile = (id) => {
  return fetch(`${process.env.API_HOST}/attachment/${id}`, {
    method: 'DELETE',
    headers: {
      //   'accept': 'application/json',
      //   'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
  }).then((res) => res.json());
};

export const postDocument = (file, fileName = file.name, content = []) => {
  const formData = new FormData()
  formData.append('content', content);
  formData.append('file', file, fileName);
  const options = {
    method: 'POST', headers: {
      Authorization: localStorage.getItem('token'),
    },
    body: formData
  };
  return fetch(`${process.env.API_HOST}/documents`, options).then((res) =>
    res.json()
  );
};
export const updateDocument = (id, storage_key, content = []) => {
  return fetch(`${process.env.API_HOST}/documents`, {
    method: 'PUT',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
    body: JSON.stringify({
      id,
      storage_key,
      content:content
    }),
  }).then((res) => res.json());
}

export const delDocument = (id) => {
  return fetch(`${process.env.API_HOST}/documents/${id}`, {
    method: 'DELETE',
    headers: {
      //   'accept': 'application/json',
      //   'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
  }).then((res) => res.json());
};

export const getDocumentById = (id) => {
  return fetch(`${process.env.API_HOST}/documents/${id}`, {
    method: 'GET',
    headers: {
      //   'accept': 'application/json',
      //   'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    }
  }).then((res) => res.json());
}