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
  const celebs = await Celeb.getAllCelebs(
    res.locals.validQuery.full_name,
    res.locals.validQuery.backward,
    res.locals.validQuery.cursor
  );

  res.json(celebs);
}
