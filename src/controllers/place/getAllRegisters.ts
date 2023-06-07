import { Request, Response } from "express";
import { prisma, passport } from "../../config";
import { superAdminAuth, middlewareWrapper, storeValidatedQuery } from "../../middlewares";
import { getAllPlacesRegistersQuValidator } from "../../validation/queryValidators";
import { decrypt } from "../../helpers";

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(superAdminAuth),

  middlewareWrapper(storeValidatedQuery(getAllPlacesRegistersQuValidator)),

  middlewareWrapper(middleware),
];

export { controller as getAllRegisters };

async function middleware(req: Request, res: Response) {
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
  });

  // decrypt encoded values
  for (let reg of registers) {
    reg.owner.email = decrypt(reg.owner.email);
    reg.owner.national_id = decrypt(reg.owner.national_id);
    reg.owner.tel = decrypt(reg.owner.tel) as string;
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
  });

  res.json({
    haveMore: dataLeftAfterCursor > 0,
    data: registers,
  });
}
