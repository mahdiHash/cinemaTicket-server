import { prisma, imageKit, passport } from '../../config';
import { BadRequestErr } from '../../helpers/errors';
import { middlewareWrapper } from '../../middlewares';
import { Request, Response } from 'express';
import { admins } from '@prisma/client';

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(middleware),
];

export { controller as removeProfilePic };

async function middleware(req: Request, res: Response) {
  const reqAdminObj = req.user as admins;
  let admin = await prisma.admins.findFirst({
    where: { id: reqAdminObj.id },
    select: { profile_pic_fileId: true },
  });

  if (admin?.profile_pic_fileId === null) {
    throw new BadRequestErr('ادمین هیچ عکس پروفایلی آپلود نکرده است.');
  }

  await imageKit.deleteFile(admin?.profile_pic_fileId as string);
  await prisma.admins.update({
    where: { id: reqAdminObj.id },
    data: {
      profile_pic_fileId: null,
      profile_pic_url: null,
    },
  });
  
  res.json({
    message: 'عکس پروفایل حذف شد.'
  });
}
