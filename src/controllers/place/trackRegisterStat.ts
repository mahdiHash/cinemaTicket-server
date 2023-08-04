import { Request, Response } from 'express';
import { passport } from '../../config';
import { placeRegisterOwnerAuth, middlewareWrapper, checkRouteParamType } from '../../middlewares';
import { PlaceService } from '../../services';

const Place = new PlaceService();
const controller = [
  // authorization
  passport.authenticate('jwt', { session: false }),

  middlewareWrapper(placeRegisterOwnerAuth),

  middlewareWrapper(checkRouteParamType({ code: 'string' })),

  middlewareWrapper(async (req: Request, res: Response) => {
    const registerReq = await Place.getRegisterReqByCode(req.params.code);

    res.json({
      name: registerReq.name,
      type: registerReq.type,
      license_id: registerReq.license_id,
      address: registerReq.address,
      city: registerReq.city,
      status: registerReq.status,
    });
  }),
];

export { controller as trackRegisterStat };
