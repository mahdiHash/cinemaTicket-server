import { prisma } from "../../config";
import { userFinUpdateInputs } from "../../types/interfaces/inputs";

async function updateUserFinInfoById(id: number, data: userFinUpdateInputs) {
  return await prisma.users.update({
    where: { id },
    data
  });
}

export { updateUserFinInfoById };
