import { Request, Response } from 'express';
import { passport } from '../../config';
import { getAllCelebritiesQuValidator } from '../../validation/queryValidators';
import { CelebrityService } from '../../services';
import { storeValidatedQuery, playAdminAuth, middlewareWrapper } from '../../middlewares';

const Celeb = new CelebrityService();
const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  middlewareWrapper(storeValidatedQuery(getAllCelebritiesQuValidator)),

  middlewareWrapper(middleware),
];

export { controller as getAllCelebrities };

async function middleware(req: Request, res: Response) {
  const celebs = await Celeb.getAllCelebs({
    fullName: res.locals.validQuery.full_name,
    isBackward: res.locals.validQuery.backward,
    cursor: res.locals.validQuery.cursor,
  });

  res.json(celebs);
}
