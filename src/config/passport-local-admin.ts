import { Strategy as LocalStrategy } from 'passport-local';
import { UnauthorizedErr } from '../helpers/errors/index.js';
import { encrypt, decrypt } from '../helpers';
import { prisma } from './prismaConfig.js';
import { compare } from 'bcryptjs';

const strategy = new LocalStrategy({ usernameField: 'tel' }, async (tel, pass, cb) => {
  const encryptedTel = encrypt(tel) as string;
  const admin = await prisma.admins.findUnique({
    where: { tel: encryptedTel },
  });

  if (!admin) {
    return cb(new UnauthorizedErr('شماره همراه یا رمز ورود اشتباه است.'));
  }

  let isPassMatch = await compare(pass, admin.password);

  if (isPassMatch) {
    admin.email = decrypt(admin.email) as string;
    admin.national_id = decrypt(admin.national_id) as string;
    admin.tel = decrypt(admin.tel) as string;
    admin.full_address = decrypt(admin.full_address) as string;
    admin.home_tel = decrypt(admin.home_tel) as string;

    cb(null, admin);
  }
  else {
    return cb(new UnauthorizedErr('شماره همراه یا رمز عبور اشتباه است'));
  }
});

export { strategy as adminLocalStrategy };
