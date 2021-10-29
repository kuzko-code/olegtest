import { Validate } from "../../etc/helpers";
import { tabsSchemaApi } from "../../features/schemas";

import {
  get_or_delete_tabs_schema_payload,
  update_tabs_schema_payload,
  create_tabs_schema_payload,
} from "./types";

export class tabs_schema_with_validation {
  @Validate((args) => args[0], {
    ids: {
      type: "array",
      optional: true,
      empty: true,
      items: {
        type: "number",
        integer: true,
        positive: true,
      },
    },
  })
  static async get_tabs_schema(data: get_or_delete_tabs_schema_payload) {
    return await tabsSchemaApi.get_tabs_schema({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    json_schema: {
      type: "any",
      empty: true,
    },
    ui_schema: {
      type: "any",
      empty: true,
    },
  })
  static async create_tabs_schema(data: create_tabs_schema_payload) {
    return await tabsSchemaApi.create_tabs_schema({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    id: {
      type: "number",
      empty: false,
    },
    json_schema: {
      type: "any",
      empty: true,
    },
    ui_schema: {
      type: "any",
      empty: true,
    },
  })
  static async update_tabs_schema(data: update_tabs_schema_payload) {
    return await tabsSchemaApi.update_tabs_schema({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    ids: {
      type: "array",
      optional: true,
      empty: false,
      items: {
        type: "number",
        integer: true,
        positive: true,
      },
    },
  })
  static async delete_tabs_schema(data: get_or_delete_tabs_schema_payload) {
    return await tabsSchemaApi.delete_tabs_schema({
      options: data,
    });
  }
}
