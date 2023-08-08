import { Request, Response } from 'express';
import { middlewareWrapper, storeValidatedInputs, playAdminAuth, checkRouteParamType } from '../../middlewares';
import { updatePlayInpValidator } from '../../validation/inputValidators';
import { passport, storeImgLocally } from '../../config';
import { PlayService } from '../../services';

const Play = new PlayService();
const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  middlewareWrapper(checkRouteParamType({ playId: 'number' })),

  // parse the request and locally store the uploaded image
  storeImgLocally.single('img'),

  middlewareWrapper(storeValidatedInputs(updatePlayInpValidator)),

  middlewareWrapper(async (req: Request, res: Response) => {
    const upPlay = await Play.updatePlayById(+req.params.playId, res.locals.validBody);
  
    if (req.file) {
      const { url} = await Play.uploadPlayCoverById(+req.params.playId, req.file);
      upPlay.play.cover_url = url;
    }
  
    res.json({
      message: 'اطلاعات نمایش بروزرسانی شد.',
      play: upPlay,
    });
  }
  ),
];

export { controller as update };
