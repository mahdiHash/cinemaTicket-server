import { UserService } from "./user.service";

async function cancelCreditCardReq(this: UserService, id: number) {
  await this.creditCards.deleteMany({
    where: { user_id: id },
  });
}

export { cancelCreditCardReq };
