import { Request, Response } from 'express';
import { passport } from '../../config';
import { superAdminAuth, middlewareWrapper, checkRouteParamType } from '../../middlewares';
import { PlaceRegisterService } from '../../services';

const PlaceRegister = new PlaceRegisterService();
const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(superAdminAuth),

  middlewareWrapper(checkRouteParamType({ id: 'number'})),

  middlewareWrapper(async (req: Request, res: Response) => {
    await PlaceRegister.denyRegisterReq(+req.params.id);
  
    res.json({
      message: 'درخواست ثبت مکان رد شد.',
    });
  }
  ),
];

export { controller as denyPlaceRegister };
