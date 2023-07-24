import { prisma } from "../../config";
import { encrypt } from "../../helpers";

async function getUserByEmail(email: string) {
  const encryptedEmail = encrypt(email) as string;
  return await prisma.users.findFirst({
    where: { email: encryptedEmail },
  });
}

export { getUserByEmail };
