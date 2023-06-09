import { Request, Response} from 'express';
import { ApiKeyErr, BadRequestErr } from '../helpers/errors';
import { prisma } from '../config';

async function middleware(req: Request, res: Response) {
  let key = req.headers.apikey as string;

  if (key === null || key === undefined || typeof key !== 'string') {
    throw new ApiKeyErr();
  }

  let record = await prisma.api_keys.findUnique({ where: { key } });
  
  if (record === null) {
    throw new ApiKeyErr();
  }
}

export { middleware as authorizeApiKey };
