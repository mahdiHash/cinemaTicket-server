import { passport } from '../../config';
import { superAdminAuth, middlewareWrapper, checkRouteParamType } from '../../middlewares';
import { ForbiddenErr } from '../../helpers/errors';
import { Request, Response } from 'express';
import { AdminService } from '../../services';

const Admin = new AdminService();

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(superAdminAuth),

  middlewareWrapper(checkRouteParamType({ adminId: 'number' })),

  middlewareWrapper(async (req: Request, res: Response) => {
    let targetAdmin = await Admin.getAdminById(+req.params.adminId);

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
