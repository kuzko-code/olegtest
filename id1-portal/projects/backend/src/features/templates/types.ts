export type get_templates_payload = {
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
};

export type get_template_by_title_payload = {
  title: string;
  selectedFields: string[];
  includedResources: string[];
};
