import { prisma } from "../../config";

async function checkDuplicateTel(tel: string) {
  const duplicate = await prisma.users.findFirst({
    where: { tel },
  });

  if (duplicate) {
    return true;
  }
  else {
    return false;
  }
}

export { checkDuplicateTel };
