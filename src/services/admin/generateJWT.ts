import { sign } from 'jsonwebtoken';
import { envVariables } from '../../config';
import { admins } from '@prisma/client';
import { adminPermissions } from '../../config';

async function generateJWT(data: admins) {
  const { password, profile_pic_fileId, ...adminInfo } = data;
  const token = sign(
    { ...adminInfo, permissions: adminPermissions[adminInfo.access_level] },
    envVariables.jwtTokenSecret,
    { expiresIn: '7d' }
  );

  return token;
}

export { generateJWT };
