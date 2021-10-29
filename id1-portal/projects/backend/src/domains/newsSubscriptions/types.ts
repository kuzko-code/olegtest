import { handler_context } from "../../etc/http/micro_controller";

export type create_news_subscription_payload = {
  email: string;
  language: string;
  status: string;
  token: string;
};

export type get_news_subscriptions_payload = {
  selectedFields: string[];
  filters: {
    uuids: string[];
    search: string;
    searchKeys: string[];
    from: Date;
    to: Date;
    status: string;
  };
  aggregate: {
    func: string;
    field: string;
  };
  sort: {
    field: string;
    direction: string;
  };
  limit: {
    start: number;
    count: number;
  };
  language: string;
  ctx: handler_context;
};

export type get_news_subscription_by_uuid_payload = {
  uuid: string;
  selectedFields: string[];
  language: string;
};

export type delete_news_subscription_by_uuid_payload = {
  uuid: string;
  ctx: handler_context;
};

export type update_news_subscription_by_uuid_payload = {
  uuid: string;
  status: string;
};
