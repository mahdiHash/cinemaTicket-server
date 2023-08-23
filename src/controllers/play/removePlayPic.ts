import { Request, Response } from "express";
import { middlewareWrapper, checkRouteParamType, playAdminAuth } from "../../middlewares";
import { passport} from "../../config";
import { PlayService } from "../../services";
import { PlayMediaService } from "../../services/play.media.service";

const PlayMedia = new PlayMediaService();
const Play = new PlayService();
const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  middlewareWrapper(checkRouteParamType({ playId: 'number'})),

  middlewareWrapper(async (req: Request, res: Response) => {
    await Play.getPlayById(+req.params.playId);
    await PlayMedia.removePlayPic(`/${req.params.folder}/${req.params.fileName}`);
  
    res.json({
      message: 'تصویر حذف شد.',
    });
  }
  ),
];

export { controller as removePlayPic };
