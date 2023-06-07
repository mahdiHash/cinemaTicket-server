import { Request, Response } from "express";
import { passport } from "../../config";
import { decrypt } from "../../helpers";
import { middlewareWrapper } from "../../middlewares";
import { admins } from "@prisma/client";

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(middleware),
];

export { controller as getProfile };

async function middleware(req: Request, res: Response) {
  let reqAdminObj = req.user as admins;

  res.json({
    id: reqAdminObj.id,
    access_level: reqAdminObj.access_level,
    full_name: reqAdminObj.full_name,
    tel: decrypt(reqAdminObj.tel),
    email: decrypt(reqAdminObj.email),
    national_id: decrypt(reqAdminObj.national_id),
    home_tel: decrypt(reqAdminObj.home_tel),
    full_address: decrypt(reqAdminObj.full_address),
    profile_pic_url: reqAdminObj.profile_pic_url,
  });
}
