import { Request, Response } from 'express';
import { passport } from '../../config';
import { superAdminAuth, middlewareWrapper, storeValidatedQuery, checkRouteParamType } from '../../middlewares';
import { getAllPlacesRegistersQuValidator } from '../../validation/queryValidators';
import { PlaceService } from '../../services';

const Place = new PlaceService();
const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(superAdminAuth),

  middlewareWrapper(storeValidatedQuery(getAllPlacesRegistersQuValidator)),

  middlewareWrapper(async function middleware(req: Request, res: Response) {
    /* since status field of req.query is a type of union, I ignored it here */
    // @ts-ignore
    const registersReqs = await Place.getAllRegistersReqsByQuery(req.query);
  
    res.json(registersReqs);
  }
  ),
];

export { controller as getAllRegisters };
