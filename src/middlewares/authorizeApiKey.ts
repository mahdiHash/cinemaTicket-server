import { Request, Response} from 'express';
import { ApiKeyErr } from '../helpers/errors';
import { ApiKeyService } from '../services';

const ApiKey = new ApiKeyService();
async function middleware(req: Request, res: Response) {
  let record = await ApiKey.findApiKeyByKey(req.headers.apikey as string);
  
  if (record === null) {
    throw new ApiKeyErr();
  }
}

export { middleware as authorizeApiKey };
