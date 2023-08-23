import { Request, Response } from "express";
import { prisma, passport } from '../../config';
import { decrypt } from '../../helpers';
import { superAdminAuth, middlewareWrapper } from "../../middlewares";
import { admins } from "@prisma/client";

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(superAdminAuth),

  middlewareWrapper(middleware)

];

export { controller as getAllAdminsProfiles }

async function middleware(req: Request, res: Response) {
  let reqAdminObj = req.user as admins;
  let admins = await prisma.admins.findMany({
    where: { id: { not: reqAdminObj.id }},
    orderBy: [ { access_level: 'asc'}, { full_name: 'asc' } ],
  });
  
  for (let admin of admins) {
    admin.tel = decrypt(admin.tel) as string;
    admin.email = decrypt(admin.email) as string;
    admin.home_tel = decrypt(admin.home_tel) as string;
    admin.national_id = decrypt(admin.national_id) as string;
    admin.full_address = decrypt(admin.full_address) as string;

  }
  
  res.json(admins.map((admin) => {
    // remove two fields from admin objects
    let { password, profile_pic_fileId, ...rest} = admin;
    return rest;
  }));
}
