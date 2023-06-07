import { prisma, passport } from '../../config';
import { resetPassInpValidator } from '../../validation/inputValidators';
import { storeValidatedInputs, middlewareWrapper } from '../../middlewares';
import { hash, compare } from 'bcryptjs';
import { UnauthorizedErr } from '../../helpers/errors';
import { Request, Response } from 'express';
import { admins } from '@prisma/client';

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(storeValidatedInputs(resetPassInpValidator)),

  middlewareWrapper(middleware),
];

export { controller as resetPass };

async function middleware(req: Request, res: Response) {
  const reqAdminObj = req.user as admins;
  let doesPassMatch = await compare(req.body.oldPass, reqAdminObj.password);

  if (!doesPassMatch) {
    throw new UnauthorizedErr('رمز ورود قدیمی اشتباه است.');
  }

  let newPassHash = await hash(res.locals.validBody.newPass, 16);

  await prisma.admins.update({
    where: { id: reqAdminObj.id },
    data: { password: newPassHash },
  });

  res.json({
    message: "رمز با موفقیت تغییر کرد."
  });
}
