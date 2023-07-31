import { passport } from '../../config';
import { superAdminAuth, middlewareWrapper } from '../../middlewares';
import { NotFoundErr, BadRequestErr } from '../../helpers/errors';
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

    let user = await User.getFullUserDataById(+req.params.userId);

    if (user === null) {
      throw new NotFoundErr('کاربر یافت نشد.');
    }

    if (user.profile_pic_fileId === null) {
      throw new BadRequestErr('کاربر عکس پروفایل ندارد.');
    }

    await User.removeUserProfilePicById(user.id, user.profile_pic_fileId);

    res.json({
      message: 'عکس پروفایل کاربر با موفقیت حذف شد.',
    });
  }),
];

export { controller as removeUserProfilePic };
