import { Request, Response } from 'express';
import { passport } from '../../config';
import { superAdminAuth, middlewareWrapper, checkRouteParamType } from '../../middlewares';
import { AdminService } from '../../services';

const Admin = new AdminService();
const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(superAdminAuth),

  middlewareWrapper(checkRouteParamType({ adminId: 'number' })),

  middlewareWrapper(async (req: Request, res: Response) => {
    const admin = await Admin.getAdminById(+req.params.adminId);

    res.json(admin);
  }),
];

export { controller as getOtherAdminsProfiles };
