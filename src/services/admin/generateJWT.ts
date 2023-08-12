import { sign } from "jsonwebtoken";
import { envVariables } from "../../config";
import { encrypt } from "../../helpers";
import { admins } from "@prisma/client";

async function generateJWT(data: Pick<admins, 'id' | 'tel'>) {
  const { id, tel } = data;
  const token = sign(
    { id, tel: encrypt(tel) },
    envVariables.jwtTokenSecret,
    { expiresIn: '7d' },
  );

  return token;
}

export { generateJWT };
