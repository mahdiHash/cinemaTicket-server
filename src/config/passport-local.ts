import { Strategy as LocalStrategy } from 'passport-local';
import { compare } from 'bcryptjs';
import { encrypt } from '../helpers/index.js';
import { UnauthorizedErr } from '../helpers/errors/index.js';
import { prisma } from './';

let strategy = new LocalStrategy(
  { usernameField: 'login' },
  async (login, pass, cb) => {
    let encryptedLogin = encrypt(login) as string;
    let user = await prisma.users.findFirst({
      where: {
        OR: [{ tel: encryptedLogin }, { email: encryptedLogin }],
      },
    });

    if (!user) {
      return cb(new UnauthorizedErr('شماره همراه یا رمز ورود اشتباه است.'));
    }

    let isPassMatch = await compare(pass, user.password);

    if (isPassMatch) {
      cb(null, user);
    } else {
      cb(new UnauthorizedErr('شماره همراه یا رمز ورود اشتباه است.'));
    }
  }
);

export { strategy as localStrategy };
