import { NotFoundErr } from "../../helpers/errors";
import { CreditCardService } from "./creditCard.service";

async function getCreditCardReqById(this: CreditCardService, id: number) {
  const creditCardReq =  await this.creditCardReqs.findUnique({
    where: { id },
  });

  if (creditCardReq === null) {
    throw new NotFoundErr('درخواست احراز هویت کارت بانکی پیدا نشد');
  }

  return this.decryptCreditCardReqData(creditCardReq);
}

export { getCreditCardReqById };
