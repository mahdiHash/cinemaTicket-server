import { prisma } from '../../config';
import {
  getCreditCardReqById,
  decryptCreditCardReqData,
  removeCreditCardReqById,
  getAllCreditCardReqs,
  removeCreditCardReqByUserId,
  getCreditCardReqStatus,
  createCreditCardReq
} from './';

class CreditCardService {
  constructor(protected readonly creditCardReqs = prisma.credit_card_auth) {}

  public getCreditCardReqById = getCreditCardReqById;
  public decryptCreditCardReqData = decryptCreditCardReqData;
  public removeCreditCardReqById = removeCreditCardReqById;
  public getAllCreditCardReqs = getAllCreditCardReqs;
  public removeCreditCardReqByUserId = removeCreditCardReqByUserId;
  public getCreditCardReqStatus = getCreditCardReqStatus;
  public createCreditCardReq = createCreditCardReq;
}

export { CreditCardService };
