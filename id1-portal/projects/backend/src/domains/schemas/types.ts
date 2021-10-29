import { handler_context } from "../../etc/http/micro_controller";

export type get_or_delete_tabs_schema_payload = {
  ids: number[];
};

export type create_tabs_schema_payload = {
  json_schema: any;
  ui_schema: any;
  ctx: handler_context;
};

export type update_tabs_schema_payload = {
  id: number;
  json_schema: any;
  ui_schema: any;
  ctx: handler_context;
};