import { getFromAPI } from '../helpers/api-helpers.js'
import { isAuth } from './auth-service.js'

const visitorsURL = '/visitors';
const visitorsAuthURL = `${visitorsURL}/auth`;

export const signUp = async (body) =>
    await getFromAPI(visitorsURL, null, 'POST', body);

export const logIn = async (body) =>
    await getFromAPI(`${visitorsAuthURL}/login`, null, 'POST', body);

export const updateCode = async (body) =>
    await getFromAPI(`${visitorsAuthURL}/updateCode`, null, 'PUT', body);

export const confirmPassword = async (body) =>
    await getFromAPI(`${visitorsAuthURL}/confirmationPassword`, null, 'PUT', body);

export const resetPassword = async (body) =>
    await getFromAPI(`${visitorsAuthURL}/resetPassword`, null, 'PUT', body);

export const getCurrentUser = async () => {
    if (!isAuth()) return null;

    return new Promise(function (resolve, reject) {
        getFromAPI(`${visitorsAuthURL}/user`)
            .then(res => resolve(res))
            .catch(err => {
                console.error('Error while checking current user :>> ', err);
                reject(err);
            });

    })
}

export const updateUser = async (body) =>
    new Promise(function (resolve, reject) {
        getFromAPI(visitorsURL, null, 'PUT', body)
            .then(res => resolve(res))
            .catch(err => {
                console.error('Error while updating the user :>> ', err);
                reject(err);
            });
    })

export const deleteUser = async () =>
    await getFromAPI(`${visitorsAuthURL}/user`, null, 'DELETE');
