import { prisma } from '../config';
import { submitCreditCard } from '../types/interfaces/inputs';
import { ForbiddenErr, NotFoundErr } from '../helpers/errors';
import { encrypt, decrypt } from '../helpers';
import { credit_card_auth } from '@prisma/client';

type encryptedCredtCardReqType = Omit<credit_card_auth, 'user_id'> & {
  user_id?: number;
};

class CreditCardService {
  constructor(private readonly creditCardReqs = prisma.credit_card_auth) {}

  public async createCreditCardReq(userId: number, data: submitCreditCard) {
    try {
      const duplicateReq = await this.getCreditCardReqStatus(userId);

      if (duplicateReq) {
        throw new ForbiddenErr('تنها یک درخواست می‌توان ثبت کرد');
      }
    } catch (err) {
      if (!(err instanceof NotFoundErr)) {
        throw err;
      }

      const creditCardReq = await this.creditCardReqs.create({
        data: {
          user_id: userId,
          credit_card_number: encrypt(data.creditCard) as string,
          national_id: encrypt(data.nationalId) as string,
        },
      });

      return await this.decryptCreditCardReqData(creditCardReq);
    }
  }

  public async decryptCreditCardReqData(data: encryptedCredtCardReqType) {
    const creditCardReq = { ...data };

    creditCardReq.credit_card_number = decrypt(creditCardReq.credit_card_number) as string;
    creditCardReq.national_id = decrypt(creditCardReq.national_id) as string;

    return creditCardReq;
  }

  public async getAllCreditCardReqs(cursor?: number) {
    const creditCardReqs = await this.creditCardReqs.findMany({
      where: {},
      orderBy: { id: 'asc' },
      select: {
        id: true,
        credit_card_number: true,
        national_id: true,
        user: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
      take: 15,
      cursor: cursor ? { id: cursor + 1 } : undefined,
    });

    for (let i = 0; i < creditCardReqs.length; i++) {
      // @ts-ignore
      creditCardReqs[i] = await this.decryptCreditCardReqData(creditCardReqs[i]);
    }

    return creditCardReqs;
  }

  public async getCreditCardReqById(ccReqId: number) {
    const creditCardReq = await this.creditCardReqs.findUnique({
      where: { id: ccReqId },
    });

    if (creditCardReq === null) {
      throw new NotFoundErr('درخواست احراز هویت کارت بانکی پیدا نشد');
    }

    return this.decryptCreditCardReqData(creditCardReq);
  }

  public async getCreditCardReqStatus(userId: number) {
    const creditCardReq = await this.creditCardReqs.findFirst({
      where: { user_id: userId },
      select: {
        id: true,
        credit_card_number: true,
        national_id: true,
      },
    });

    if (creditCardReq === null) {
      throw new NotFoundErr('درخواستی برای ثبت شماره کارت وجود ندارد');
    }

    return await this.decryptCreditCardReqData(creditCardReq);
  }

  public async removeCreditCardReq(ccReqId: number) {
    await this.creditCardReqs.delete({
      where: { id: ccReqId },
    });
  }

  public async removeCreditCardReqByUserId(userId: number) {
    await this.creditCardReqs.deleteMany({
      where: { user_id: userId },
    });
  }
}

export { CreditCardService };
