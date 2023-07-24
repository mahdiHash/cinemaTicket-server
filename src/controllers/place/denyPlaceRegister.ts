import { Request, Response } from 'express';
import { prisma, passport } from '../../config';
import { superAdminAuth, middlewareWrapper } from '../../middlewares';
import { BadRequestErr, NotFoundErr } from '../../helpers/errors';

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(superAdminAuth),

  middlewareWrapper(middleware),
];

export { controller as denyPlaceRegister };

async function middleware(req: Request, res: Response) {
  if (!Number.isFinite(+req.params.id)) {
    throw new BadRequestErr('پارامتر id باید یک عدد باشد.');
  }

  let register = await prisma.non_approved_places.findUnique({
    where: { id: +req.params.id },
  });

  if (!register) {
    throw new NotFoundErr('درخواستی پیدا نشد.');
  }

  if (register.status === 'approved' || register.status === 'denied') {
    throw new BadRequestErr('وضعیت ثبت این درخواست را نمی‌توان تغییر داد.');
  }

  await prisma.non_approved_places.update({
    where: { id: register.id },
    data: { status: 'denied' },
  });

  res.json({
    message: 'درخواست ثبت مکان رد شد.',
  });
}
