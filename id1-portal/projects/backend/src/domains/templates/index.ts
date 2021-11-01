import { SiteTemplates } from "../../features/templates";
import { Validate } from "../../etc/helpers";
import { Validation } from "../../helper/validationElements";
import { get_templates_payload, get_template_by_title_payload } from "./types";

export class template_with_validation {
  @Validate((args) => args[0], {
    selectedFields: Validation.selectedFields,
    aggregate: Validation.aggregate,
    sort: Validation.sort,
    filters: {
      type: "object",
      props: {
        search: Validation.search,
        searchKeys: Validation.searchKeys,
      },
    },
    includedResources: Validation.includedResources,
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
  static async get_templates(data: get_templates_payload) {
    return await SiteTemplates.get_templates({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    title: { type: "string" },
    selectedFields: {
      type: "array",
      optional: true,
      empty: false,
      items: {
        type: "string",
        empty: false,
      },
    },
    includedResources: Validation.includedResources,
  })
  static async get_template_by_title(data: get_template_by_title_payload) {
    return await SiteTemplates.get_template_by_title({
      options: data,
    });
  }
}
