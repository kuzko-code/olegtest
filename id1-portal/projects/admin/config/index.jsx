export const REGULAR_EXPRESSIONS = {
    UUID: /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/,
    EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    LINK: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
    TIME: new RegExp('^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$'),
    TELEPHONE_OR_EMPTY: /^(\d{1,3}[- ]?)?\d{3,9}$|\s*/,
    TELEPHONE: /^(\d{1,3}[- ]?)?\d{3,9}$/,
    DATE: /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/,  //yyyy-mm-dd
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])((?=.*\d)|(?=.*[~!@#$%^&()_+-={};\',.\[\]]))[A-Za-z\d~!@#$%^&()_+-={};\',.\[\]]{8,}$/, //Password (UpperCase, LowerCase, Number and min 8 Chars)
    HTMLTag: /^<.+?>$/,
    GOOGLE_MAP_IFRAME: /<iframe\s+.*?src=("https:\/\/www.google.com\/maps.*").*?<\/iframe>/
};
export default {
    REGULAR_EXPRESSIONS
};
