import { admins } from '@prisma/client';
import { decrypt } from '../../helpers';

type encryptedAdminType = Omit<admins, 'password' | 'profile_pic_fileId'> & { profile_pic_fileId?: string | null };

async function decryptAdminData(data: encryptedAdminType) {
  const admin = { ...data };

  admin.email = decrypt(admin.email) as string;
  admin.national_id = decrypt(admin.national_id) as string;
  admin.tel = decrypt(admin.tel) as string;
  admin.full_address = decrypt(admin.full_address) as string;
  admin.home_tel = decrypt(admin.home_tel) as string;

  return admin;
}

export { decryptAdminData };
