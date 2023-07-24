import { prisma } from "../../config";

async function deleteAdminById(id: number) {
  return await prisma.admins.delete({
    where: { id },
  });
}

export { deleteAdminById };
