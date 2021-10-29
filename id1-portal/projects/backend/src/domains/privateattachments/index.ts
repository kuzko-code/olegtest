import { Validate } from "../../etc/helpers";
import { get_privateattachments_payload } from "./types";
import { PrivateAttachments } from "../../features/privateattachments";
import { Users } from "../../features/users";
const Entities = "privateattachments";

export class privateattachments_with_validation {
  @Validate((args: any) => args[0], {
    name: {
      type: "string",
    },
  })
  static async get_privateattachments(data: get_privateattachments_payload) {
    await Users.checkIfUserHavePermissionToAccess(
      parseInt(data.ctx.userId!),
      Entities,
      data.ctx.role!
    );
    return await PrivateAttachments.get_privateattachments({
      options: data,
    });
  }
}
