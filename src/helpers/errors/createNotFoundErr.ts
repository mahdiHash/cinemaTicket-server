import { NotFoundErr } from "./notFoundErr.js";
import { Request, Response, NextFunction } from "express";

const controller = (req: Request, res: Response, next: NextFunction) => {
  if (req instanceof Error) {
    next(req);
  }
  else {
    next(new NotFoundErr());
  }
}

export { controller as createNotFoundErr };
