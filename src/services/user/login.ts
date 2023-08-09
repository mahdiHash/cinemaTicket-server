import { UserService } from './user.service';
import { encrypt } from '../../helpers';
import { UnauthorizedErr } from '../../helpers/errors';
import { compare } from 'bcryptjs';

async function login(this: UserService, login: string, password: string) {
  const encryptedLogin = encrypt(login) as string;
  const user = await this.users.findFirst({
    where: {
      OR: [{ tel: encryptedLogin }, { email: encryptedLogin }],
    },
  });

  if (!user) {
    throw new UnauthorizedErr('شماره همراه یا رمز ورود اشتباه است.');
  }

  let isPassMatch = await compare(password, user.password);

  if (isPassMatch) {
    return await this.decryptUserData(user);
  } else {
    throw new UnauthorizedErr('شماره همراه یا رمز ورود اشتباه است.');
  }
}

export { login };
