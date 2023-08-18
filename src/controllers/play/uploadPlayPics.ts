import { Request, Response } from 'express';
import { uploadPlayPicsInpValidator } from '../../validation/inputValidators';
import { passport, storeImgLocally } from '../../config';
import { BadRequestErr } from '../../helpers/errors';
import { middlewareWrapper, storeValidatedInputs, playAdminAuth, checkRouteParamType } from '../../middlewares';
import { PlayService } from '../../services';

const Play = new PlayService();
const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  middlewareWrapper(checkRouteParamType({ playId: 'number' })),

  storeImgLocally.array('imgs'),

  middlewareWrapper(storeValidatedInputs(uploadPlayPicsInpValidator)),

  middlewareWrapper(async (req: Request, res: Response) => {
    const play = await Play.getPlayById(+req.params.playId);
  
    if (!req.files) {
      throw new BadRequestErr('تصویری آپلود نشده است');
    }
  
    const urls = await Play.uploadPlayPicsById(+req.params.playId, {
      filesInfo: req.files as Array<Express.Multer.File>,
      position: res.locals.validBody.position,
      playTitle: play.title,
    })
  
    res.json({
      message: 'تصاویر آپلود شدند.',
      urls,
    });
  }
  ),
];

export { controller as uploadPlayPics };
