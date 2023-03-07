const middleware = (req, res, next) => {
  if (req.user.access_level !== 'super') {
    return next(new ForbiddenErr('You are not authorized to create admins.'));
  }

  next();
}

module.exports = middleware;
