import { Request, Response } from 'express';
import { ForbiddenErr, NotFoundErr } from '../helpers/errors';
import { users } from '@prisma/client';
import { PlaceRegisterService } from '../services';

const PlaceRegister = new PlaceRegisterService();

async function middleware(req: Request, res: Response) {
  const userObj = req.user as users;
  let registerationInfo = await PlaceRegister.getRegisterReqByCode(req.params.code);

  if (!registerationInfo) {
    throw new NotFoundErr('کد ثبت پیدا نشد.');
  }

  if (registerationInfo.owner_id !== userObj.id) {
    throw new ForbiddenErr();
  }
}

export { middleware as placeRegisterOwnerAuth};
