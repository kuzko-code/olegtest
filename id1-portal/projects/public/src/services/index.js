import { getFromAPI } from '../helpers/api-helpers';

export const getPopularNews = (count, language) => {

   var fromDate = setLastMonthDate(new Date());
   var toDate = setNowDate(new Date());
   return fetch(`${process.env.API_HOST}/news?language=${language}&fields=id,title,published_date,main_picture&include=rubric&isPublished=true&count=${count}&from=${fromDate}&to=${toDate}&sortDirection=desc&sortField=number_of_views`)
      .then(res => res.json())
}

function setLastMonthDate(date) {
   var d = new Date(date);
   var month = '';
   var day = '';
   var year = '';
   if (d.getMonth() != 0) {
      month = '' + (d.getMonth());
      day = '' + d.getDate();
      year = d.getFullYear();
   } else {
      month = '12',
         day = '' + d.getDate();
      year = d.getFullYear() - 1;
   }

   if (month.length < 2)
      month = '0' + month;
   if (day.length < 2)
      day = '0' + day;

   return [year, month, day].join('-') + " " + ["00", "00", "00"].join(':');
}

function setNowDate(date) {
   var d = new Date(date);
   var month = '' + (d.getMonth() + 1);
   var day = '' + d.getDate();
   var year = d.getFullYear();

   if (month.length < 2)
      month = '0' + month;
   if (day.length < 2)
      day = '0' + day;
   return [year, month, day].join('-') + " " + ["23", "59", "59"].join(':');
}

export const getNewsByRubric = (rubric, language) => {
   return fetch(`${process.env.API_HOST}/news?language=${language}&fields=id,title,published_date,main_picture&include=rubric&isPublished=true&count=5&sortDirection=desc&sortField=published_date&rubrics=${rubric}`)
      .then(res => res.json())
}

export const getNewsByIds = (ids, language) => {
   return fetch(`${process.env.API_HOST}/news?language=${language}&fields=id,title,published_date,description,main_picture&include=rubric&ids=${ids}`)
      .then(res => res.json())
}

export const getMainNews = (id) => {
   return fetch(`${process.env.API_HOST}/news/${id}?fields=id,title,content,created_date,published_date,description,images,language,main_picture,tags,facebook_enable&include=rubric,attachments,nextNews,previousNews`).then(
     (res) => res.json()
   );
}

export const getBeforeNews = (date, language) => {
   return fetch(`${process.env.API_HOST}/news?language=${language}&to=${date}&sortField=published_date&sortDirection=desc&start=1&count=1`)
      .then(res => res.json())

}

export const getToNews = (date, language) => {
   return fetch(`${process.env.API_HOST}/news?language=${language}&from=${date}&sortField=published_date&sortDirection=asc&start=1&count=1`)
      .then(res => res.json())

}

export const putViewNews = (id) => {
   return fetch(`${process.env.API_HOST}/news/${id}/view`, {
      method: 'PUT',
      headers: {
         'accept': 'application/json',
         'Content-Type': 'application/json'
      },

   })
      .then(res => res.json())
}

export const getPluginsInfo = () => {
   return fetch(`${process.env.API_HOST}/pluginsinfo`)
      .then(res => res.json())
}

export const getPluginsInfoByName = (essence) => {
   return fetch(`${process.env.API_HOST}/pluginsinfo/${essence}`)
      .then(res => res.json())
}

export const getSearch = (APIRequest) => {
   return fetch(`${process.env.API_HOST}${APIRequest}`)
      .then(res => res.json())
}

export const getNewsList = (title, rubric, tag, start, count, language) => {
   return fetch(`${process.env.API_HOST}/news?language=${language}&rubrics=${rubric}&tags=${tag}&search=${title}&include=rubric&start=${start}&count=${count}&sortDirection=desc&sortField=published_date&isPublished=true&fields=id,title,main_picture,description,rubric_id,published_date`)
      .then(res => res.json())
}

export const getNewsCount = (title, rubric, tag, language) => {
   return fetch(`${process.env.API_HOST}/news?language=${language}&aggFunc=count&search=${title}&rubrics=${rubric}&tags=${tag}&isPublished=true`)
      .then(res => res.json())
}

export const getRubrics = (language) => {
   return fetch(`${process.env.API_HOST}/news/rubrics?language=${language}`)
      .then(res => res.json())
}

export const getPopularTags = (language) => {
   return fetch(`${process.env.API_HOST}/news/tags/rating?language=${language}&count=14`)
      .then(res => res.json())
}

export const getLayout = async (language, titles) => {
   const responseJson = await fetch(`${process.env.API_HOST}/settings?language=${language}&titles=${titles}`)
   const response = await responseJson.json()
   return response;
}

export const getNewsForSlidersTop = (language) => {
   return fetch(`${process.env.API_HOST}/settings/mainPageSliders?language=${language}`)
      .then(res => res.json())
}

export const getNewsRubrics = (language) => {
   return fetch(`${process.env.API_HOST}/settings/mainPageRubrics?language=${language}`)
      .then(res => res.json())
}

export const getMenuSettings = (language) => {
   return fetch(`${process.env.API_HOST}/settings/mainNavigation?language=${language}`)
      .then(res => res.json())
}

export const getLanguages = () => {
   return fetch(`${process.env.API_HOST}/language/public`)
      .then(res => res.json())
}

export const getFileId = (file) => {
   let filePath = require('path').basename(file)
   return filePath.substring(0, filePath.indexOf('_'))
}

export const getFileName = (file) => {
   let filePath = require('path').basename(file)
   return filePath.substring(filePath.indexOf('_')+1)
}

export const getBannerByTitle = (title, language) => {
   return fetch(`${process.env.API_HOST}/tabs/${title}?language=${language}`)
      .then(res => res.json())
}

export const getLocationOfBanners = (language) => {
   return fetch(`${process.env.API_HOST}/settings/locationOfBanners?language=${language}`)
      .then(res => res.json())
}

export const getUsefullLinks = (language) => {
   return fetch(`${process.env.API_HOST}/settings/usefulLinks?language=${language}`)
      .then(res => res.json())
}

export const getLatestNews = (count, language) => {
   return fetch(`${process.env.API_HOST}/news?include=rubric&sortDirection=desc&language=${language}&fields=id,title,published_date,main_picture&isPublished=true&count=${count}&sortField=published_date`)
   .then(res => res.json())
}

export const getBannersByTitles = (bannersString, language) => {
   return fetch(`${process.env.API_HOST}/tabs?titles=${bannersString}&language=${language}`)
   .then(res => res.json())
}

export const getBanersIncludeFormData= (title,language) => {
   return fetch(`${process.env.API_HOST}/getBanersIncludeFormData?title=${title}&language=${language}`)
   .then(res => res.json())
}

export const getFacebookSettings = () => {
   return fetch(`${process.env.API_HOST}/settings/facebookSettings`)
      .then(res => res.json())
}
  
export const postNewsSubscription = (body) =>
  getFromAPI('/newsSubscriptions', null, 'POST', body).then(
    (data) => data
   );
  
export const putNewsSubscription = (id, body) =>
   getFromAPI(`/newsSubscriptions/${id}`, null, 'PUT', body).then((data) => data);

export const getNewsSubscription = (id, language) =>
   getFromAPI(`/newsSubscriptions/${id}`, {language}, 'GET', null).then((data) => data);
