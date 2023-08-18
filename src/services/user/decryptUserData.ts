import { users } from '@prisma/client';
import { decrypt } from '../../helpers';

type encryptedUserType = Omit<users, 'password' | 'profile_pic_fileId'> & { profile_pic_fileId?: string | null };

async function decryptUserData(data: encryptedUserType) {
  const user = { ...data };

  user.email = decrypt(user.email);
  user.national_id = decrypt(user.national_id);
  user.credit_card_num = decrypt(user.credit_card_num);
  user.tel = decrypt(user.tel) as string;

  return user;
}

export { decryptUserData };
