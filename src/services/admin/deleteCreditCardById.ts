import { prisma } from "../../config";

async function deleteCreditCardById(id: number) {
  return await prisma.credit_card_auth.delete({
    where: { id },
  });
}

export { deleteCreditCardById };
