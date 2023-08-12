import { AdminService } from "./admin.service";
import { imageKit } from "../../config";

async function removeAdminProfilePicById(this: AdminService, id: number, fileId: string) {
  await imageKit.deleteFile(fileId);
  return await this.admins.update({
    where: { id },
    data: {
      profile_pic_fileId: null,
      profile_pic_url: null,
    }
  });
}

export { removeAdminProfilePicById };
