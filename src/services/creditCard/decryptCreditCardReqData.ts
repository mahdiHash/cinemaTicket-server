import { decrypt } from '../../helpers';
import { credit_card_auth } from '@prisma/client';

type encryptedCredtCardReqType = Omit<credit_card_auth, 'user_id'> & {
  user_id?: number;
}

async function decryptCreditCardReqData(data: encryptedCredtCardReqType) {
  const creditCardReq = {...data};

  creditCardReq.credit_card_number = decrypt(creditCardReq.credit_card_number) as string;
  creditCardReq.national_id = decrypt(creditCardReq.national_id) as string;

  return creditCardReq;
}

export { decryptCreditCardReqData };
