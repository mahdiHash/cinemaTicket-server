import { Request, Response, NextFunction } from 'express';
import { prisma, passport } from '../../config';
import { getAllCelebritiesQuValidator } from '../../validation/queryValidators';
import {
  storeValidatedQuery,
  playAdminAuth,
  middlewareWrapper,
} from '../../middlewares';

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  middlewareWrapper(storeValidatedQuery(getAllCelebritiesQuValidator)),

  middlewareWrapper(middleware),
];

export { controller as getAllCelebrities };

async function middleware(req: Request, res: Response) {
  let takeSign = res.locals.validQuery.backward ? -1 : 1;
  let celebrities = await prisma.celebrities.findMany({
    where: {
      full_name: {
        search: res.locals.validQuery.full_name?.split(' ').join(' | '),
      },
    },
    orderBy: { id: 'desc' },
    select: {
      id: true,
      full_name: true,
      profile_pic_url: true,
      bio: true,
      birth_city: true,
      birthday: true,
    },
    cursor: req.query.cursor
      ? { id: +res.locals.validQuery.cursor + -takeSign }
      : undefined,
    take: takeSign * 15, // because of desc order we should reverse the take sign
  });
  let lastRecordCursor = celebrities[celebrities.length - 1]?.id ?? -1;
  let dataLeftAfterCursor = await prisma.celebrities.count({
    where: { full_name: res.locals.validQuery.full_name },
    orderBy: { id: 'desc' },
    cursor: {
      id: lastRecordCursor + -takeSign,
    },
    take: takeSign * 1,
  });

  res.json({
    haveMore: dataLeftAfterCursor > 0,
    celebrities,
  });
}
