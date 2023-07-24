import { prisma } from "../../config";
import { encrypt } from "../../helpers";

async function getAdminByNationalId(nationalId: string) {
  const encryptedId = encrypt(nationalId) as string;

  return await prisma.admins.findFirst({
    where: { national_id: encryptedId },
  });
}

export { getAdminByNationalId };
