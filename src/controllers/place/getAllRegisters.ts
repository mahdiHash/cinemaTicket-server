import { Request, Response } from 'express';
import { passport } from '../../config';
import { superAdminAuth, middlewareWrapper, storeValidatedQuery, checkRouteParamType } from '../../middlewares';
import { getAllPlacesRegistersQuValidator } from '../../validation/queryValidators';
import { PlaceRegisterService } from '../../services';

const PlaceRegister = new PlaceRegisterService();
const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(superAdminAuth),

  middlewareWrapper(storeValidatedQuery(getAllPlacesRegistersQuValidator)),

  middlewareWrapper(async function middleware(req: Request, res: Response) {
    /* since status field of req.query is a type of union, I ignored it here */
    // @ts-ignore
    const registersReqs = await PlaceRegister.getAllRegistersReqsByQuery(req.query);
  
    res.json(registersReqs);
  }
  ),
];

export { controller as getAllRegisters };
