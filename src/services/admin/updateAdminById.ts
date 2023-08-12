import { adminProfileUpdateInputs } from '../../types/interfaces/inputs';
import { AdminService } from './admin.service';
import { BadRequestErr } from '../../helpers/errors';
import { encrypt } from '../../helpers';

async function updateAdminById(this: AdminService, id: number, data: adminProfileUpdateInputs, hideFileId = true) {
  const admin = await this.getAdminById(id);
  const upData = {
    access_level: data.access_level,
    full_name: data.full_name,
    tel: (encrypt(data.tel) as string) ?? undefined,
    email: (encrypt(data.email) as string) ?? undefined,
    national_id: (encrypt(data.national_id) as string) ?? undefined,
    home_tel: (encrypt(data.home_tel) as string) ?? undefined,
    full_address: (encrypt(data.full_address) as string) ?? undefined,
  };

  if (data.tel && data.tel !== admin.tel) {
    if (await this.getAdminByTel(data.tel as string)) {
      throw new BadRequestErr('این شماره توسط شخصی انتخاب شده است.');
    }
  }

  if (data.email && data.email !== admin.email) {
    if (await this.getAdminByEmail(data.email as string)) {
      throw new BadRequestErr('این ایمیل توسط شخصی انتخاب شده است.');
    }
  }

  if (data.national_id && data.national_id !== admin.national_id) {
    if (await this.getAdminByNationalId(data.national_id as string)) {
      throw new BadRequestErr('این کد ملی توسط شخصی انتخاب شده است.');
    }
  }

  const upAdmin = await this.admins.update({
    where: { id },
    data: upData,
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

  return await this.decryptAdminData(upAdmin);
}

export { updateAdminById };
