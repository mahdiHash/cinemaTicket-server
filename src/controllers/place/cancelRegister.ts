import { Request, Response } from "express";
import { prisma, passport } from "../../config";
import { placeRegisterOwnerAuth, middlewareWrapper } from "../../middlewares";

const controller = [
  // authorization
  passport.authenticate('jwt', { session: false }),

  middlewareWrapper(placeRegisterOwnerAuth),

  middlewareWrapper(middleware),
];

export { controller as cancelRegister };

async function middleware(req: Request, res: Response) {
  await prisma.non_approved_places.delete({
    where: { code: req.params.code },
  });
  
  res.json({
    message: "درخواست ثبت مکان لغو شد."
  });
}
