import { Request, Response } from 'express';
import { passport, storeImgLocally, envVariables } from '../../config';
import { updateUserProfileInpValidator } from '../../validation/inputValidators';
import { storeValidatedInputs, middlewareWrapper } from '../../middlewares';
import { users } from '@prisma/client';
import { UserService } from '../../services';

const User = new UserService();
const controller = [
  passport.authenticate('jwt', { session: false }),

  storeImgLocally.single('img'),

  middlewareWrapper(storeValidatedInputs(updateUserProfileInpValidator)),

  middlewareWrapper(async (req: Request, res: Response) => {
    const reqUserObj = req.user as users;
    
    if (req.file) {
      await User.uploadProfilePic(reqUserObj.id, req.file);
    }
    
    const upUser = await User.updateUserById(reqUserObj.id, res.locals.validBody) as users;
    const token = await User.generateUserJWT(upUser);
  
    res.cookie('authToken', token, {
      maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
      httpOnly: true,
      signed: true,
      sameSite: 'lax',
      secure: envVariables.env === 'production',
      domain: envVariables.env === 'dev' ? 'localhost' : 'example.com',
    });
  
    res.json({
      message: 'اطلاعات پروفایل تغییر کرد.',
    });
  }
  ),
];

export { controller as updateProfile };
