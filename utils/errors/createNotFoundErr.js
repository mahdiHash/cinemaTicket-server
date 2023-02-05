const NotFoundErr = require('./notFoundErr');

const controller = (req, res, next) => {
  if (req instanceof Error) {
    next(req);
  }
  else {
    next(new NotFoundErr());
  }
}

module.exports = controller;
