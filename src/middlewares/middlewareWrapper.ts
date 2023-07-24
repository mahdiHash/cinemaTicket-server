/*
  The purpose of this module is to wrap the middlewares inside a function which
  handles all the errors inside them.
*/

import { Request, Response, NextFunction } from 'express';
import { middlewareWrapperParam } from '../types/types/middlewareWrapperParam';
import { rm } from 'fs/promises';
import { errorLogger } from '../helpers/errors';

function middlewareWrapper(middleware: middlewareWrapperParam) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await middleware(req, res);

      if (res.headersSent) {
        res.end();
      } else {
        next();
      }
    } catch (err) {
      if (req.file) {
        rm(req.file.path).catch(
          errorLogger.bind(null, { title: 'FILE REMOVAL ERROR' })
        );
      }

      if (req.files) {
        if (Array.isArray(req.files)) {
          for (let file of req.files) {
            rm(file.path).catch(
              errorLogger.bind(null, { title: 'FILE REMOVAL ERROR' })
            );
          }
        } else {
          for (let key in req.files) {
            for (let file of req.files[key]) {
              rm(file.path).catch(
                errorLogger.bind(null, { title: 'FILE REMOVAL ERROR' })
              );
            }
          }
        }
      }

      next(err);
    }
  };
}

export { middlewareWrapper };
