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

export { controller as removeAllCelebrityPics };

async function middleware(req: Request, res: Response) {
  if (!Number.isFinite(+req.params.id)) {
    throw new BadRequestErr('پارامتر id باید یک عدد باشد.');
  }

  let pics = await prisma.celebrity_pics.findMany({
    where: { celebrity_id: +req.params.id },
  });
  
  if (!pics.length) {
    throw new NotFoundErr('عکسی آپلود نشده است.');
  }

  await Promise.all(pics.map(({ url, fileId }) => {
    return imageKit.deleteFile(fileId)
      .then(() => prisma.celebrity_pics.delete({ where: { url } }));
  }));

  res.json({
    message: "تمام تصاویر هنرمند حذف شدند."
  });
}