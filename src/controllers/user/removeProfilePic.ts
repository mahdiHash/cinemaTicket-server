import { users } from "@prisma/client";
import { Request, Response } from "express";
import { prisma, imageKit, passport } from "../../config";
import { BadRequestErr } from "../../helpers/errors";
import { middlewareWrapper } from "../../middlewares";

const controller = [
  // authorization
  passport.authenticate('jwt', { session: false }),

  middlewareWrapper(middleware),
];

export { controller as removeProfilePic };

async function middleware(req: Request, res: Response) {
  const reqUserObj = req.user as users;
  let { profile_pic_fileId: fileId } = await prisma.users.findUnique({ 
    where: { id: reqUserObj.id } 
  }) as NonNullable<users>;

  if (fileId === null) {
    throw new BadRequestErr('کاربر عکس پروفایل ندارد.');
  }

  await imageKit.deleteFile(fileId);
  await prisma.users.update({
    where: { id: reqUserObj.id },
    data: {
      profile_pic_fileId: null,
      profile_pic_url: null,
    }
  });

  res.json({
    message: "عکس پروفایل حذف شد."
  });
}
