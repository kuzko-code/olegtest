export const postFile = (file, fileName = file.name) => {
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