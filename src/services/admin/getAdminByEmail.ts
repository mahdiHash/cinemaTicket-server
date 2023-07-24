import { prisma } from "../../config";
import { encrypt } from "../../helpers";

async function getAdminByEmail(email: string) {
  const encryptedEmail = encrypt(email) as string;

  return await prisma.admins.findFirst({
    where: { email: encryptedEmail },
  });
}

export { getAdminByEmail };
