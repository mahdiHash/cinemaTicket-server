const errorLogger = require('./errorLogger');
const { ValidationError } = require('joi');
const { MulterError } = require('multer');
const ServerErr = require('./serverErr');
const NotFoundErr = require('./notFoundErr');
const BadRequestErr = require('./badRequestErr');
const UnauthorizedErr = require('./unauthorized');
const ForbiddenErr = require('./forbiddenErr');

const handler = (err, req, res, next) => {
  let errors = [];
  let resObj = {
    errors,
    headers: req.headers,
    body: req.body,
    parameters: req.params,
  };

  // if the http status code of response is already set,
  // then it's specified by developer so just push it to
  // errors array
  if (res.statusCode && res.statusCode != 200) {
    resObj.errors.push({
      name: err.name,
      message: err.message ?? err.msg,
    });
  }
  // validaion err
  else if (err instanceof ValidationError) {
    res.status(400);
    resObj.errors = err.details.map((errObj) => {
      return {
        name: err.name,
        message: errObj.message,
      }
    });
  }
  else if (err instanceof MulterError) {
    res.status(400);
    resObj.errors.push({
      name: err.name,
      message: err.message,
    })
  }
  else if (err instanceof ForbiddenErr) {
    res.status(403);
    resObj.errors.push({
      name: err.name,
      message: err.message,
    })
  }
  else if (err instanceof NotFoundErr) {
    res.status(404);
    resObj.errors.push({
      name: err.name,
      message: err.message,
    })
  }
  else if (err instanceof UnauthorizedErr) {
    res.status(401);
    resObj.errors.push({
      name: err.name,
      message: err.message,
    })
  }
  else if (err instanceof BadRequestErr) {
    res.status(400);
    resObj.errors.push({
      name: err.name,
      message: err.message,
    })
  }
  // it's a server err
  else {
    res.status(500);
    resObj.errors.push(new ServerErr());
    errorLogger(
      { title: 'SERVER-SIDE ERROR' },
      [{
        err,
        headers: resObj.headers,
        body: resObj.body,
        parameters: resObj.parameters,
      }]
    );
  }

  res.json(resObj);
}

module.exports = handler;
