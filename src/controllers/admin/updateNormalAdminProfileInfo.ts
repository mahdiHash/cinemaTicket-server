import { prisma, passport } from '../../config';
import { updateAdminInpValidator } from '../../validation/inputValidators';
import {
  storeValidatedInputs,
  superAdminAuth,
  middlewareWrapper,
} from '../../middlewares';
import { encrypt } from '../../helpers';
import { NotFoundErr, BadRequestErr, ForbiddenErr } from '../../helpers/errors';
import { Request, Response } from 'express';

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(superAdminAuth),

  middlewareWrapper(storeValidatedInputs(updateAdminInpValidator)),

  middlewareWrapper(middleware),
];

export { controller as updateNormalAdminProfileInfo };

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
      'ادمین برتر نمی‌تواند پروفایل دیگر ادمین‌های برتر را آپدیت کند.'
    );
  }

  let upData = {
    id: +req.params.adminId,
    access_level: res.locals.validBody.access_level,
    full_name: res.locals.validBody.full_name,
    tel: encrypt(res.locals.validBody.tel) as string,
    email: encrypt(res.locals.validBody.email) as string,
    national_id: encrypt(res.locals.validBody.national_id) as string,
    home_tel: encrypt(res.locals.validBody.home_tel) as string,
    full_address: encrypt(res.locals.validBody.full_address) as string,
  };

  let upAdmin = await prisma.admins.update({
    where: { id: targetAdmin.id },
    data: upData,
  });

  res.json({
    admin: {
      id: req.params.adminId,
      access_level: res.locals.validBody.access_level,
      full_name: res.locals.validBody.full_name,
      tel: res.locals.validBody.tel,
      email: res.locals.validBody.email,
      national_id: res.locals.validBody.national_id,
      home_tel: res.locals.validBody.home_tel,
      full_address: res.locals.validBody.full_address,
      profile_pic_url: upAdmin.profile_pic_url,
    },
    message: 'اطلاعات ادمین با موفقیت تغییر کرد.',
  });
}
