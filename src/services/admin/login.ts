import { AdminService } from './admin.service';
import { encrypt } from '../../helpers';
import { UnauthorizedErr } from '../../helpers/errors';
import { compare } from 'bcryptjs';

async function login(this: AdminService, tel: string, password: string) {
  const encryptedTel = encrypt(tel) as string;
  const admin = await this.admins.findFirst({
    where: { tel: encryptedTel },
  });

  if (!admin) {
    throw new UnauthorizedErr('شماره همراه یا رمز ورود اشتباه است.');
  }

  let isPassMatch = await compare(password, admin.password);

  if (isPassMatch) {
    return await this.decryptAdminData(admin);
  } else {
    throw new UnauthorizedErr('شماره همراه یا رمز ورود اشتباه است.');
  }
}

export { login };
