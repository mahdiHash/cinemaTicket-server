import { Request, Response } from 'express';
import { BadRequestErr } from '../helpers/errors';

type paramsWithTypes = {
  [paramName: string]: 'string' | 'number';
};

function middleware(params: paramsWithTypes) {
  return async (req: Request, res: Response) => {
    if (typeof params !== 'object') {
      throw new TypeError('params argument must be object');
    }

    for (let paramName in params) {
      const paramType = params[paramName];

      if (paramType === 'number') {
        if (!Number.isFinite(+req.params[paramName])) {
          throw new BadRequestErr('پارامتر آدرس وب معتبر نیست');
        }
      } else {
        if (typeof req.params[paramName] !== 'string') {
          throw new BadRequestErr('پارامتر آدرس وب معتبر نیست');
        }
      }
    }
  };
}

export { middleware as checkRouteParamType };
