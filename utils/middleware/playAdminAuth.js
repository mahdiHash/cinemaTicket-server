const ForbiddenErr = require('../errors/forbiddenErr');
module.exports = (req, res, next) => {
  if (
    req.user.access_level === 'play' ||
    req.user.access_level === 'super'
  ) {
    next();
  }
  else {
    next(new ForbiddenErr());
  }
}
