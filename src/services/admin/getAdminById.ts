import { NotFoundErr } from "../../helpers/errors";
import { AdminService } from "./admin.service";

async function getAdminById(this: AdminService, id: number, hideFileId = true) {
  const admin = await this.admins.findUnique({
    where: { id },
    select: {
      id: true,
      access_level: true,
      full_name: true,
      tel: true,
      email: true,
      national_id: true,
      home_tel: true,
      full_address: true,
      profile_pic_url: true,
      profile_pic_fileId: !hideFileId,
    },
  });

  if (admin === null) {
    throw new NotFoundErr('ادمینی با این شناسه پیدا نشد');
  }

  return await this.decryptAdminData(admin);
}

export { getAdminById };
