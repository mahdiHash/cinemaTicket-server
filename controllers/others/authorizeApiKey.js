const prisma = require('../../config/prismaConfig');
const ApiKeyErr = require('../../utils/errors/apikeyErr');

const middleware = (req, res, next) => {
  let key = req.headers.apikey;

  prisma.api_keys.findUnique({ where: { key } })
    .then((record) => {
      if (!record) {
        res.status(401);
        next(new ApiKeyErr());
      }
      else {
        next();
      }
    })
    .catch(next);
}

module.exports = middleware;
