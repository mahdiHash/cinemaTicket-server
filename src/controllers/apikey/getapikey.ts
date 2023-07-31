import { Request, Response, NextFunction } from 'express';
import { ApiKeyService } from '../../services/apikey/apikey.service';

const controller = async (req: Request, res: Response, next: NextFunction) => {
  const key = await ApiKeyService.generateApiKey();
  
  res.json(key);
}

export default controller;
