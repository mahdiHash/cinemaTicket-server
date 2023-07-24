import Passport = require('passport');
import {
  jwtStrategy,
  adminJwtStrategy,
  localStrategy,
  adminLocalStrategy,
} from './';

const passport = new Passport.Passport();

passport.use(localStrategy);
passport.use(jwtStrategy);
passport.use('adminLocal', adminLocalStrategy);
passport.use('adminJwt', adminJwtStrategy);

export { passport };
