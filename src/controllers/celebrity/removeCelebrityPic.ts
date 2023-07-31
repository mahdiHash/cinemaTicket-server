import { celebrity_pics } from "@prisma/client";
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

export { controller as removeCelebrityPics };

async function middleware(req: Request, res: Response) {
  if (!Number.isFinite(+req.params.id)) {
    throw new BadRequestErr('پارامتر id باید یک عدد باشد.');
  }

  let celeb = await prisma.celebrities.findUnique({
    where: { id: +req.params.id },
  });

  if (!celeb) {
    throw new NotFoundErr('فرد مورد نظر پیدا نشد.');
  }

  let { fileId } = await prisma.celebrity_pics.findUnique({
    where: { url: `/${req.params.folder}/${req.params.fileName}` },
    select: { fileId: true }
  }) as NonNullable<celebrity_pics>;

  if (!fileId) {
    throw new NotFoundErr('این عکس پیدا نشد.');
  }

  await imageKit.deleteFile(fileId);
  await prisma.celebrity_pics.delete({
    where: { url: `/${req.params.folder}/${req.params.fileName}` },
  });

  res.json({
    message: "تصویر هنرمند حذف شد."
  });
}
