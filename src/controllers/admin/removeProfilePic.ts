import { passport } from '../../config';
import { BadRequestErr } from '../../helpers/errors';
import { middlewareWrapper } from '../../middlewares';
import { Request, Response } from 'express';
import { admins } from '@prisma/client';
import { AdminService } from '../../services';

const Admin = new AdminService();

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(async (req: Request, res: Response) => {
    const reqAdminObj = req.user as admins;

    if (reqAdminObj.profile_pic_fileId === null) {
      throw new BadRequestErr('ادمین هیچ عکس پروفایلی آپلود نکرده است.');
    }

    await Admin.removeProfilePic(reqAdminObj.id);

    res.json({
      message: 'عکس پروفایل حذف شد.',
    });
  }),
];

export { controller as removeProfilePic };
