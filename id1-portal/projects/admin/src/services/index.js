import { parseEditorImagesIds } from './helpers';

export const getSettingByTitle = (title, language) => {
  return fetch(
    `${process.env.API_HOST}/settings/${title}?language=${language}`
  ).then((res) => res.json());
};

export const getContacts = async (language) => {
  const response = await fetch(
    `${process.env.API_HOST}/settings/contacts?language=${language}`
  );
  const data = await response.json();
  return data;
};

export const getSettings = (titles, language) => {
  return fetch(
    `${process.env.API_HOST}/settings?titles=${titles}&language=${language}`
  ).then((res) => res.json());
};

export const getColorSchemes = async () => {
  const response = await fetch(`${process.env.API_HOST}/colorschemes`);
  const { data } = await response.json();
  return data;
};

export const addColorScheme = async (newScheme) => {
  const response = await fetch(`${process.env.API_HOST}/colorschemes`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
    body: JSON.stringify({
      color_scheme: newScheme,
    }),
  });
  const data = await response.json();
  return data;
};

export const deleteColorScheme = async (id) => {
  const response = await fetch(`${process.env.API_HOST}/colorschemes/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  });
  const data = await response.json();
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('newsPageSize');
  localStorage.removeItem('rubricsPageSize');
  localStorage.removeItem('tagsPageSize');
  localStorage.removeItem('photogalleryPageSize');
  localStorage.removeItem('videogalleryPageSize');
  localStorage.removeItem('pluginsPageSize');
  localStorage.removeItem('groupsPageSize');
  localStorage.removeItem('usersPageSize');
  localStorage.removeItem('appealsPageSize');
  localStorage.removeItem('feedbacksPageSize');
  localStorage.removeItem('legalPersonOrdersPageSize');
  localStorage.removeItem('naturalPersonOrdersPageSize');
  localStorage.removeItem('userPagesPageSize');
};

export const putContacts = (contacts, language) => {
  return fetch(
    `${process.env.API_HOST}/settings/contacts?language=${language}`,
    {
      method: 'PUT',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: contacts,
    }
  ).then((res) => res.json());
};

export const getMainSettings = async (language) => {
  return getSettingByTitle('layout', language);
};

export const getSiteLogos = async (language) => {
  return getSettingByTitle('siteLogos', language);
};

export const updateSettings = async (body) =>
  await fetch(`${process.env.API_HOST}/settings`, {
    method: 'PUT',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
    body,
  }).then((data) => data.json());

export const updateSettingsByTitle = async (title, language, body) =>
  await fetch(
    `${process.env.API_HOST}/settings/${title}?language=${language}`,
    {
      method: 'PUT',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body,
    }
  ).then((data) => data.json());

export const putBanners = (body) => {
  return fetch(`${process.env.API_HOST}/settings/locationOfBanners`, {
    method: 'PUT',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
    body,
  }).then((data) => data.json());
};

export const getMetaGoogleSiteVerification = () => {
  return getSettingByTitle('metaGoogleSiteVerification');
};

export const putMetaGoogleSiteVerification = (body, language) => {
  return fetch(
    `${process.env.API_HOST}/settings/metaGoogleSiteVerification?language=${language}`,
    {
      method: 'PUT',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: body,
    }
  ).then((res) => res.json());
};

export const putSiteLogosSettings = (main) => {
  return fetch(`${process.env.API_HOST}/settings/siteLogos`, {
    method: 'PUT',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
    body: main,
  }).then((res) => res.json());
};

export const getNewsSliders = (language) => {
  return getSettingByTitle('mainPageSliders', language);
};

export const getNewsRubrics = (language) => {
  return getSettingByTitle('mainPageRubrics', language);
};

export const putNewsRubrics = (rubrics, language) => {
  return fetch(
    `${process.env.API_HOST}/settings/mainPageRubrics?language=${language}`,
    {
      method: 'PUT',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: rubrics,
    }
  ).then((res) => res.json());
};

export const getMenuSettings = (language) => {
  return getSettingByTitle('mainNavigation', language);
};

export const putMenuSettings = (menu, language) => {
  return fetch(
    `${process.env.API_HOST}/settings/mainNavigation?language=${language}`,
    {
      method: 'PUT',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: menu,
    }
  ).then((res) => res.json());
};
//todo file-api-services.js
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
//todo file-api-services.js
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

export const getAdminLanguages = () => {
  return fetch(`${process.env.API_HOST}/language/admin`).then((res) =>
    res.json()
  );
};

export const getPublicLanguages = () => {
  return fetch(`${process.env.API_HOST}/language/public`).then((res) =>
    res.json()
  );
};

export const getAllLanguages = () => {
  return fetch(`${process.env.API_HOST}/language/`).then((res) => res.json());
};

export const getLanguageByCutback = (cutback) => {
  return fetch(`${process.env.API_HOST}/language/?cutbacks=${cutback}`).then(
    (res) => res.json()
  );
};

export const putPublicSiteLanguages = (languages) => {
  return fetch(`${process.env.API_HOST}/settings/languagesOnThePublicSite`, {
    method: 'PUT',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
    body: languages,
  }).then((res) => res.json());
};

export const putAdminSiteLanguages = (languages) => {
  return fetch(`${process.env.API_HOST}/settings/languagesOnTheAdminSite`, {
    method: 'PUT',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
    body: languages,
  }).then((res) => res.json());
};
//todo file-helpers.js
export const getFileId = (file) => {
  let filePath = require('path').basename(file);
  return filePath.substring(0, filePath.indexOf('_'));
};
//todo file-helpers.js
export const getFileName = (file) => {
  let filePath = require('path').basename(file);
  return filePath.substring(filePath.indexOf('_') + 1);
};

export const getListImgUrrFromHTML = (html) => {
  var listImg = [];

  let regexp = new RegExp('<img [^>]*src="([^"]+)"[^>]*>', 'g');
  let matchAll = html.matchAll(regexp);
  let result = Array.from(matchAll);

  if (result) {
    result.map((el) => {
      var lastIndexOf = el[1].lastIndexOf('/');
      if (lastIndexOf > 0) {
        var lastParam = el[1].substring(lastIndexOf + 1);
        listImg.push(lastParam.substring(lastParam.indexOf('_'), 0));
      }
    });
  }
  return listImg;
};

export const deleteListImg = (html, listImg) => {
  var tempListImg = getListImgUrrFromHTML(html);

  listImg.map((el) => {
    if (!tempListImg.includes(el)) delFile(el);
  });

  return tempListImg;
};

export const deleteEditorImages = (
  html,
  uploadedImages,
  shouldReturnIds = false
) => {
  const currentEditorImagesIds = parseEditorImagesIds(html);
  const uploadedImagesClone = JSON.parse(JSON.stringify(uploadedImages));

  const filtered = uploadedImagesClone.filter((image) => {
    if (!currentEditorImagesIds.includes(image.id)) {
      !shouldReturnIds && delFile(image.id);
      return shouldReturnIds;
    } else {
      image.isSaved = true;
      return !shouldReturnIds;
    }
  });

  return filtered;
};

export const getCorrectedEditorContent = (contentText) => {
  return contentText === '<p><br></p>' ? '' : contentText;
};

export const getNavigation = () => {
  return fetch(`${process.env.API_HOST}/adminNavigation`, {
    method: 'GET',
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  }).then((res) => res.json());
};
