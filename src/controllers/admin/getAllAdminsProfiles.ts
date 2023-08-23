import { Request, Response } from 'express';
import { passport } from '../../config';
import { superAdminAuth, middlewareWrapper } from '../../middlewares';
import { admins } from '@prisma/client';
import { AdminService } from '../../services';

const Admin = new AdminService();
const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(superAdminAuth),

  middlewareWrapper(async (req: Request, res: Response) => {
    const reqAdminObj = req.user as admins;
    const admins = await Admin.getAllAdminsExceptId(reqAdminObj.id);

    res.json(admins);
  }),
];

export { controller as getAllAdminsProfiles };
