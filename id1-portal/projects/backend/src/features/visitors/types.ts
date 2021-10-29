import { handler_context } from "../../etc/http/micro_controller";

export type create_visitor_payload = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  patronymic: string;
  language: string;
};

export type get_visitors_payload = {
  selectedFields: string[];
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
};

export type update_visitor_payload = {
  id: number;
  // is_active: boolean,
  first_name: string;
  last_name: string;
  patronymic: string;
  phone: string;
  birthday: Date;
};

export type delete_visitor_payload = {
  id: number;
};
