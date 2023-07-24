import { prisma } from "../../config";

async function getUserById(id: number) {
  return await prisma.users.findUnique({
    where: { id },
  });
}

export { getUserById };
