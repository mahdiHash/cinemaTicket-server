import { Request, Response } from 'express';
import { middlewareWrapper, playAdminAuth, checkRouteParamType } from '../../middlewares';
import { passport } from '../../config';
import { PlayMediaService } from '../../services/play.media.service';

const PlayMedia = new PlayMediaService();
const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  middlewareWrapper(checkRouteParamType({ playId: 'number' })),

  middlewareWrapper(async (req: Request, res: Response) => {
    await PlayMedia.removePlayTrailer(+req.params.playId);
  
    res.json({
      message: 'تریلر حذف شد.',
    });
  }),
];

export { controller as removePLayTrailer };
