import { CreditCardService } from "./creditCard.service";

async function removeCreditCardReqByUserId(this: CreditCardService, userId: number) {
  await this.creditCardReqs.deleteMany({
    where: { user_id: userId },
  });
}

export { removeCreditCardReqByUserId };
