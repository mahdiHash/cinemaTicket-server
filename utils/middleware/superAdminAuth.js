const ForbiddenErr = require('../../utils/errors/forbiddenErr');
const middleware = (req, res, next) => {
  if (req.user.access_level !== 'super') {
    return next(new ForbiddenErr('تنها ادمین‌های برتر می‌توانند به این منبع دسترسی داشته باشند یا این اقدام را انجام دهند.'));
  }

  next();
}

module.exports = middleware;
