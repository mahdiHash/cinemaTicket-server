import { Request, Response } from 'express';
import { passport } from '../../config';
import { decrypt } from '../../helpers';
import { superAdminAuth, middlewareWrapper } from '../../middlewares';
import { admins } from '@prisma/client';
import { AdminService } from '../../services';

const Admin = new AdminService();
const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(superAdminAuth),

  middlewareWrapper(async (req: Request, res: Response) => {
    let reqAdminObj = req.user as admins;
    let admins = await Admin.getAllAdminsExceptID(reqAdminObj.id);

    for (let admin of admins) {
      admin.tel = decrypt(admin.tel) as string;
      admin.email = decrypt(admin.email) as string;
      admin.home_tel = decrypt(admin.home_tel) as string;
      admin.national_id = decrypt(admin.national_id) as string;
      admin.full_address = decrypt(admin.full_address) as string;
    }

    res.json(
      admins.map((admin) => {
        // remove two fields from admin objects
        let { password, profile_pic_fileId, ...rest } = admin;
        return rest;
      })
    );
  }),
];

export { controller as getAllAdminsProfiles };
