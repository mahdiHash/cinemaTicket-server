import { Request, Response } from 'express';
import { middlewareWrapper, storeValidatedInputs, playAdminAuth } from '../../middlewares';
import { createPlayInpValidator } from '../../validation/inputValidators/createPlay';
import { passport, storeImgLocally } from '../../config';
import { PlayCelebrityService } from '../../services/play.celebs.service';
import { PlayMediaService } from '../../services/play.media.service';
import { PlayService } from '../../services';

const Play = new PlayService();
const PlayMedia = new PlayMediaService();
const PlayCelebrity = new PlayCelebrityService();
const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  storeImgLocally.single('img'),

  middlewareWrapper(storeValidatedInputs(createPlayInpValidator)),

  middlewareWrapper(async (req: Request, res: Response) => {
    const play = await Play.createPlay(res.locals.validBody);
    const playCelebs = await PlayCelebrity.getPlayCelebs(play.id);
  
    if (req.file) {
      const { url } = await PlayMedia.uploadPlayCover(play.id, req.file);
  
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
