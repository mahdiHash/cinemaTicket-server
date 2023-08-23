import { users } from "@prisma/client";
import { Request, Response } from "express";
import { passport } from "../../config";
import { middlewareWrapper } from "../../middlewares";

const controller = [
  // authorization
  passport.authenticate('jwt', { session: false }),

  middlewareWrapper(middleware),
];

export { controller as getUserProfile };

async function middleware(req: Request, res: Response) {
  const reqUserObj = req.user as users;
  const { password, profile_pic_fileId, ...userInfo} = reqUserObj;

  res.json(userInfo);
}
