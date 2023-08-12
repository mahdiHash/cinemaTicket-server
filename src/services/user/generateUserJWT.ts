import { sign } from 'jsonwebtoken';
import { users } from '@prisma/client';
import { envVariables } from '../../config';
import { encrypt } from '../../helpers';

async function generateUserJWT(data: Pick<users, 'tel' | 'id'>) {
  const { id, tel} = data;
  const token = sign(
    { tel: encrypt(tel), id }, 
    envVariables.jwtTokenSecret, 
    { expiresIn: '90d' }
  );

  return token;
}

export { generateUserJWT };
