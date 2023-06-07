import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'joi';
import { MulterError } from 'multer';
import {
  errorLogger,
  ServerErr,
  NotFoundErr,
  BadRequestErr,
  UnauthorizedErr,
  ForbiddenErr,
  ApiKeyErr,
} from './';

const handler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let errors: Error[] = [];
  let resObj = {
    errors,
    headers: req.headers,
    body: req.body,
    parameters: req.params,
  };

  // if the http status code of response is already set,
  // then it's specified by the developer so just push it to
  // errors array
  if (res.statusCode && res.statusCode != 200) {
    resObj.errors.push({
      name: err.name,
      message: err.message,
    });
  }
  // validaion err
  else if (err instanceof ValidationError) {
    res.status(400);
    resObj.errors = err.details.map((errObj) => {
      return {
        name: 'InputValidationError',
        message: errObj.message,
      };
    });
  } else if (err instanceof MulterError) {
    res.status(400);
    resObj.errors.push({
      name: 'FileError',
      message: err.message,
    });
  } else if (err instanceof ApiKeyErr) {
    res.status(401);
    resObj.errors.push({
      name: err.name,
      message: err.message,
    });
  } else if (err instanceof ForbiddenErr) {
    res.status(403);
    resObj.errors.push({
      name: err.name,
      message: err.message,
    });
  } else if (err instanceof NotFoundErr) {
    res.status(404);
    resObj.errors.push({
      name: err.name,
      message: err.message,
    });
  } else if (err instanceof UnauthorizedErr) {
    res.status(401);
    resObj.errors.push({
      name: err.name,
      message: err.message,
    });
  } else if (err instanceof BadRequestErr) {
    res.status(400);
    resObj.errors.push({
      name: err.name,
      message: err.message,
    });
  }
  // it's a server err
  else {
    res.status(500);
    resObj.errors.push(new ServerErr());
    errorLogger({ title: 'SERVER-SIDE ERROR' }, [
      {
        err,
        headers: resObj.headers,
        body: resObj.body,
        parameters: resObj.parameters,
      },
    ]);
  }

  res.json(resObj);
};

export { handler as errorHandler};
