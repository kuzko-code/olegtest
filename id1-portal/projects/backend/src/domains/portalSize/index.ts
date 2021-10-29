import { Validate } from "../../etc/helpers";
import { Users } from "../../features/users";
import { PortalSize } from "../../features/portalSize";
import { get_portal_folder_size_payload } from "./types";

const Entities = "portalSize";

export class portal_size_with_validation {
  @Validate((args) => args[0], {
    directory: {
      type: "array",
      items: {
        type: "string",
      },
    },
  })
  static async get_portal_folder_size(data: get_portal_folder_size_payload) {
    await Users.checkIfUserHavePermissionToAccess(
      parseInt(data.ctx.userId!),
      Entities,
      data.ctx.role!
    );
    return PortalSize.get_portal_size({ options: data });
  }
}
