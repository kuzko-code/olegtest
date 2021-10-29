import { REGULAR_EXPRESSIONS } from "../../constants";
import { Users } from "../../features/users";
import { Validate } from "../../etc/helpers";
import { Validation } from "../../helper/validationElements";
import {
  create_user_payload,
  get_users_payload,
  get_user_by_id_payload,
  update_user_payload,
  delete_user_payload,
} from "./types";
import { Helper } from "../../helper";

const allowedFields = [
  "id",
  "role",
  "email",
  "is_active",
  "username",
  "created_date",
];

export class users_with_validation {
  private static _rolePriorities: { [key: string]: number } = {
    root_admin: 1,
    global_admin: 2,
    group_admin: 3,
    content_admin: 4,
  };

  private static isAllowed(currentRole: string, roleToSet: string): boolean {
    return (
      this._rolePriorities[currentRole] < this._rolePriorities[roleToSet] ||
      (this._rolePriorities[currentRole] === 2 &&
        this._rolePriorities[roleToSet] === 2)
    );
  }

  @Validate((args) => args[0], {
    email: "email",
    role: {
      type: "enum",
      values: ["global_admin", "content_admin", "group_admin"],
    },
    username: {
      type: "string",
      empty: false,
    },
    groups: {
      type: "array",
      optional: true,
      empty: false,
      items: {
        type: "number",
        empty: false,
      },
    },
    language: Validation.language,
  })
  static async create_user(data: create_user_payload) {
    if (
      data.ctx.role != "root_admin" &&
      data.ctx.role != "global_admin" &&
      !data.groups
    )
      throw new Error("The 'groups' field is required!.");
    if (!this.isAllowed(data.ctx.role!, data.role)) {
      throw new Error("Not have permission to perform this action.");
    }

    return await Users.create_user({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    selectedFields: Validation.selectedFields,
    includedResources: {
      type: "array",
      optional: true,
      empty: false,
      items: {
        type: "string",
        empty: false,
      },
    },
  })
  static async get_users(data: get_users_payload) {
    data.selectedFields = await Helper.getCommonFields(
      data.selectedFields,
      allowedFields
    );

    return await Users.get_users({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    id: {
      type: "number",
      integer: true,
      positive: true,
    },
  })
  static async get_user_by_id(data: get_user_by_id_payload) {
    return await Users.get_user_by_id({
      options: data,
    });
  }

  private static async checkIfUpdateIsAllowed(data: update_user_payload) {
    const selfUpdate = parseInt(data.ctx.userId!) === data.id;

    if (
      data.ctx.role != "root_admin" &&
      data.ctx.role != "global_admin" &&
      data.groups
    ) {
      const resUserGroups = await Users.get_user_groups(
        parseInt(data.ctx.userId!)
      );
      for (let i = 0; i < data.groups.length; i++) {
        if (resUserGroups.indexOf(data.groups[i]) == -1) {
          throw new Error("Not have permission to add user to these groups.");
        }
      }
    }

    if (selfUpdate) {
      if (data.role) {
        throw new Error("You cannot to change own role.");
      }

      if (data.is_active !== undefined) {
        throw new Error("You cannot to change own activity.");
      }
    } else {
      const user = await Users.get_user_by_id({ options: { id: data.id } });

      if (!this.isAllowed(data.ctx.role!, user.role)) {
        throw new Error("Not have permission to perform this action.");
      }

      if (data.email) {
        throw new Error("You don`t have permission to change email.");
      }

      if (data.role && !this.isAllowed(data.ctx.role!, data.role)) {
        throw new Error("You don`t have permission to set this role.");
      }
    }
  }

  @Validate((args) => args[0], {
    id: {
      type: "number",
      integer: true,
      positive: true,
    },
    role: {
      type: "enum",
      values: ["global_admin", "group_admin", "content_admin"],
      optional: true,
    },
    email: {
      type: "email",
      optional: true,
    },
    is_active: {
      type: "boolean",
      optional: true,
    },
    groups: {
      type: "array",
      optional: true,
      items: {
        type: "number",
        empty: false,
      },
    },
    username: {
      type: "string",
      empty: false,
      optional: true,
    },
  })
  static async update_user(data: update_user_payload) {
    await this.checkIfUpdateIsAllowed(data);

    return await Users.update_user({
      options: data,
    });
  }

  @Validate((args) => args[0], {
    id: {
      type: "number",
      integer: true,
      positive: true,
    },
  })
  static async delete_user(data: delete_user_payload) {
    await this.checkIfdeleteIsAllowed(data);
    return await Users.delete_user({
      options: data,
    });
  }

  private static async checkIfdeleteIsAllowed(data: delete_user_payload) {
    const user = await Users.get_user_by_id({ options: { id: data.id } });
    if (!user) return;
    if (
      !this.isAllowed(data.ctx.role!, user.role) ||
      parseInt(data.ctx.userId!) === data.id
    ) {
      throw new Error("Not have permission to perform this action.");
    }

    if (data.ctx.role != "root_admin" && data.ctx.role != "global_admin") {
      const usersVelongToOneGroup = await Users.usersVelongToOneGroup(
        data.id,
        parseInt(data.ctx.userId!)
      );
      if (!usersVelongToOneGroup) {
        throw new Error("Not have permission to perform this action.");
      }
    }
  }
}
