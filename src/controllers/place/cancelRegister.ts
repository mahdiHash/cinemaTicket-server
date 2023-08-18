import { Request, Response } from "express";
import { passport } from "../../config";
import { placeRegisterOwnerAuth, middlewareWrapper } from "../../middlewares";
import { PlaceRegisterService } from "../../services";

const PlaceRegister = new PlaceRegisterService();
const controller = [
  // authorization
  passport.authenticate('jwt', { session: false }),

  middlewareWrapper(placeRegisterOwnerAuth),

  middlewareWrapper(async (req: Request, res: Response) => {
    await PlaceRegister.removeRegisterReqByCode(req.params.code);
    
    res.json({
      message: "درخواست ثبت مکان لغو شد."
    });
  }
  ),
];

export { controller as cancelRegister };
