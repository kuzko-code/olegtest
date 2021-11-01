import { Validate } from "../../etc/helpers";
import { Validation } from "../../helper/validationElements";
import {
  attachment_payload,
  get_attachments_payload,
  get_attachment_by_id_payload,
  delete_attachment_by_id_payload,
} from "./types";

import { attachments } from "../../features/attachments";

export class attachment_domain {
  @Validate((args) => args[0], {
    userId: {
      type: "number",
      integer: true,
      positive: true,
      convert: true,
    },
    imgWidth: {
      type: "number",
      integer: true,
      positive: true,
      convert: true,
      optional: true,
    },
    imgHeight: {
      type: "number",
      integer: true,
      positive: true,
      convert: true,
      optional: true,
    },
    imgQuality: {
      type: "number",
      integer: true,
      positive: true,
      max: 100,
      convert: true,
      optional: true,
    },
    content: {
      type: "array",
      optional: true,
      items: {
        type: "string",
      },
    },
  })
  static async save_attachments(attachment: attachment_payload) {
    return await attachments.save_attachment({
      options: attachment,
    });
  }

  @Validate((args) => args[0], {
    selectedFields: Validation.selectedFields,
    aggregate: Validation.aggregate,
    filters: {
      type: "object",
      props: {
        search: {
          type: "string",
          optional: true,
          empty: false,
        },
        author: {
          type: "number",
          optional: true,
          integer: true,
          positive: true,
        },
      },
    },
    sort: Validation.sort,
    limit: {
      type: "object",
      props: {
        start: {
          type: "number",
          optional: true,
          integer: true,
        },
        count: {
          type: "number",
          optional: true,
          integer: true,
          min: 1,
        },
      },
    },
  })
  static async get_attachments(data: get_attachments_payload) {
    return await attachments.get_attachments({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    id: {
      type: "uuid",
    },
    selectedFields: {
      type: "array",
      optional: true,
      empty: false,
      items: {
        type: "string",
        empty: false,
      },
    },
  })
  static async get_attachment_by_id(data: get_attachment_by_id_payload) {
    return await attachments.get_attachment_by_id({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    id: {
      type: "uuid",
    },
  })
  static async delete_attachment_by_id(data: delete_attachment_by_id_payload) {
    return await attachments.delete_attachment_by_id({
      options: data,
    });
  }
}
