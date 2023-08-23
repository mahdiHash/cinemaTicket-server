import { Request, Response } from 'express';
import { middlewareWrapper, checkRouteParamType } from '../../middlewares';
import { CelebrityService } from '../../services';

const Celeb = new CelebrityService();
const controller = [
  middlewareWrapper(checkRouteParamType({ id: 'number' })),

  middlewareWrapper(async (req: Request, res: Response) => {
    const celeb = await Celeb.getCelebById(+req.params.id);

    res.json(celeb);
  }),
];

export { controller as getCelebProfile };
