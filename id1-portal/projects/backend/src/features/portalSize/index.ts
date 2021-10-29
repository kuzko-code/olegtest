import { method_payload } from "../base_api_image";
import { get_portal_folder_size_payload } from "./types";

class Api {
  public async get_portal_size({
    options: { directory },
  }: method_payload<get_portal_folder_size_payload>) {
    var fsUtils = require("nodejs-fs-utils");
    let bytes: number = 0;
    for (let dir of directory) {
      bytes += await fsUtils.fsizeSync(dir);
    }
    return {
      size: this.convertBytes(bytes),
    };
  }

  private convertBytes(bytes: number) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    if (bytes == 0) {
      return "n/a";
    }

    const size = Math.floor(Math.log(bytes) / Math.log(1024));
    if (size == 0) {
      return bytes + " " + sizes[size];
    }
    return (bytes / Math.pow(1024, size)).toFixed(2) + " " + sizes[size];
  }
}

export const PortalSize = new Api();
