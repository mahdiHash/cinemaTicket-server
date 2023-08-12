import { CreditCardService } from "./creditCard.service";

async function getAllCreditCardReqs(this: CreditCardService, cursor?: number) {
  const creditCardReqs = await this.creditCardReqs.findMany({
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

  for (let req of creditCardReqs) {
    await this.decryptCreditCardReqData(req);
  }

  return creditCardReqs;
}

export { getAllCreditCardReqs };
