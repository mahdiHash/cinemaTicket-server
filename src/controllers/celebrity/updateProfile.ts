import { Request, Response } from 'express';
import { passport, storeImgLocally } from '../../config';
import { updateCelebInpValidator } from '../../validation/inputValidators';
import { CelebrityService } from '../../services';
import { playAdminAuth, middlewareWrapper, storeValidatedInputs, checkRouteParamType } from '../../middlewares';

const Celeb = new CelebrityService();
const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  middlewareWrapper(checkRouteParamType({ id: 'number' })),

  // parse and locally store the uploaded image
  storeImgLocally.single('img'),

  middlewareWrapper(storeValidatedInputs(updateCelebInpValidator)),

  middlewareWrapper(async (req: Request, res: Response) => {
    let celeb = await Celeb.getCelebById(+req.params.id);

    if (req.file) {
      if (celeb.profile_pic_url) {
        await Celeb.removeProfilePic(+req.params.id);
      }

      await Celeb.uploadProfilePic(celeb.id, req.file);
    }

    let upCeleb = await Celeb.updateProfile(+req.params.id, res.locals.validBody);

    res.json({
      celeb: upCeleb,
      message: 'اطلاعات هنرمند تغییر کرد.',
    });
  }),
];

export { controller as updateProfile };
