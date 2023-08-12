import { CreditCardService } from "./creditCard.service";

async function removeCreditCardReqById(this: CreditCardService, id: number) {
  await this.creditCardReqs.delete({
    where: { id },
  });
}

export { removeCreditCardReqById };
