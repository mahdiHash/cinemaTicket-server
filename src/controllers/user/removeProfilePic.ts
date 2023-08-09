import { users } from "@prisma/client";
import { Request, Response } from "express";
import { passport } from "../../config";
import { middlewareWrapper } from "../../middlewares";
import { UserService } from "../../services";

const User = new UserService();
const controller = [
  // authorization
  passport.authenticate('jwt', { session: false }),

  middlewareWrapper(middleware),
];

export { controller as removeProfilePic };

async function middleware(req: Request, res: Response) {
  const reqUserObj = req.user as users;

  await User.removeUserProfilePicById(reqUserObj.id);

  res.json({
    message: "عکس پروفایل حذف شد."
  });
}
