import { Request, Response } from "express";
import { middlewareWrapper, checkRouteParamType } from "../../middlewares";
import { PlayService } from "../../services";
import { PlayMediaService } from "../../services/play.media.service";
import { PlayCelebrityService } from "../../services/play.celebs.service";

const PlayCelebrity = new PlayCelebrityService();
const PlayMedia = new PlayMediaService();
const Play = new PlayService();
const controller = [
  middlewareWrapper(checkRouteParamType({ playId: 'number' })),

  middlewareWrapper(async (req: Request, res: Response) => {
    const play = await Play.getPlayById(+req.params.playId);
    const playPics = await PlayMedia.getPlayPics(play.id);
    const playCelebs = await PlayCelebrity.getPlayCelebs(play.id);
  
    res.json({
      play: {
        ...play,
        celebrities: playCelebs,
      },
      pics: playPics,
    });
  }
  ),
];

export { controller as getPlay };
