import { Strategy as LocalStrategy } from 'passport-local';
import { UnauthorizedErr } from '../helpers/errors/index.js';
import { prisma } from './prismaConfig.js';
import { encrypt, decrypt } from '../helpers';
import { compare } from 'bcryptjs';

const strategy = new LocalStrategy({ usernameField: 'login' }, async (login, pass, cb) => {
  const encryptedLogin = encrypt(login) as string;
  const user = await prisma.users.findFirst({
    where: {
      OR: [{ tel: encryptedLogin }, { email: encryptedLogin }],
    },
  });

  if (!user) {
    return cb(new UnauthorizedErr('شماره همراه یا رمز ورود اشتباه است.'));
  }

  let isPassMatch = await compare(pass, user.password);

  if (isPassMatch) {
    user.email = decrypt(user.email);
    user.national_id = decrypt(user.national_id);
    user.credit_card_num = decrypt(user.credit_card_num);
    user.tel = decrypt(user.tel) as string;

    cb(null, user);
  } else {
    return cb(new UnauthorizedErr('شماره همراه یا رمز عبور اشتباه است'));
  }
});

export { strategy as localStrategy };
