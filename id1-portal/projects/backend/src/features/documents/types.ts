export type get_documents_payload = {
  selectedFields: string[];
  aggregate: {
    func: string;
    field: string;
  };
  filters: {
    search: string;
    searchKeys: string[];
  };
  sort: {
    field: string;
    direction: string;
  };
  limit: {
    start?: number;
    count?: number;
  };
};

export type get_document_by_id_payload = {
  id: string;
  selectedFields: string[];
};

export type update_documents_payload = {
  id: string;
  storage_key: string;
  content: string[];
};
