export const postLogin = ({ email, password }) => {
  return fetch(`${process.env.API_HOST}/auth/login`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: email, password: password }),
  }).then((res) => res.json());
};

export const resetPassword = (data) => {
  return fetch(`${process.env.API_HOST}/auth/resetPassword`, {
    method: 'PUT',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: data,
  }).then((res) => res.json());
};

export const updateCode = (data) => {
  return fetch(`${process.env.API_HOST}/auth/updateCode`, {
    method: 'PUT',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: data,
  }).then((res) => res.json());
};

export const changePassword = ({ oldPassword, newPassword }) => {
  return fetch(`${process.env.API_HOST}/auth/changePassword`, {
    method: 'PUT',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
    body: JSON.stringify({
      oldPassword: oldPassword,
      newPassword: newPassword,
    }),
  }).then((res) => res.json());
};