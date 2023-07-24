import { prisma } from "../../config";

async function getAllCreditCardReqs(cursor?: number) {
  return await prisma.credit_card_auth.findMany({
    orderBy: { id: 'asc' },
    select: {
      id: true,
      credit_card_number: true,
      national_id: true,
      user: {
        select: {
          first_name: true,
          last_name: true,
        }
      }
    },
    take: 15,
    cursor: cursor 
      ? { id: cursor + 1 }
      : undefined,
  });
}

export { getAllCreditCardReqs };
