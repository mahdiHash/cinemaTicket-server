import { Strategy as LocalStrategy } from 'passport-local';
import { compare } from 'bcryptjs';
import { encrypt } from '../helpers/index.js';
import { UnauthorizedErr } from '../helpers/errors/index.js';
import { prisma } from './';

let strategy = new LocalStrategy(
  { usernameField: "tel" },
  async (tel, pass, cb) => {
    let encryptedTel = encrypt(tel) as string;
    let user = await prisma.users.findUnique({
      where: {
        tel: encryptedTel,
      }
    });

    if (!user) {
      return cb(new UnauthorizedErr('شماره همراه یا رمز ورود اشتباه است.'));
    }

    let isPassMatch = await compare(pass, user.password);

    if (isPassMatch) {
      cb(null, user);
    }
    else {
      cb(new UnauthorizedErr('شماره همراه یا رمز ورود اشتباه است.'));
    }
  }
);

export { strategy as localStrategy };
