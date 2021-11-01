import { handler_context } from "../../etc/http/micro_controller";

export type get_admin_navigation_payload = {
  ctx: handler_context;
};

export type get_banners_include_form_data = {
  title: string;
  includedResources: string[];
  language: string;
};

export type get_or_delete_settings_payload = {
  titles: string[];
  language: string;
};

export type get_settings_by_title_payload = {
  title: string;
  language: string;
};

export type get_setting_schema_by_id_payload = {
  settings: {
    title: string;
    settings_object: any;
    settings_schema_id: number;
  }[];
  language: string;
};

export type update_settings_payload = {
  settings: {
    title: string;
    settings_object: any;
  }[];
  language: string;
};

export type get_general_settings_payload = {
  language: string;
  mode: string;
};
