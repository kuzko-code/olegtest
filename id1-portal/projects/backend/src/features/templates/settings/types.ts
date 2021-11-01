export type get_template_settings_payload = {
  selectedFields: string[];
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
  filters: {
    search: string;
    searchKeys: string[];
  };
  includedResources: string[];
  language: string;
};

export type get_template_settings_by_title_payload = {
  title: string;
  selectedFields: string[];
  includedResources: string[];
  language: string;
};

export type update_template_settings_payload = {
  settings_object: any;
  template: string;
  language: string;
};
