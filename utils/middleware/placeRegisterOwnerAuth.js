const prisma = require('../../config/prismaConfig');
const ForbiddenErr = require('../errors/forbiddenErr');
const NotFoundErr = require('../errors/notFoundErr');

let middleware = async (req, res, next) => {
  let registerationInfo = await prisma.non_approved_places.findUnique({
    where: { code: req.params.code },
  })
    .catch(next);

  if (!registerationInfo) {
    return next(new NotFoundErr('کد ثبت پیدا نشد.'));
  }

  if (registerationInfo.owner_id === req.user.id) {
    next();
  }
  else {
    next(new ForbiddenErr());
  }
}

module.exports = middleware;
