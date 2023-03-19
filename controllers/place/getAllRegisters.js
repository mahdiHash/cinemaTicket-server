const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const superAdminAuth = require('../../utils/middleware/superAdminAuth');
const { decrypt } = require('../../utils/cipherFunc');
const BadRequestErr = require('../../utils/errors/badRequestErr');

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  superAdminAuth,

  async (req, res, next) => {
    if (
      !req.query.status
      || !['waiting', 'approved', 'denied'].includes(req.query.status)
    ) {
      return next(new BadRequestErr('status field of query is not provided or not valid.'));
    }

    if (req.query.cursor) {
      if (!isFinite(req.query.cursor)) {
        return next(new BadRequestErr('cursor field must be a number'));
      }
    }
    
    let takeSign = req.query.backward ? -1 : 1;
    let registers = await prisma.non_approved_places.findMany({
      where: {
        license_id: req.query.license_id,
        status: req.query.status,
      },
      orderBy: {
        id: req.query.sort ?? 'asc',
      },
      cursor: req.query.cursor
        ? { id: +req.query.cursor + (req.query.sort == 'desc' ? -takeSign : takeSign) }
        : undefined,
      take: takeSign * 10,
      include: {
        owner: {
          select: {
            id: true,
            full_name: true,
            tel: true,
            email: true,
            national_id: true,
            profile_pic_url: true,
          }
        }
      },
    })
      .catch(next);

    // decrypt encoded values
    for (let reg of registers) {
      reg.owner.email = decrypt(reg.owner.email);
      reg.owner.national_id = decrypt(reg.owner.national_id);
      reg.owner.tel = decrypt(reg.owner.tel);
    }

    let lastRecordCursor = registers[registers.length - 1]?.id ?? -1;
    let dataLeftAfterCursor = await prisma.non_approved_places.count({
      where: { status: req.query.status },
      orderBy: {
        id: req.query.sort ?? 'asc',
      },
      take: takeSign * 1,
      cursor: lastRecordCursor
        ? { id: lastRecordCursor + (req.query.sort == 'desc' ? -takeSign : takeSign) }
        : undefined,
    })
      .catch(next);

    res.json({
      haveMore: dataLeftAfterCursor > 0,
      data: registers,
    });
  }
];

module.exports = controller;
