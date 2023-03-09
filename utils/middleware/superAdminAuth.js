const ForbiddenErr = require('../../utils/errors/forbiddenErr');
const middleware = (req, res, next) => {
  if (req.user.access_level !== 'super') {
    return next(new ForbiddenErr('Only super admins can access/take this resource/action.'));
  }

  next();
}

module.exports = middleware;
