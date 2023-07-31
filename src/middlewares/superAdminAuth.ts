import { Request, Response } from 'express';
import { admins } from '@prisma/client';
import { ForbiddenErr } from '../helpers/errors';

async function middleware(req: Request, res: Response) {
  const adminObj = req.user as admins;

  if (adminObj.access_level !== 'super') {
    throw new ForbiddenErr(
      'تنها ادمین‌های برتر می‌توانند به این منبع دسترسی داشته باشند یا این اقدام را انجام دهند.'
    );
  }
};

export { middleware as superAdminAuth };
