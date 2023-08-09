import { passport } from '../../config';
import { superAdminAuth, middlewareWrapper } from '../../middlewares';
import { BadRequestErr } from '../../helpers/errors';
import { Request, Response } from 'express';
import { UserService } from '../../services';

const User = new UserService();

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(superAdminAuth),

  middlewareWrapper(async (req: Request, res: Response) => {
    if (!Number.isFinite(+req.params.userId)) {
      throw new BadRequestErr('شناسۀ کاربر باید یک عدد باشد.');
    }

    await User.removeUserProfilePicById(+req.params.userId);

    res.json({
      message: 'عکس پروفایل کاربر با موفقیت حذف شد.',
    });
  }),
];

export { controller as removeUserProfilePic };
