import { Request, Response } from 'express';
import { middlewareWrapper, storeValidatedInputs, playAdminAuth } from '../../middlewares';
import { createPlayInpValidator } from '../../validation/inputValidators/createPlay';
import { passport, storeImgLocally } from '../../config';
import { PlayService } from '../../services';

const Play = new PlayService();
const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  storeImgLocally.single('img'),

  middlewareWrapper(storeValidatedInputs(createPlayInpValidator)),

  middlewareWrapper(async (req: Request, res: Response) => {
    const play = await Play.createPlay(res.locals.validBody);
    const playCelebs = await Play.getPlayCelebsById(play.id);
  
    if (req.file) {
      const { url } = await Play.uploadPlayCoverById(play.id, req.file);
  
      play.cover_url = url;
    }
  
    res.json({
      message: 'نمایش ایجاد شد.',
      play: {
        ...play,
        celebrities: playCelebs,
      },
    });
  }
  ),
];

export { controller as createPlay };
