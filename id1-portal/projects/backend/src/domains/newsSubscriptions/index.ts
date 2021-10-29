import { Validate } from "../../etc/helpers";
import { Validation } from "../../helper/validationElements";
import {
  create_news_subscription_payload,
  get_news_subscriptions_payload,
  get_news_subscription_by_uuid_payload,
  delete_news_subscription_by_uuid_payload,
  update_news_subscription_by_uuid_payload,
} from "./types";
import { NewsSubscriptions } from "../../features/newsSubscriptions";
import { Users } from "../../features/users";
import { Helper } from "../../helper";

const Entities = "allNews";

export class news_subscriptions_with_validation {
  @Validate((args) => args[0], {
    status: {
      type: "enum",
      optional: true,
      values: ["Never", "EveryDay", "EveryWeek", "EveryMonth"],
    },
    token: {
      type: "string",
      empty: false,
    },
    email: Validation.email,
    language: Validation.language,
  })
  static async create_news_subscription(
    data: create_news_subscription_payload
  ) {
    await Helper.recaptchaSiteVerify(data.token);
    return await NewsSubscriptions.create_news_subscription({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    filters: {
      type: "object",
      props: {
        uuids: {
          type: "array",
          optional: true,
          empty: false,
          items: {
            type: "uuid",
          },
        },
        search: Validation.search,
        searchKeys: Validation.searchKeys,
        from: {
          type: "date",
          optional: true,
        },
        to: {
          type: "date",
          optional: true,
        },
        status: {
          type: "enum",
          optional: true,
          values: ["Never", "EveryDay", "EveryWeek", "EveryMonth"],
        },
      },
    },
    selectedFields: Validation.selectedFields,
    aggregate: Validation.aggregate,
    language: Validation.language,
    limit: Validation.limit,
    sort: Validation.sort,
  })
  static async get_news_subscriptions(data: get_news_subscriptions_payload) {
    await Users.checkIfUserHavePermissionToAccess(
      parseInt(data.ctx.userId!),
      Entities,
      data.ctx.role!
    );
    return await NewsSubscriptions.get_news_subscriptions({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    uuid: {
      type: "uuid",
      empty: false,
    },
    selectedFields: Validation.selectedFields,
    language: Validation.language,
  })
  static async get_news_subscription_by_uuid(
    data: get_news_subscription_by_uuid_payload
  ) {
    return await NewsSubscriptions.get_news_subscription_by_uuid({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    uuid: {
      type: "uuid",
      empty: false,
    },
  })
  static async delete_news_subscription_by_uuid(
    data: delete_news_subscription_by_uuid_payload
  ) {
    await Users.checkIfUserHavePermissionToAccess(
      parseInt(data.ctx.userId!),
      Entities,
      data.ctx.role!
    );
    return await NewsSubscriptions.delete_news_subscription_by_uuid({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    uuid: {
      type: "uuid",
      empty: false,
    },
    status: {
      type: "enum",
      optional: true,
      values: ["Never", "EveryDay", "EveryWeek", "EveryMonth"],
    },
  })
  static async update_news_subscription_by_uuid(
    data: update_news_subscription_by_uuid_payload
  ) {
    return await NewsSubscriptions.update_news_subscription_by_uuid({
      options: data,
    });
  }
}
