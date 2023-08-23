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
    await User.removeUserProfilePicById(+req.params.userId);

    res.json({
      message: 'عکس پروفایل کاربر با موفقیت حذف شد.',
    });
  }),
];

export { controller as removeUserProfilePic };
