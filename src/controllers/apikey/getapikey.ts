import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { prisma } from '../../config';

const controller = async (req: Request, res: Response, next: NextFunction) => {
  let key;

  while (true) {
    key = crypto.randomBytes(32).toString('hex');
    let duplicate = await prisma.api_keys.findFirst({ where: { key }});

    if (!duplicate) {
      break;
    }
  }

  await prisma.api_keys.create({
    data: {
      key,
    }
  })
  res.json(key);
}

export default controller;
