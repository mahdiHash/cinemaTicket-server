import { prisma, passport, imageKit } from '../../config';
import { superAdminAuth, middlewareWrapper } from '../../middlewares';
import { NotFoundErr, BadRequestErr } from '../../helpers/errors';
import { Request, Response } from 'express';

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(superAdminAuth),

  middlewareWrapper(middleware),
];

export { controller as removeUserProfilePic };

async function middleware(req: Request, res: Response) {
  if (!Number.isFinite(+req.params.userId)) {
    throw new BadRequestErr('شناسۀ کاربر باید یک عدد باشد.');
  }

  let user = await prisma.users.findUnique({
    where: { id: +req.params.userId },
    select: {
      id: true,
      profile_pic_fileId: true,
    },
  });

  if (!user) {
    throw new NotFoundErr('کاربر یافت نشد.');
  }

  if (user.profile_pic_fileId === null) {
    throw new BadRequestErr('کاربر عکس پروفایل ندارد.');
  }

  await imageKit.deleteFile(user.profile_pic_fileId as string);
  await prisma.users.update({
    where: { id: user.id },
    data: {
      profile_pic_fileId: null,
      profile_pic_url: null,
    },
  });

  res.json({
    message: "عکس پروفایل کاربر با موفقیت حذف شد."
  });
}
