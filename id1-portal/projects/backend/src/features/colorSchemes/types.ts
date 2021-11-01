export type create_color_scheme_payload = {
  color_scheme: string;
  template: string;
};

export type get_color_schemes_payload = {
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
    template: string;
  };
};

export type get_color_scheme_by_id_payload = {
  id: number;
  selectedFields: string[];
};

export type update_color_scheme_payload = {
  id: number;
  color_scheme: string;
};

export type delete_color_scheme_by_id_payload = {
  id: number;
};
