import { Strategy as LocalStrategy } from 'passport-local';
import { UnauthorizedErr } from '../helpers/errors/index.js';
import { UserService } from '../services/index.js';

const User = new UserService();
const strategy = new LocalStrategy(
  { usernameField: 'login' },
  async (login, pass, cb) => {
    try {
      const user = await User.login(login, pass);

      cb(null, user);
    } catch (err) {
      if (err instanceof UnauthorizedErr) {
        cb(err);
      } else {
        throw err;
      }
    }
  }
);

export { strategy as localStrategy };
