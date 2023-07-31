import { prisma } from "../../config";

async function getAdminById(id: number) {
  return await prisma.admins.findUnique({
    where: { id },
  });
}

export { getAdminById };
