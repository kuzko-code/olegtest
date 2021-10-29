import { getResourceFromAPI } from '../helpers/api-helpers.js' //(url, query, method = 'GET', body, headers = {})

//Telegram-bot
export const getTelegramBotSettings = async () => {
    return await getResourceFromAPI('/settings/telegramNotification');
};

export const updateTelegramBotSettings = async (query) => {
  return await getResourceFromAPI('/settings/telegramNotification', null, 'PUT', query);
};
//Facebook-bot
export const getFacebookBotSettings = async () => {
  return await getResourceFromAPI('/settings/facebookBotSettings');
};

export const updateFacebookBotSettings = async (query) => {
return await getResourceFromAPI('/settings/facebookBotSettings', null, 'PUT', query);
};
//Facebook-plugins
export const getFacebookSettings = async () => {
  return await getResourceFromAPI('/settings/facebookSettings');
};

export const updateFacebookSettings = async (query) => {
return await getResourceFromAPI('/settings/facebookSettings', null, 'PUT', query);
};