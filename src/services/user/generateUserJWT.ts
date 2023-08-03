import { sign } from 'jsonwebtoken';
import { users } from '@prisma/client';
import { envVariables } from '../../config';

async function generateUserJWT(data: Pick<users, 'tel' | 'id'>) {
  const token = sign(
    { tel: data.tel, id: data.id }, 
    envVariables.jwtTokenSecret, 
    { expiresIn: '90d' }
  );

  return token;
}

export { generateUserJWT };
