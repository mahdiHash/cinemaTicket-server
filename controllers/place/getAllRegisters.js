const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const superAdminAuth = require('../../utils/middleware/superAdminAuth');
const storeValidatedQuery = require('../../utils/middleware/storeValidatedQuery');
const queryValidator = require('../../utils/queryValidators/getAllPlacesRegistersQuery');
const { decrypt } = require('../../utils/cipherFunc');

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  superAdminAuth,

  storeValidatedQuery(queryValidator),

  async (req, res, next) => {
    let takeSign = res.locals.validQuery.backward ? -1 : 1;
    let registers = await prisma.non_approved_places.findMany({
      where: {
        license_id: res.locals.validQuery.license_id,
        status: res.locals.validQuery.status,
      },
      orderBy: {
        id: res.locals.validQuery.sort ?? 'asc',
      },
      cursor: res.locals.validQuery.cursor
        ? { id: +res.locals.validQuery.cursor + (res.locals.validQuery.sort == 'desc' ? -takeSign : takeSign) }
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
      where: { status: res.locals.validQuery.status },
      orderBy: {
        id: res.locals.validQuery.sort ?? 'asc',
      },
      take: takeSign * 1,
      cursor: lastRecordCursor
        ? { id: lastRecordCursor + (res.locals.validQuery.sort == 'desc' ? -takeSign : takeSign) }
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
