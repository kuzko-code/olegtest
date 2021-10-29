export const EXCEPTION_MESSAGES = {
  ON_ROUTE_NOT_FOUND_EXCEPTION: "Not found", // 404
  ON_WRONG_INPUT_EXCEPTION: "Please check input params", // 400
  ON_AUTH_FAILED_EXCEPTION: "Authorization error", // 403
  ON_UNHANDLED_ERROR_EXCEPTION: "Internal server error", // 500
  ON_ACCESS_DENIED_EXCEPTION: "Access denied",
  ON_RECORD_NOT_FOUND: "Record not found",
  ON_NAME_TOO_LONG: "Name is too long",
  ON_USER_ACTIVATION_EXCEEDED: "Activation Limit Exceeded",
  ON_INVALID_CODE: "Invalid code",
  ON_USER_IS_NOT_DEFINED: "User is not defined",
  ON_RECAPTCHA_VALIDATION_FAILED: "Recaptcha validation failed",
  ON_USER_WAS_ACTIVATED: "User was activated",
  ON_EXPIRED_CODE: "The code has expired",
};

export const REGULAR_EXPRESSIONS = {
  LINK: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
  UUID: /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/,
  EMAIL:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  TIME: new RegExp("^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$"),
  TELEPHONE_OR_EMPTY: /^(\d{1,3}[- ]?)?\d{3,9}$|\s*/,
  TELEPHONE: /^(\d{1,3}[- ]?)?\d{3,9}$/,
  DATE: /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/, //yyyy-mm-dd
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])((?=.*\d)|(?=.*[~!@#$%^&()_+-={};\',.\[\]]))[A-Za-z\d~!@#$%^&()_+-={};\',.\[\]]{8,}$/, //Password (UpperCase, LowerCase, Number/SpecialChar and min 8 Chars)
  ATTACHMENTS: /^\/attachments\//,
};

export enum ACCESS_ROLE {
  admin = "admin",
}

export const AUTH = {
  NUMBER_OF_ACTIVATION_REQUESTS: 4,
};

export const DEFAULT_LANGUAGE = "en";

export const EMAIL_PATTERNS = {
  SENDER: "Information_portal <foo@example.com>",
  VERIFICATION_SUBJECT: "Welcome to system",
  VERIFICATION_TEXT: "Welcome to system",
};

export default {
  EXCEPTION_MESSAGES,
  REGULAR_EXPRESSIONS,
  ACCESS_ROLE,
};
