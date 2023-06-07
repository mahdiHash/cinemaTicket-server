/*
  The purpose of this module is to wrap the middlewares inside a function which
  handles all the errors inside them.
*/

import { Request, Response, NextFunction } from 'express';
import { middlewareWrapperParam } from '../types/types/middlewareWrapperParam';

function middlewareWrapper(
  middleware: middlewareWrapperParam,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await middleware(req, res);

      if (res.headersSent) {
        res.end();
      }
      else {
        next();
      }
    }
    catch (err) {
      next(err);
    }
      // .then(next)
      // .then((...values) => {
      //   if (res.statusCode === 200 || res.statusCode === 302) {
      //     res.end();
      //   }
      //   else {
      //     next(...values);
      //   }
      // })
      // .catch(next);
      
      // console.log('response: ', response);
      // console.log('status code:', res.statusCode);
      // console.log('headers sent:', res.headersSent);
      // console.log('-'.repeat(10));

      // if (res.headersSent) {
      //   res.end();
      // }
      // else {
      //   next();
      // }
  };
}

export { middlewareWrapper };
