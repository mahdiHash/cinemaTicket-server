import { Request, Response} from 'express';
import { ApiKeyErr } from '../helpers/errors';
import { ApiKeyService } from '../services/apikey/apikey.service';

async function middleware(req: Request, res: Response) {
  let record = await ApiKeyService.findApiKeyByKey(req.headers.apikey as string);
  
  if (record === null) {
    throw new ApiKeyErr();
  }
}

export { middleware as authorizeApiKey };
