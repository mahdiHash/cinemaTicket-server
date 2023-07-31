import { passport } from '../../config';
import { superAdminAuth, middlewareWrapper } from '../../middlewares';
import { BadRequestErr, ForbiddenErr, NotFoundErr } from '../../helpers/errors';
import { Request, Response } from 'express';
import { AdminService } from '../../services';

const Admin = new AdminService();

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(superAdminAuth),

  middlewareWrapper(async (req: Request, res: Response) => {
    if (!Number.isFinite(+req.params.adminId)) {
      throw new BadRequestErr('شناسۀ ادمین باید یک عدد باشد.');
    }

    let targetAdmin = await Admin.getAdminById(+req.params.adminId);

    if (targetAdmin === null) {
      throw new NotFoundErr('ادمین پیدا نشد.');
    }

    if (targetAdmin.access_level === 'super') {
      throw new ForbiddenErr('ادمین برتر نمی‌تواند دیگر ادمین‌های برتر را حذف کند.');
    }

    await Admin.deleteAdminById(targetAdmin.id);

    res.json({
      message: 'ادمین با موفقیت حذف شد.',
    });
  }),
];

export { controller as removeNormalAdmin };
