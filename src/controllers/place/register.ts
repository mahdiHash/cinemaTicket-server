import { Request, Response } from "express";
import { prisma, passport } from "../../config";
import { placeRegisterInpValidator } from "../../validation/inputValidators";
import { randomBytes } from "crypto";
import { storeValidatedInputs, middlewareWrapper } from "../../middlewares";
import { BadRequestErr, ForbiddenErr } from "../../helpers/errors";
import { users } from "@prisma/client";

const contoller = [
  // authorization
  passport.authenticate('jwt', { session: false }),

  middlewareWrapper(storeValidatedInputs(placeRegisterInpValidator)),

  middlewareWrapper(middleware),
];

export { contoller as register };

async function middleware(req: Request, res: Response) {
  const reqUserObj = req.user as users;
  // check if the uesr has 5 >= pending requests
  let ownerRegistersCount = await prisma.non_approved_places.count({
    where: { owner_id: reqUserObj.id, status: 'waiting' },
  });

  if (ownerRegistersCount >= 5) {
    throw new ForbiddenErr('شما نمی‌توانید بیشتر از 5 درخواست ثبت کنید.');
  }

  let code: string;

  // generate a unique code
  while (true) {
    code = randomBytes(8).toString('hex');
    let duplicate = await prisma.non_approved_places.findUnique({
      where: { code }
    });

    if (!duplicate) {
      break;
    }
  }

  // look up a duplicate license_id
  let place = await prisma.non_approved_places.findFirst({
    where: {
      license_id: res.locals.validBody.license_id,
      OR: [
        { status: 'waiting' },
        { status: 'approved' },
      ],
    }
  });
  
  if (place) {
    throw new BadRequestErr('قبلاً یک مکان با این شماره گواهینامه ثبت شده است.');
  }
  
  await prisma.non_approved_places.create({
    data: {
      owner_id: reqUserObj.id,
      status: 'waiting',
      code,
      ...res.locals.validBody,
    }
  });

  res.json({
    code,
    message: "درخواست ثبت مکان ایجاد شد."
  });
}
