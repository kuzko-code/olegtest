import { REGULAR_EXPRESSIONS } from "../../constants";
import { user_auth } from "../../features/auth";
import { Validate } from "../../etc/helpers";
import { Validation } from "../../helper/validationElements";
import {
  login_payload,
  reset_password_payload,
  change_password_payload,
  confirmation_password,
  update_user_code_password,
} from "./types";

export class authorization {
  @Validate((args) => args[0], {
    email: "email",
    password: { type: "string" }, //Password (UpperCase, LowerCase, Number/SpecialChar and min 8 Chars)
    keepSignedIn: { type: "boolean", optional: true },
  })
  static async user_login(user_data: login_payload) {
    return await user_auth.user_login({
      options: user_data,
    });
  }

  @Validate((args) => args[0], {
    email: "email",
    code: {
      type: "string",
      min: 6,
      max: 6,
      empty: false,
    },
    typeOfUser: {
      type: "string",
      optional: true,
    },
    password: {
      type: "string",
      pattern: REGULAR_EXPRESSIONS.PASSWORD,
    },
    language: Validation.language,
  })
  static async reset_password(data: reset_password_payload) {
    return await user_auth.reset_password({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    userId: {
      type: "number",
      integer: true,
      positive: true,
    },
    oldPassword: {
      type: "string",
      empty: false,
    },
    newPassword: {
      type: "string",
      pattern: REGULAR_EXPRESSIONS.PASSWORD,
    },
  })
  static async change_password(data: change_password_payload) {
    return await user_auth.change_password({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    email: "email",
    code: {
      type: "string",
      min: 6,
      max: 6,
      empty: false,
    },
    typeOfUser: {
      type: "string",
      optional: true,
    },
    language: Validation.language,
  })
  static async confirmation_password(data: confirmation_password) {
    return await user_auth.confirmation_password({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    email: "email",
    typeOfUser: {
      type: "string",
      optional: true,
    },
    language: Validation.language,
  })
  static async update_user_code(data: update_user_code_password) {
    return await user_auth.update_user_code({
      options: data,
    });
  }
}
