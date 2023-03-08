const middleware = (validator) => {
  return (req, res, next) => {
    validator.validateAsync(req.body)
      .then((body) => {
        // store validated body for further use (some values may be trimmed)
        res.locals.validBody = body;
        next();
      })
      .catch(next);

  }
}

module.exports = middleware;
