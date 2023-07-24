import { prisma } from "../../config";
import { adminProfileUpdateInputs } from "../../types/interfaces/inputs";
import { AdminService } from "./admin.service";
import { BadRequestErr } from "../../helpers/errors";

async function updateAdminById(this: AdminService, id: number, data: adminProfileUpdateInputs) {
  const admin = await this.getAdminById(id);

  if (data.tel && (data.tel !== admin?.tel)) {
    if (await this.getAdminByTel(data.tel as string)) {
      throw new BadRequestErr('این شماره توسط شخصی انتخاب شده است.');
    }
  }

  if (data.email && (data.email !== admin?.email)) {
    if (await this.getAdminByEmail(data.email as string)) {
      throw new BadRequestErr('این ایمیل توسط شخصی انتخاب شده است.');
    }  
  }
  
  if (data.national_id && (data.national_id !== admin?.national_id)) {
    if (await this.getAdminByNationalId(data.national_id as string)) {
      throw new BadRequestErr('این کد ملی توسط شخصی انتخاب شده است.');
    }  
  }

  return await prisma.admins.update({
    where: { id },
    data
  });
}

export { updateAdminById };
