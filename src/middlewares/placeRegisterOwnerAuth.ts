import { Request, Response } from 'express';
import { ForbiddenErr, NotFoundErr } from '../helpers/errors';
import { users } from '@prisma/client';
import { PlaceService } from '../services';

const Place = new PlaceService();

async function middleware(req: Request, res: Response) {
  const userObj = req.user as users;
  let registerationInfo = await Place.getRegisterReqByCode(req.params.code);

  if (!registerationInfo) {
    throw new NotFoundErr('کد ثبت پیدا نشد.');
  }

  if (registerationInfo.owner_id !== userObj.id) {
    throw new ForbiddenErr();
  }
}

export { middleware as placeRegisterOwnerAuth};
