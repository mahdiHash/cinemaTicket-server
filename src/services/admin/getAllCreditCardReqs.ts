import { prisma } from "../../config";
import { getManyRecordsQeuryOptions } from "../../types/interfaces/dbQuery";

async function getAllCreditCardReqs(options: getManyRecordsQeuryOptions) {
  return await prisma.credit_card_auth.findMany({
    ...options
  });
}
