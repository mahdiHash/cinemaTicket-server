import { Request, Response } from "express";
import { middlewareWrapper, playAdminAuth, checkRouteParamType } from "../../middlewares";
import { passport, storeVideoLocally } from "../../config";
import { BadRequestErr } from "../../helpers/errors";
import { PlayMediaService } from "../../services/play.media.service";

const PlayMedia = new PlayMediaService();
const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  middlewareWrapper(checkRouteParamType({ playId: 'number'})),

  storeVideoLocally.single('vid'),

  middlewareWrapper(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new BadRequestErr('ویدیویی آپلود نشده است.');
    }
  
    const { url } = await PlayMedia.uploadPlayTrailer(+req.params.playId, req.file);
  
    res.json({
      message: 'ویدیو آپلود شد.',
      url,
    });
  }
  ),
];

export { controller as uploadPlayTrailer };
