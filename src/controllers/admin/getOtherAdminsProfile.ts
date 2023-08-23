import { Request, Response } from 'express';
import { prisma, passport } from '../../config';
import { decrypt } from '../../helpers';
import { NotFoundErr, BadRequestErr } from '../../helpers/errors';
import { superAdminAuth, middlewareWrapper } from '../../middlewares';

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(superAdminAuth),

  middlewareWrapper(middleware),
];

export { controller as getOtherAdminsProfiles };

async function middleware(req: Request, res: Response) {
  if (!Number.isFinite(+req.params.adminId)) {
    throw new BadRequestErr('شناسۀ ادمین باید یک عدد باشد.');
  }

  let admin = await prisma.admins.findUnique({
    where: { id: +req.params.adminId },
  });

  if (!admin) {
    throw new NotFoundErr('ادمینی پیدا نشد.');
  }

  res.json({
    id: admin.id,
    access_level: admin.access_level,
    full_name: admin.full_name,
    tel: decrypt(admin.tel),
    email: decrypt(admin.email),
    national_id: decrypt(admin.national_id),
    home_tel: decrypt(admin.home_tel),
    full_address: decrypt(admin.full_address),
    profile_pic_url: admin.profile_pic_url,
  });
}
