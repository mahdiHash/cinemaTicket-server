import { Request, Response } from "express";
import { prisma, passport, imageKit } from "../../config";
import { BadRequestErr, NotFoundErr } from "../../helpers/errors";
import { playAdminAuth, middlewareWrapper } from "../../middlewares";

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  middlewareWrapper(middleware),
];

export { controller as removeProfilePic };

async function middleware(req: Request, res: Response) {
  if (!Number.isFinite(+req.params.id)) {
    throw new BadRequestErr('پارامتر id باید یک عدد باشد.');
  }

  let celeb = await prisma.celebrities.findUnique({
    where: { id: +req.params.id },
  })
  
  if (!celeb) {
    throw new NotFoundErr('فرد مورد نظر پیدا نشد.');
  }

  if (!celeb.profile_pic_fileId) {
    throw new BadRequestErr('فرد مورد نظر عکس پروفایل ندارد.');
  }

  await imageKit.deleteFile(celeb.profile_pic_fileId);
  await prisma.celebrities.update({
    where: { id: celeb.id },
    data: {
      profile_pic_fileId: null,
      profile_pic_url: null,
    }
  });

  res.json({
    message: "عکس پروفایل هنرمند حذف شد."
  });
}