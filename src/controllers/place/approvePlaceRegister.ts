import { Request, Response } from "express";
import { prisma, passport } from "../../config";
import { superAdminAuth, middlewareWrapper } from "../../middlewares";
import { hashSync } from "bcryptjs";
import { BadRequestErr, NotFoundErr } from "../../helpers/errors";

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(superAdminAuth),

  middlewareWrapper(middleware),
];

export { controller as approvePlaceRegister };

async function middleware(req: Request, res: Response) {
  if (!Number.isFinite(+req.params.id)) {
    throw new BadRequestErr('پارامتر id باید یک عدد باشد.');
  }

  let register = await prisma.non_approved_places.findUnique({
    where: { id: +req.params.id },
  });

  if (!register) {
    throw new NotFoundErr('درخواستی برای این مکان پیدا نشد.');
  }

  if (register.status === 'denied' || register.status === 'approved') {
    throw new BadRequestErr('وضعیت ثبت این درخواست را نمی‌توان تغییر داد.');
  }

  await prisma.places.create({
    data: {
      owner_id: register.owner_id,
      name: register.name,
      type: register.type,
      license_id: register.license_id,
      address: register.address,
      city: register.city,
      password: hashSync(register.code),
    },
  });

  await prisma.non_approved_places.update({
    where: { id: register.id },
    data: { status: 'approved' },
  })
  res.json({
    message: "درخواست ثبت مکان تأیید شد."
  });
}
