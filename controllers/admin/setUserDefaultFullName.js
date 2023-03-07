const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const superAdminAuth = require('../../utils/middleware/superAdminAuth');
const BadRequestErr = require('../../utils/errors/badRequestErr');
const NotFoundErr = require('../../utils/errors/notFoundErr');

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  superAdminAuth,

  async (req, res, next) => {
    if (!isFinite(req.params.userId)) {
      return next(new BadRequestErr('user_id is not valid.'));
    }

    let user = await prisma.users.findUnique({
      where: { id: +req.params.userId },
      select: { full_name: true, id: true },
    })
      .catch(next);

    if (!user) {
      return next(new NotFoundErr('user not found.'));
    }

    prisma.users.update({
      where: { id: user.id },
      data: {
        full_name: 'کاربر سینماتیکت'
      },
    })
      .then((user) => {
        res.json(user.full_name);
      })
      .catch(next);
  }
];

module.exports = controller;
