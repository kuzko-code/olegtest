import { handler_context } from "../../etc/http/micro_controller";

export type create_visitor_payload = {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  patronymic: string;
  token: string;
  language: string;
};

export type get_visitors_payload = {
  selectedFields: string[];
  includedResources: string[];
  aggregate: {
    func: string;
    field: string;
  };
  filters: {
    ids: number[];
    search: string;
    searchKeys: string[];
    is_active: boolean;
  };
  sort: {
    field: string;
    direction: string;
  };
  limit: {
    start: number;
    count: number;
  };
  ctx: handler_context;
};
export type get_visitor_by_id_payload = {
  id: number;
  selectedFields: string[];
  ctx: handler_context;
};

export type update_visitor_payload = {
  id: number;
  first_name: string;
  last_name: string;
  patronymic: string;
  phone: string;
  birthday: Date;
  ctx: handler_context;
};

export type delete_visitor_payload = {
  id: number;
  ctx: handler_context;
};

export type delete_me_payload = {
  id: number;
};
