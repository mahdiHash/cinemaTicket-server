import { Request, Response } from 'express';
import { passport } from '../../config';
import { playAdminAuth, middlewareWrapper, checkRouteParamType } from '../../middlewares';
import { CelebrityService } from '../../services';

const Celeb = new CelebrityService();
const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  middlewareWrapper(checkRouteParamType({ id: 'number' })),

  middlewareWrapper(async (req: Request, res: Response) => {
    await Celeb.removeProfilePic(+req.params.id);
    await Celeb.updateProfile(+req.params.id, {
      profile_pic_fileId: null,
      profile_pic_url: null
    });

    res.json({
      message: 'عکس پروفایل هنرمند حذف شد.',
    });
  }),
];

export { controller as removeProfilePic };
