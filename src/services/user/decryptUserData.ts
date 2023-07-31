import { users } from "@prisma/client";
import { decrypt } from "../../helpers";

async function decryptUserData(data: users) {
  const user = { ...data };

  user.email = decrypt(user.email);
  user.national_id = decrypt(user.national_id);
  user.credit_card_num = decrypt(user.credit_card_num);
  user.tel = decrypt(user.tel) as string;

  return user;
}

export { decryptUserData };
