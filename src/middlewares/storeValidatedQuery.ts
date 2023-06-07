import { Request, Response } from "express";
import { ObjectSchema } from "joi";

function middleware(validator: ObjectSchema) {
  return async (req: Request, res: Response) => {
    let validatedQuery = await validator.validateAsync(req.query);
    res.locals.validQuery = validatedQuery;
  }
}

export { middleware as storeValidatedQuery };
