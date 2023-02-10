const ServerErr = require('./serverErr');

const handler = (err, req, res, next) => {
  let name = err.name;
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
      name,
      message: err.message ?? err.msg,
    });
  }
  // validaion err
  else if (name == 'ValidationError') {
    res.status(400);
    resObj.errors = err.details.map((errObj) => {
      return {
        name,
        message: errObj.message,
      }
    });
  }
  else if (name == "NotFoundErr") {
    res.status(404);
    resObj.errors.push({
      name,
      message: err.message,
    })
  }
  else if (name == "UnauthorizedErr") {
    res.status(401);
    resObj.errors.push({
      name,
      message: err.message,
    })
  }
  // it's a server err
  else {
    res.status(500);
    resObj.errors.push(new ServerErr());
    console.error({
      err,
      headers: resObj.headers,
      body: resObj.body,
      parameters: resObj.parameters,
    });
  }

  res.json(resObj);
}

module.exports = handler;
