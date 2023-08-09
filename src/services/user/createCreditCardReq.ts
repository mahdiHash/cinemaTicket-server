import { UserService } from "./user.service";
import { decrypt, encrypt } from "../../helpers";
import { submitCreditCard } from "../../types/interfaces/inputs";
import { ForbiddenErr, NotFoundErr } from "../../helpers/errors";

async function createCreditCardReq(this: UserService, id: number, inputs: submitCreditCard) {
  try {
    const duplicateReq = await this.getCreditCardReqStatus(id);

    if (duplicateReq) {
      throw new ForbiddenErr('تنها یک درخواست می‌توان ثبت کرد');
    }
  } catch (err) {
    if (!(err instanceof NotFoundErr)) {
      throw err;
    }

    const creditCardReq = await this.creditCards.create({
      data: {
        user_id: id,
        credit_card_number: encrypt(inputs.creditCard) as string,
        national_id: encrypt(inputs.nationalId) as string,
      }
    });

    creditCardReq.credit_card_number = decrypt(creditCardReq.credit_card_number) as string;
    creditCardReq.national_id = decrypt(creditCardReq.national_id) as string;

    return creditCardReq;
  }
}

export { createCreditCardReq };
