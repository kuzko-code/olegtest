import { color_schemes } from "../../features/colorSchemes";
import { Validate } from "../../etc/helpers";
import { Validation } from "../../helper/validationElements";
import {
  create_color_scheme_payload,
  get_color_schemes_payload,
  get_color_scheme_by_id_payload,
  update_color_scheme_payload,
  delete_color_scheme_by_id_payload,
} from "./types";
import { Users } from "../../features/users";
const Entities = "layout";

export class color_schemes_with_validation {
  @Validate((args) => args[0], {
    template: { type: "string", min: 1, empty: false },
    color_scheme: {
      type: "array",
      empty: false,
      items: {
        type: "string",
        min: 3,
      },
    },
  })
  static async create_color_scheme(data: create_color_scheme_payload) {
    await Users.checkIfUserHavePermissionToAccess(
      parseInt(data.ctx.userId!),
      Entities,
      data.ctx.role!
    );
    return await color_schemes.create_color_scheme({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    selectedFields: Validation.selectedFields,
    aggregate: Validation.aggregate,
    sort: Validation.sort,
    filters: {
      type: "object",
      props: {
        template: { type: "string", optional: true },
      },
    },
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
  static async get_color_schemes(data: get_color_schemes_payload) {
    return await color_schemes.get_color_schemes({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    id: Validation.id,
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
  static async get_color_scheme_by_id(data: get_color_scheme_by_id_payload) {
    return await color_schemes.get_color_scheme_by_id({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    id: Validation.id,
    color_scheme: {
      type: "array",
      empty: false,
      items: {
        type: "string",
        min: 3,
      },
    },
  })
  static async update_color_scheme(data: update_color_scheme_payload) {
    await Users.checkIfUserHavePermissionToAccess(
      parseInt(data.ctx.userId!),
      Entities,
      data.ctx.role!
    );
    if (await color_schemes.isDefaultColorScheme(data.id))
      throw new Error(`It is forbidden to update the default color scheme.`);

    return await color_schemes.update_color_scheme({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    id: Validation.id,
  })
  static async delete_color_scheme_by_id(
    data: delete_color_scheme_by_id_payload
  ) {
    await Users.checkIfUserHavePermissionToAccess(
      parseInt(data.ctx.userId!),
      Entities,
      data.ctx.role!
    );
    if (await color_schemes.isDefaultColorScheme(data.id))
      throw new Error(`It is forbidden to delete the default color scheme.`);

    return await color_schemes.delete_color_scheme_by_id({
      options: data,
    });
  }
}
