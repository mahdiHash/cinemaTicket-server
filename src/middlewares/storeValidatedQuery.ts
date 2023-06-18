import { Request, Response } from "express";
import { ObjectSchema } from "joi";
import { validQueries } from "../types/interfaces/queries/validQueries";

function middleware(validator: ObjectSchema) {
  return async (req: Request, res: Response) => {
    let validatedQuery = await validator.validateAsync(req.query) as validQueries;
    res.locals.validQuery = validatedQuery;
  }
}

export { middleware as storeValidatedQuery };
