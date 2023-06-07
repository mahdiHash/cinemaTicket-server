import { Request, Response } from "express";
import { ObjectSchema } from 'joi';
import { type validInputs } from "../types/interfaces/inputs/validInputs";

function middleware(validator: ObjectSchema) {
  return async (req: Request, res: Response) => {
    let validatedBody = await validator.validateAsync(req.body) as validInputs;
    res.locals.validBody = validatedBody;
  }
}

export { middleware as storeValidatedInputs };
