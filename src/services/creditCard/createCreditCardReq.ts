import { CreditCardService } from "./creditCard.service";
import { encrypt } from "../../helpers";
import { submitCreditCard } from "../../types/interfaces/inputs";
import { ForbiddenErr, NotFoundErr } from "../../helpers/errors";

async function createCreditCardReq(this: CreditCardService, id: number, inputs: submitCreditCard) {
  try {
    const duplicateReq = await this.getCreditCardReqStatus(id);

    if (duplicateReq) {
      throw new ForbiddenErr('تنها یک درخواست می‌توان ثبت کرد');
    }
  } catch (err) {
    if (!(err instanceof NotFoundErr)) {
      throw err;
    }

    const creditCardReq = await this.creditCardReqs.create({
      data: {
        user_id: id,
        credit_card_number: encrypt(inputs.creditCard) as string,
        national_id: encrypt(inputs.nationalId) as string,
      }
    });

    return await this.decryptCreditCardReqData(creditCardReq);
  }
}

export { createCreditCardReq };
