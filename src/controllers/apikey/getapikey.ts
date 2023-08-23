import { Request, Response, NextFunction } from 'express';
import { ApiKeyService } from '../../services';

const ApiKey = new ApiKeyService();
const controller = async (req: Request, res: Response, next: NextFunction) => {
  const key = await ApiKey.generateApiKey();
  
  res.json(key);
}

export default controller;
