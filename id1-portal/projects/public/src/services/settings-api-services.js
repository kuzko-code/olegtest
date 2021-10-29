import { getFromAPI } from '../helpers/api-helpers.js' //getFromAPI(url, query, method = 'GET', body, headers = {})

export const getSettings = async (query) => {
    return await getFromAPI('/settings', query);
}
export const getSettingsByTitles = async (language, titles) => {
    return await getFromAPI(`/settings?language=${language}&titles=${titles}`);
}
export const getLocationOfBanners = async (query) => {
    return await getFromAPI(`/settings/locationOfBanners`, query);
}
export const getLocationOfBannersPreview = async (query) => {
    return await getFromAPI(`/settings/locationOfBanners/preview`, query);
}
