import { Request, Response } from "express";
import { passport } from "../../config";
import { placeRegisterInpValidator } from "../../validation/inputValidators";
import { storeValidatedInputs, middlewareWrapper } from "../../middlewares";
import { users } from "@prisma/client";
import { PlaceRegisterService } from "../../services";

const PlaceRegister = new PlaceRegisterService();
const contoller = [
  // authorization
  passport.authenticate('jwt', { session: false }),

  middlewareWrapper(storeValidatedInputs(placeRegisterInpValidator)),

  middlewareWrapper(async (req: Request, res: Response) => {
    const reqUserObj = req.user as users;
    const code = await PlaceRegister.createRegisterReq(reqUserObj.id, req.body);
    
    res.json({
      code,
      message: "درخواست ثبت مکان ایجاد شد."
    });
  }
  ),
];

export { contoller as register };
