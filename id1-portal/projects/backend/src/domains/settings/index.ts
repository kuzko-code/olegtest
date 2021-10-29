import { site_settings } from "../../features/settings";
import { Validate } from "../../etc/helpers";
import { Validation } from "../../helper/validationElements";
import {
  get_or_delete_settings_payload,
  create_settings_payload,
  update_settings_payload,
  get_settings_by_title_payload,
  get_admin_navigation_payload,
} from "./types";
import Ajv from "ajv";
import { Users } from "../../features/users";
import { AjvServices } from "../../helper/ajv";

export class settings_with_validation {
  static async get_admin_navigation(data: get_admin_navigation_payload) {
    return await site_settings.get_admin_navigation({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    titles: {
      type: "array",
      optional: true,
      empty: false,
      items: {
        type: "string",
        min: 3,
      },
    },
    language: Validation.language,
  })
  static async get_site_settings(data: get_or_delete_settings_payload) {
    return await site_settings.get_site_settings({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    title: {
      type: "string",
      min: 3,
    },
    language: Validation.language,
  })
  static async get_site_settings_by_title(data: get_settings_by_title_payload) {
    return await site_settings.get_site_settings_by_title({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    settings: {
      type: "array",
      empty: false,
      items: {
        type: "object",
        props: {
          title: { type: "string", min: 3 },
          settings_object: { type: "any" },
          settings_schema_id: { type: "number" },
        },
      },
    },
    language: Validation.language,
  })
  static async create_site_settings(data: create_settings_payload) {
    const res = await site_settings.get_setting_schema_by_id({ options: data });
    for (let s = 0; s < res.length; s++) {
      AjvServices.validate_json_schema(
        res[s].settings_schema,
        data.settings[s].settings_object
      );
    }
    return await site_settings.create_site_settings({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    settings: {
      type: "array",
      empty: false,
      items: {
        type: "object",
        props: {
          title: { type: "string", min: 3 },
          settings_object: { type: "any" },
        },
      },
    },
    language: Validation.language,
  })
  static async update_site_settings(data: update_settings_payload) {
    await this.validate_site_settings(data);

    return await site_settings.update_site_settings({
      options: data,
    });
  }

  private static async validate_site_settings({
    settings,
    ctx,
    language,
  }: update_settings_payload) {
    let permission: any[] = [];

    const rows = await site_settings.get_settings_schema({
      options: { settings, language },
    });
    const settingsWithSchema = settings.map((s) => {
      if (
        s.title === "layout" ||
        s.title === "siteLogos" ||
        s.title === "contacts"
      ) {
        permission.push("mainSettings");
      } else if (
        s.title === "mainPageSliders" ||
        s.title === "mainPageRubrics"
      ) {
        permission.push("newsSettings");
      } else if (s.title === "languagesOnTheAdminSite") {
        permission.push("languageSettings");
      } else if (s.title === "GovSites" || s.title === "linkEditor") {
        permission.push("linksSettings");
      } else if (
        s.title === "facebookSettings" ||
        s.title === "telegramNotification"
      ) {
        permission.push("socialNetworks");
      } else {
        permission.push(s.title);
      }

      return Object.assign(
        s,
        rows.find((r) => r.title == s.title)
      );
    });

    await Users.checkIfUserHavePermissionForSettings(
      parseInt(ctx.userId!),
      permission,
      ctx.role!
    );

    const ajv = new Ajv();
    for (let s of settingsWithSchema) {
      // if (!s.settings_schema || !ajv.validate(s.settings_schema, s.settings_object)) {
      // 	const preconditionFailedEx = new Error('The setting value does not match the schema');
      // 	preconditionFailedEx.statusCode = 412;
      // 	throw preconditionFailedEx;
      // }
    }
  }

  @Validate((args) => args[0], {
    titles: {
      type: "array",
      empty: false,
      items: {
        type: "string",
        min: 3,
      },
    },
  })
  static async delete_site_settings(data: get_or_delete_settings_payload) {
    return await site_settings.delete_site_settings({
      options: data,
    });
  }
}
