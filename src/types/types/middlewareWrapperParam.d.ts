import { Request, Response } from 'express';

type param = (req: Request, res: Response) => Promise<unknown>;

export { param as middlewareWrapperParam };
