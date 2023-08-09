import { UserService } from "./user.service";
import { decrypt } from "../../helpers";
import { NotFoundErr } from "../../helpers/errors";

async function getCreditCardReqStatus(this: UserService, userId: number) {
  const creditCardReq = await this.creditCards.findFirst({
    where: { user_id: userId },
    select: {
      credit_card_number: true,
      national_id: true,
    }
  });

  if (creditCardReq === null) {
    throw new NotFoundErr('درخواستی برای ثبت شماره کارت وجود ندارد');
  }

  creditCardReq.credit_card_number = decrypt(creditCardReq.credit_card_number) as string;
  creditCardReq.national_id = decrypt(creditCardReq.national_id) as string;

  return creditCardReq;
}

export { getCreditCardReqStatus };
