import { users } from "@prisma/client";
import { Request, Response } from "express";
import { passport } from "../../config";
import { decrypt, unescape } from "../../helpers";
import { middlewareWrapper } from "../../middlewares";

const controller = [
  // authorization
  passport.authenticate('jwt', { session: false }),

  middlewareWrapper(middleware),
];

export { controller as getUserProfile };

async function middleware(req: Request, res: Response) {
  const reqUserObj = req.user as users;
  // decrypt some vlaues for the client
  let descryptedUser = {
    id: reqUserObj.id,
    first_name: unescape(reqUserObj.first_name),
    last_name: unescape(reqUserObj.last_name),
    tel: decrypt(reqUserObj.tel),
    email: decrypt(reqUserObj.email),
    birthday: reqUserObj.birthday,
    credit_card_num: decrypt(reqUserObj.credit_card_num),
    national_id: decrypt(reqUserObj.national_id),
    profile_pic_url: reqUserObj.profile_pic_url,
  }

  res.json(descryptedUser);
}
