import { REGULAR_EXPRESSIONS } from "../../constants";
import { Visitors } from "../../features/visitors";
import { Validate } from "../../etc/helpers";
import { Validation } from "../../helper/validationElements";
import {
  create_visitor_payload,
  get_visitors_payload,
  get_visitor_by_id_payload,
  update_visitor_payload,
  delete_visitor_payload,
  delete_me_payload,
} from "./types";
import { Helper } from "../../helper";
import { Users } from "../../features/users";
import { EXCEPTION_MESSAGES } from "../../constants";
const Entities = "visitors";
import { handler_context } from "../../etc/http/micro_controller";

const allowedFields = [
  "id",
  "role",
  "email",
  "is_active",
  "first_name",
  "last_name",
  "patronymic",
  "phone",
  "birthday",
  "created_date",
];

export class visitors_with_validation {
  @Validate((args) => args[0], {
    email: "email",
    password: {
      type: "string",
      pattern: REGULAR_EXPRESSIONS.PASSWORD,
    },
    // confirm_password: {
    //   type: "string",
    //   pattern: REGULAR_EXPRESSIONS.PASSWORD
    // },
    first_name: {
      type: "string",
      min: 1,
      max: 100,
      optional: true,
    },
    last_name: {
      type: "string",
      min: 1,
      max: 100,
      optional: true,
    },
    patronymic: {
      type: "string",
      max: 100,
      default: null,
      optional: true,
    },
    language: Validation.language,
  })
  static async create_visitor(data: create_visitor_payload) {
    await Helper.recaptchaSiteVerify(data.token);

    return await Visitors.create_visitor({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    selectedFields: Validation.selectedFields,
    aggregate: Validation.aggregate,
    filters: {
      type: "object",
      props: {
        ids: {
          type: "array",
          optional: true,
          empty: false,
          items: {
            type: "number",
            integer: true,
            positive: true,
          },
        },
        search: Validation.search,
        searchKeys: Validation.searchKeys,
        is_active: {
          type: "boolean",
          optional: true,
        },
      },
    },
    sort: Validation.sort,
    limit: Validation.limit,
  })
  static async get_visitors(data: get_visitors_payload) {
    await Users.checkIfUserHavePermissionToAccess(
      parseInt(data.ctx.userId!),
      Entities,
      data.ctx.role!
    );
    data.selectedFields = await Helper.getCommonFields(
      data.selectedFields,
      allowedFields
    );
    return await Visitors.get_visitors({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    id: {
      type: "number",
      integer: true,
      positive: true,
    },
    selectedFields: Validation.selectedFields,
  })
  static async get_visitor_by_id(data: get_visitor_by_id_payload) {
    await this.checkIfCurrentVisitor(data.id, data.ctx);
    data.selectedFields = await Helper.getCommonFields(
      data.selectedFields,
      allowedFields
    );
    return await Visitors.get_visitor_by_id({
      options: data,
    });
  }

  private static async checkIfCurrentVisitor(
    userId: number,
    ctx: handler_context
  ) {
    const self = parseInt(ctx.userId!) === userId || ctx.role != "visitor";

    if (!self) {
      const ex = new Error(EXCEPTION_MESSAGES.ON_ACCESS_DENIED_EXCEPTION);
      ex.statusCode = 403;
      throw ex;
    }
  }

  @Validate((args) => args[0], {
    id: {
      type: "number",
      integer: true,
      positive: true,
    },
    first_name: {
      type: "string",
      min: 1,
      max: 100,
      optional: true,
    },
    last_name: {
      type: "string",
      min: 1,
      max: 100,
      optional: true,
    },
    patronymic: {
      type: "string",
      max: 100,
      default: null,
      optional: true,
    },
    phone: Validation.optionalPhone,
    birthday: {
      type: "date",
      convert: true,
      optional: true,
    },
  })
  static async update_visitor(data: update_visitor_payload) {
    // await this.checkIfCurrentVisitor(data.id, data.ctx);
    const nowDate = new Date(Date.now());

    if (data.birthday && nowDate < new Date(data.birthday))
      throw new Error(`Field birthday cannot be in the future.`);
    return await Visitors.update_visitor({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    id: {
      type: "number",
      integer: true,
      positive: true,
    },
  })
  static async delete_visitor(data: delete_visitor_payload) {
    await Users.checkIfUserHavePermissionToAccess(
      parseInt(data.ctx.userId!),
      Entities,
      data.ctx.role!
    );
    return await Visitors.delete_visitor({
      options: data,
    });
  }

  static async delete_me(data: delete_me_payload) {
    return await Visitors.delete_visitor({
      options: data,
    });
  }
}
