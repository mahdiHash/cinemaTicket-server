import { Request, Response } from "express";
import { prisma, passport } from "../../config";
import { placeRegisterOwnerAuth, middlewareWrapper } from "../../middlewares";
import { PlaceService } from "../../services";

const Place = new PlaceService();
const controller = [
  // authorization
  passport.authenticate('jwt', { session: false }),

  middlewareWrapper(placeRegisterOwnerAuth),

  middlewareWrapper(async (req: Request, res: Response) => {
    await Place.removeRegisterReqByCode(req.params.code);
    
    res.json({
      message: "درخواست ثبت مکان لغو شد."
    });
  }
  ),
];

export { controller as cancelRegister };
