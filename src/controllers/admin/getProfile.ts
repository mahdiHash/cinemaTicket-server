import { Request, Response } from "express";
import { passport } from "../../config";
import { decrypt } from "../../helpers";
import { middlewareWrapper } from "../../middlewares";
import { admins } from "@prisma/client";

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(async (req: Request, res: Response) => {
    const reqAdminObj = req.user as admins;
    const { password, profile_pic_fileId, ...adminInfo } = reqAdminObj;

    res.json(adminInfo);
  }
  ),
];

export { controller as getProfile };
