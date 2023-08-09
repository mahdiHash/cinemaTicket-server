import { Request, Response } from "express";
import { middlewareWrapper } from "../../middlewares";
import { passport } from "../../config";
import { users } from "@prisma/client";
import { UserService } from "../../services";

const User = new UserService();
const controller = [
  passport.authenticate('jwt', { session: false }),

  middlewareWrapper(async (req: Request, res: Response) => {
    const reqUserObj = req.user as users;
  
    const { credit_card_number, national_id} = await User.getCreditCardReqStatus(reqUserObj.id);
  
    res.json({
      creditCardNum: credit_card_number,
      nationalId: national_id,
    });
  }
  ),
];

export { controller as checkCreditCardReqStatus };
