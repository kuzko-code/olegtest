const StorageKeyForBearerToken = 'token';
const EventTypeForBearerToken = 'storageCustom';

export function getStorageKeyForBearerToken() {
    return StorageKeyForBearerToken;
}

export function getEventTypeForBearerToken() {
    return EventTypeForBearerToken;
}

export function getBearerToken() {
    return localStorage.getItem(StorageKeyForBearerToken);
}

export function isAuth() {
    return getBearerToken() !== null;
};

export function setBearerToken(token) {
    localStorage.setItem(StorageKeyForBearerToken, 'Bearer ' + token);

    const e = new Event(EventTypeForBearerToken);
    e.originalEvent = {
      key: StorageKeyForBearerToken,
    };
    document.dispatchEvent(e);
}

export function resetBearerToken() {
    localStorage.removeItem(StorageKeyForBearerToken);

    const e = new Event(EventTypeForBearerToken);
    e.originalEvent = {
        key: StorageKeyForBearerToken,
    };
    document.dispatchEvent(e);
}
