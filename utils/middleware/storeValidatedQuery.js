const middleware = (validator) => {
  return (req, res, next) => {
    validator.validateAsync(req.query)
      .then((query) => {
        // store validated body for further use (some values may be trimmed)
        res.locals.validQuery = query;
        next();
      })
      .catch(next);

  }
}

module.exports = middleware;
