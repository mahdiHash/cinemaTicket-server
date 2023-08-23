import { prisma, passport } from '../../config';
import { superAdminAuth, middlewareWrapper } from '../../middlewares';
import { BadRequestErr, NotFoundErr } from '../../helpers/errors';
import { Request, Response } from 'express';

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(superAdminAuth),

  middlewareWrapper(middleware),
];

export { controller as setUserDefaultFullName };

async function middleware(req: Request, res: Response) {
  if (!Number.isFinite(+req.params.userId)) {
    throw new BadRequestErr('شناسۀ کاربر باید یک عدد باشد.');
  }

  let user = await prisma.users.findUnique({
    where: { id: +req.params.userId },
  });

  if (user === null) {
    throw new NotFoundErr('کاربر پیدا نشد.');
  }

  let upUser = await prisma.users.update({
    where: { id: user.id },
    data: {
      first_name: 'کاربر',
      last_name: 'سینماتیکت',
    },
  });

  res.json({
    first_name: upUser.first_name,
    last_name: upUser.last_name,
    message: "نام کاربر تغییر کرد."
  });
}
