import { prisma } from "../../config";
import { encrypt } from "../../helpers";

async function getAdminByTel(tel: string) {
  const encryptedTel = encrypt(tel) as string;

  return await prisma.admins.findFirst({
    where: { tel: encryptedTel },
  });
}

export { getAdminByTel };
