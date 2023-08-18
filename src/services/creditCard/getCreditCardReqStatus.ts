import { CreditCardService } from "./creditCard.service";
import { decrypt } from "../../helpers";
import { NotFoundErr } from "../../helpers/errors";

async function getCreditCardReqStatus(this: CreditCardService, userId: number) {
  const creditCardReq = await this.creditCardReqs.findFirst({
    where: { user_id: userId },
    select: {
      id: true,
      credit_card_number: true,
      national_id: true,
    }
  });

  if (creditCardReq === null) {
    throw new NotFoundErr('درخواستی برای ثبت شماره کارت وجود ندارد');
  }

  return await this.decryptCreditCardReqData(creditCardReq);
}

export { getCreditCardReqStatus };
