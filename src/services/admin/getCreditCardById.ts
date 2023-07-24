import { prisma } from '../../config';

async function getCreditCardById(id: number) {
  return await prisma.credit_card_auth.findUnique({
    where: { id },
  });
}

export { getCreditCardById };
