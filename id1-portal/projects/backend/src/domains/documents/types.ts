import { handler_context } from "../../etc/http/micro_controller";

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
  language: string;
  ctx: handler_context;
};

export type get_document_by_id_payload = {
  id: string;
  selectedFields: string[];
};

export type save_document_payload = {
  bodyFile: any;
  userId: number;
  imgWidth: number;
  imgHeight: number;
  imgQuality: number;
  content: string[];
  ctx: handler_context;
};

export type update_documents_payload = {
  id: string;
  storage_key: string;
  content: string[];
  ctx: handler_context;
};

export type delete_document_by_id_payload = {
  id: string;
  ctx: handler_context;
};
