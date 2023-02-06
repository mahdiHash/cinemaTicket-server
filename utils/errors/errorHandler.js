const ServerErr = require('./serverErr');

const handler = (err, req, res, next) => {
  let name = err.name;
  let errors = [];

  // if the http status code of response is already set,
  // then it's specified by developer so just push it to
  // errors array
  if (res.statusCode && res.statusCode != 200) {
    errors.push({
      name,
      message: err.message ?? err.msg,
    });
  }
  // validaion err
  else if (name == 'ValidationError') {
    res.status(400);
    errors = err.details.map((errObj) => {
      return {
        name,
        message: errObj.message,
      }
    });
  }
  else if (name == "NotFoundErr") {
    res.status(404);
    errors.push({
      name,
      message: err.message,
    })
  }
  // it's a server err
  else {
    res.status(500);
    errors.push(new ServerErr());
  }

  res.json({
    errors,
    code: res.status,
    headers: req.headers,
    body: req.body,
    parameters: req.params,
  });
}

module.exports = handler;
