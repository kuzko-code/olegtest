import { getResourceFromAPI } from '../helpers/api-helpers.js' //(url, query, method = 'GET', body, headers = {})

export const getPortalVersions = async (query) => {
    return await getResourceFromAPI('/portal/version', query);
};

export const getPortalVersionById = async (id, query) => {
    return await getResourceFromAPI(`/portal/version?ids=${id}`, query);
};

export const getPortalVersionByVersion = async (version, query) => {
    return await getResourceFromAPI(`/portal/version/${version}`, query);
};

export const getScheduleUpdateSite = async () => {
    return await getResourceFromAPI('/settings/scheduleUpdate');
};

export const updateScheduleUpdateSite = async (query) => {
    return await getResourceFromAPI('/settings/scheduleUpdate', null, 'PUT', query);
};

export const getPortalUpdateSettings = async () => {
    return await getResourceFromAPI('/settings/portalUpdate');
};

export const getPortalInfo = async () => {
    return await getResourceFromAPI('/portal/info');
};

export const registerPortal = async (query) => {
    return await getResourceFromAPI('/portal/registration', null, 'POST', query);
};

export const updatePortal = async (version) => {
    return await getResourceFromAPI(`/portal/update/${version}`, null, 'PUT', null);
};