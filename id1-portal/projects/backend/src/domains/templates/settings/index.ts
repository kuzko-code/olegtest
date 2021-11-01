import { SiteTemplateSettings } from "../../../features/templates/settings";
import { Validate } from "../../../etc/helpers";
import { Validation } from "../../../helper/validationElements";
import { SiteTemplates } from "../../../features/templates";
import {
  get_template_settings_payload,
  get_template_settings_by_title_payload,
  update_template_settings_payload,
} from "./types";
import { AjvServices } from "../../../helper/ajv";
import { Users } from "../../../features/users";
const Entities = "mainSettings";

export class template_settings_with_validation {
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
    language: Validation.language,
  })
  static async get_template_settings(data: get_template_settings_payload) {
    return await SiteTemplateSettings.get_template_settings({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    title: { type: "string", min: 1, empty: false },
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
    language: Validation.language,
  })
  static async get_template_settings_by_title(
    data: get_template_settings_by_title_payload
  ) {
    return await SiteTemplateSettings.get_template_settings_by_title({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    template: { type: "string", min: 1, empty: false },
    settings_object: { type: "any" },
    language: Validation.language,
  })
  static async update_template_settings(
    data: update_template_settings_payload
  ) {
    await Users.checkIfUserHavePermissionToAccess(
      parseInt(data.ctx.userId!),
      Entities,
      data.ctx.role!
    );
    let jsonSchema = await SiteTemplates.getJsonSchemasBySiteTemplate(
      data.template
    );
    jsonSchema
      ? await AjvServices.validate_json_schema(jsonSchema, data.settings_object)
      : (data.settings_object = {});
    return await SiteTemplateSettings.update_template_settings({
      options: data,
    });
  }
}
