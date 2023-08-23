import { Request, Response } from 'express';
import { ForbiddenErr, NotFoundErr } from '../helpers/errors';
import { prisma } from '../config';
import { users } from '@prisma/client';

async function middleware(req: Request, res: Response) {
  const userObj = req.user as users;
  let registerationInfo = await prisma.non_approved_places.findUnique({
    where: { code: req.params.code },
  });

  if (!registerationInfo) {
    throw new NotFoundErr('کد ثبت پیدا نشد.');
  }

  if (registerationInfo.owner_id !== userObj.id) {
    throw new ForbiddenErr();
  }
}

export { middleware as placeRegisterOwnerAuth};
