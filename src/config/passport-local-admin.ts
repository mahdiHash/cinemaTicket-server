import { Strategy as LocalStrategy } from 'passport-local';
import { UnauthorizedErr } from '../helpers/errors/index.js';
import { AdminService } from '../services/index.js';

const Admin = new AdminService();
const strategy = new LocalStrategy({ usernameField: 'tel' }, async (tel, pass, cb) => {
  try {
    const admin = await Admin.login(tel, pass);

    cb(null, admin);
  } catch (err) {
    if (err instanceof UnauthorizedErr) {
      cb(err);
    } else {
      throw err;
    }
  }
});

export { strategy as adminLocalStrategy };
