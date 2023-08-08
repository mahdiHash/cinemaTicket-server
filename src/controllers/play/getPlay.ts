import { Request, Response } from "express";
import { middlewareWrapper, checkRouteParamType } from "../../middlewares";
import { PlayService } from "../../services";

const Play = new PlayService();
const controller = [
  middlewareWrapper(checkRouteParamType({ playId: 'number' })),

  middlewareWrapper(middleware),
];

export { controller as getPlay };

async function middleware(req: Request, res: Response) {
  const play = await Play.getPlayById(+req.params.playId);
  const playPics = await Play.getPlayPicsById(play.id);
  const playCelebs = await Play.getPlayCelebsById(play.id);

  res.json({
    play: {
      ...play,
      celebrities: playCelebs,
    },
    pics: playPics,
  });
}
