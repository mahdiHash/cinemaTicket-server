import { Request, Response } from 'express';
import { passport } from '../../config';
import { superAdminAuth, middlewareWrapper, checkRouteParamType } from '../../middlewares';
import { PlaceService } from '../../services';

const Place = new PlaceService();
const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(superAdminAuth),

  middlewareWrapper(checkRouteParamType({ id: 'number' })),

  middlewareWrapper(async (req: Request, res: Response) => {
    await Place.approveRegisterReqById(+req.params.id);

    res.json({
      message: 'درخواست ثبت مکان تأیید شد.',
    });
  }),
];

export { controller as approvePlaceRegister };
