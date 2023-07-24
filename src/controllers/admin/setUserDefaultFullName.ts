import { passport } from '../../config';
import { superAdminAuth, middlewareWrapper } from '../../middlewares';
import { BadRequestErr, NotFoundErr } from '../../helpers/errors';
import { Request, Response } from 'express';
import { UserService } from '../../services';

const User = new UserService();

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(superAdminAuth),

  middlewareWrapper(middleware),
];

export { controller as setUserDefaultFullName };

async function middleware(req: Request, res: Response) {
  if (!Number.isFinite(+req.params.userId)) {
    throw new BadRequestErr('شناسۀ کاربر باید یک عدد باشد.');
  }

  let user = await User.getUserById(+req.params.userId);

  if (user === null) {
    throw new NotFoundErr('کاربر پیدا نشد.');
  }

  let upUser = await User.setUserDefaultFullNameById(user.id);

  res.json({
    first_name: upUser.first_name,
    last_name: upUser.last_name,
    message: "نام کاربر تغییر کرد."
  });
}
