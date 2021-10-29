import { ACCESS_ROLE } from "../../constants";
import { handler_context } from "../../etc/http/micro_controller";

export type create_user_payload = {
  email: string;
  role: ACCESS_ROLE;
  language: string;
  username: string;
  groups: number[];
  ctx: handler_context;
};

export type get_users_payload = {
  selectedFields: string[];
  includedResources: string[];
  ctx: handler_context;
};

export type get_user_by_id_payload = {
  id: number;
};

export type update_user_payload = {
  id: number;
  role: ACCESS_ROLE;
  email: string;
  is_active: boolean;
  username: string;
  groups: number[];
  ctx: handler_context;
};

export type delete_user_payload = {
  id: number;
};
