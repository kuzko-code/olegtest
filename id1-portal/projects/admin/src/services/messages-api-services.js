import { getResourceFromAPI } from '../helpers/api-helpers.js' //(url, query, method = 'GET', body, headers = {})


export const getMessages = async (query) => {
    return await getResourceFromAPI('/messages', query);
};

export const getLastNewMessages = async (count) => {
    const query = {
        sortField: 'id',
        sortDirection: 'desc',
        isRead: 'false',
        start: 0,
        count: count
    };

    return await getMessages(query);
};
export const setReadMessages = async (id) => {
    const body = {
        id: id,
        isRead: true
    };

    return await getResourceFromAPI('/messages', '', 'PUT', body);
};