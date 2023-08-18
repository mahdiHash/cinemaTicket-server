import { sign } from 'jsonwebtoken';
import { users } from '@prisma/client';
import { envVariables } from '../../config';

async function generateUserJWT(data: users) {
  const { password, profile_pic_fileId, ...userInfo} = data;
  const token = sign(
    { ...userInfo, permissions: [] },
    envVariables.jwtTokenSecret, 
    { expiresIn: '90d' }
  );

  return token;
}

export { generateUserJWT };
