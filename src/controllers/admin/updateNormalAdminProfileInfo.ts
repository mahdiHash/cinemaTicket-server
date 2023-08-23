import { passport } from '../../config';
import { updateAdminInpValidator } from '../../validation/inputValidators';
import { NotFoundErr, BadRequestErr, ForbiddenErr } from '../../helpers/errors';
import { Request, Response } from 'express';
import { AdminService } from '../../services';
import {
  storeValidatedInputs,
  superAdminAuth,
  middlewareWrapper,
  checkRouteParamType,
} from '../../middlewares';

const Admin = new AdminService();
const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(superAdminAuth),

  middlewareWrapper(checkRouteParamType({ adminId: 'number' })),

  middlewareWrapper(storeValidatedInputs(updateAdminInpValidator)),

  middlewareWrapper(async (req: Request, res: Response) => {
    if (!Number.isFinite(+req.params.adminId)) {
      throw new BadRequestErr('شناسۀ ادمین باید یک عدد باشد.');
    }
  
    let targetAdmin = await Admin.getAdminById(+req.params.adminId);
  
    if (targetAdmin === null) {
      throw new NotFoundErr('ادمین پیدا نشد.');
    }
  
    if (targetAdmin.access_level === 'super') {
      throw new ForbiddenErr(
        'ادمین برتر نمی‌تواند پروفایل دیگر ادمین‌های برتر را آپدیت کند.'
      );
    }
    
    const upAdmin = await Admin.updateAdmin(targetAdmin.id, res.locals.validBody);
  
    res.json({
      admin: upAdmin,
      message: 'اطلاعات ادمین با موفقیت تغییر کرد.',
    });
  }
  ),
];

export { controller as updateNormalAdminProfileInfo };
