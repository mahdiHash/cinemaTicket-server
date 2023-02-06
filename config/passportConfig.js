const passport = require('passport');
const localStrategy = require('./passport-local');

passport.use(localStrategy);

module.exports = passport;
