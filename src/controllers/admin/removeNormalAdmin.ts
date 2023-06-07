import { prisma, passport } from '../../config';
import { superAdminAuth, middlewareWrapper } from '../../middlewares';
import { BadRequestErr, ForbiddenErr, NotFoundErr } from '../../helpers/errors';
import { Request, Response } from 'express';

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(superAdminAuth),

  middlewareWrapper(middleware),
];

export { controller as removeNormalAdmin }

async function middleware(req: Request, res: Response) {
  if (!Number.isFinite(+req.params.adminId)) {
    throw new BadRequestErr('شناسۀ ادمین باید یک عدد باشد.');
  }

  let targetAdmin = await prisma.admins.findUnique({
    where: { id: +req.params.adminId },
  });

  if (targetAdmin === null) {
    throw new NotFoundErr('ادمین پیدا نشد.');
  }

  if (targetAdmin.access_level === 'super') {
    throw new ForbiddenErr(
      'ادمین برتر نمی‌تواند دیگر ادمین‌های برتر را حذف کند.'
    );
  }

  await prisma.admins.delete({
    where: { id: +req.params.adminId },
  });

  res.json({
    message: 'ادمین با موفقیت حذف شد.'
  });
}
