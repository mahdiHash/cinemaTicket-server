import { Request, Response } from 'express';
import { middlewareWrapper, checkRouteParamType } from '../../middlewares';
import { CelebrityService } from '../../services/celebrity/celebrity.service';

const Celeb = new CelebrityService();
const controller = [
  middlewareWrapper(checkRouteParamType({ id: 'number' })),

  middlewareWrapper(async (req: Request, res: Response) => {
    const pics = await Celeb.getAllCelebPicsById(+req.params.id);

    res.json(pics);
  }),
];

export { controller as getCelebPics };
