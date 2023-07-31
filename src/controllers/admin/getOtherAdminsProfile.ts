import { Request, Response } from 'express';
import { passport } from '../../config';
import { decrypt } from '../../helpers';
import { NotFoundErr, BadRequestErr } from '../../helpers/errors';
import { superAdminAuth, middlewareWrapper } from '../../middlewares';
import { getAdminById } from '../../services/admin';

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(superAdminAuth),

  middlewareWrapper(async (req: Request, res: Response) => {
    if (!Number.isFinite(+req.params.adminId)) {
      throw new BadRequestErr('شناسۀ ادمین باید یک عدد باشد.');
    }

    let admin = await getAdminById(+req.params.adminId);

    if (!admin) {
      throw new NotFoundErr('ادمینی پیدا نشد.');
    }

    const { password, ...adminInfo } = admin;

    res.json(adminInfo);
  }),
];

export { controller as getOtherAdminsProfiles };
