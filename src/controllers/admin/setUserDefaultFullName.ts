import { passport } from '../../config';
import { superAdminAuth, middlewareWrapper, checkRouteParamType } from '../../middlewares';
import { Request, Response } from 'express';
import { UserService } from '../../services';

const User = new UserService();

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(superAdminAuth),

  middlewareWrapper(checkRouteParamType({ userId: 'number' })),

  middlewareWrapper(async (req: Request, res: Response) => {
    const upUser = await User.setUserDefaultFullNameById(+req.params.userId);
  
    res.json({
      first_name: upUser.first_name,
      last_name: upUser.last_name,
      message: "نام کاربر تغییر کرد."
    });
  }
  ),
];

export { controller as setUserDefaultFullName };
