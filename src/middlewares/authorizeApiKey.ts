import { Request, Response} from 'express';
import { ApiKeyErr } from '../helpers/errors';
import { prisma } from '../config';

async function middleware(req: Request, res: Response) {
  let key = req.headers.apikey as string;
  let record = await prisma.api_keys.findUnique({ where: { key } });
  
  if (record === null) {
    throw new ApiKeyErr();
  }
}

export { middleware as authorizeApiKey };
