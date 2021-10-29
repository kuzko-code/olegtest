import { handler_context } from "../../etc/http/micro_controller";

export type get_portal_folder_size_payload = {
  directory: string[];
  ctx: handler_context;
};
