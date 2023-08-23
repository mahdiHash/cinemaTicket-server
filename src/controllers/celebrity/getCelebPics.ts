import { Request, Response } from 'express';
import { middlewareWrapper, checkRouteParamType } from '../../middlewares';
import { CelebrityPicsService } from '../../services/celebrity.pics.service';

const CelebPics = new CelebrityPicsService();
const controller = [
  middlewareWrapper(checkRouteParamType({ id: 'number' })),

  middlewareWrapper(async (req: Request, res: Response) => {
    const pics = await CelebPics.getAllCelebPics(+req.params.id);

    res.json(pics);
  }),
];

export { controller as getCelebPics };
