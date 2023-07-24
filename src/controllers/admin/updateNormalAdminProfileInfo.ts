import { passport } from '../../config';
import { updateAdminInpValidator } from '../../validation/inputValidators';
import { encrypt } from '../../helpers';
import { NotFoundErr, BadRequestErr, ForbiddenErr } from '../../helpers/errors';
import { Request, Response } from 'express';
import { AdminService } from '../../services';
import {
  storeValidatedInputs,
  superAdminAuth,
  middlewareWrapper,
} from '../../middlewares';

const Admin = new AdminService();
const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(superAdminAuth),

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
  
    let upData = {
      access_level: res.locals.validBody.access_level,
      full_name: res.locals.validBody.full_name,
      tel: encrypt(res.locals.validBody.tel) as string,
      email: encrypt(res.locals.validBody.email) as string,
      national_id: encrypt(res.locals.validBody.national_id) as string,
      home_tel: encrypt(res.locals.validBody.home_tel) as string,
      full_address: encrypt(res.locals.validBody.full_address) as string,
    };
  
    let upAdmin = await Admin.updateAdminById(targetAdmin.id, upData);
    const { password, profile_pic_fileId, ...adminInfo } = upAdmin;
  
    res.json({
      admin: adminInfo,
      message: 'اطلاعات ادمین با موفقیت تغییر کرد.',
    });
  }
  ),
];

export { controller as updateNormalAdminProfileInfo };
