import { prisma } from "../../config";
import { encrypt } from "../../helpers";

async function getUserByTel(tel: string) {
  const encryptedTel = encrypt(tel) as string;
  return await prisma.users.findFirst({
    where: { tel: encryptedTel },
  });
}

export { getUserByTel };
