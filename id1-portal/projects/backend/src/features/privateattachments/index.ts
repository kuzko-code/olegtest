import { method_payload } from "../base_api_image";
import { get_privateattachments_payload } from "./types";
import fs from "fs";
import { CONFIGURATIONS } from "../../config";

class Api {
  public async get_privateattachments({
    options: { name },
  }: method_payload<get_privateattachments_payload>) {
    const dir = CONFIGURATIONS.UPLOAD.PRIVATE_LOCAL_PATH as string;
    let fileBuff: Buffer;
    try {
      fileBuff = await fs.readFileSync(dir + "/" + decodeURIComponent(name));
    } catch (e) {
      console.log("Error [Products Mail File]:\n", e);
      throw new Error("Cannot find file in system");
    }
    return { fileContent: fileBuff, fileName: name };
  }
}

export const PrivateAttachments = new Api();
