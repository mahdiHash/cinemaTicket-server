import { passport, storeImgLocally, imageKit, envVariables } from '../../config';
import { updateAdminInpValidator } from '../../validation/inputValidators';
import { storeValidatedInputs, middlewareWrapper } from '../../middlewares';
import { encrypt, decrypt } from '../../helpers';
import { Request, Response } from 'express';
import { admins } from '@prisma/client';
import { sign } from 'jsonwebtoken';
import { AdminService } from '../../services';

const Admin = new AdminService();
const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  storeImgLocally.single('img'),

  middlewareWrapper(storeValidatedInputs(updateAdminInpValidator)),

  middlewareWrapper(async function middleware(req: Request, res: Response) {
    const reqAdminObj = req.user as admins;

    if (req.file) {
      await Admin.uploadAdminProfilePic(reqAdminObj.id, req.file.path);
    }

    let upAdmin = await Admin.updateAdminById(reqAdminObj.id, res.locals.validBody) as admins;
    let token = await Admin.generateJWT(upAdmin);

    res.cookie('authToken', token, {
      maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
      httpOnly: true,
      signed: true,
      sameSite: 'lax',
      secure: envVariables.env === 'production',
      domain: envVariables.env === 'dev' ? 'localhost' : 'example.com',
    });

    res.json({
      admin: upAdmin,
      message: 'اطلاعات شما تغییر کرد.',
    });
  }),
];

export { controller as updateProfileInfo };
