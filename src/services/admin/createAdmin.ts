import { AdminService } from './admin.service';
import { createAdminInputs } from '../../types/interfaces/inputs';

type createAdminDataType = Omit<createAdminInputs, 'repeatPass'>;

async function createAdmin(this: AdminService, data:createAdminDataType) {
  const newAdmin = await this.admins.create({ data });
  const { password, profile_pic_fileId, ...adminInfo } = newAdmin;

  return this.decryptAdminData(adminInfo);
}

export { createAdmin };
