import { non_approved_places } from "@prisma/client";
import { Request, Response } from "express";
import { prisma, passport } from "../../config";
import { placeRegisterOwnerAuth, middlewareWrapper } from "../../middlewares";

const controller = [
  // authorization
  passport.authenticate('jwt', { session: false }),

  middlewareWrapper(placeRegisterOwnerAuth),

  middlewareWrapper(middleware),
];

export { controller as trackRegisterStat };

async function middleware(req: Request, res: Response) {
  let place = await prisma.non_approved_places.findUnique({
    where: { code: req.params.code },
  }) as NonNullable<non_approved_places>;
  
  res.json({
    name: place.name,
    type: place.type,
    license_id: place.license_id,
    address: place.address,
    city: place.city,
    status: place.status,
  });
}

