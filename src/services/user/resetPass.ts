import { UnauthorizedErr } from "../../helpers/errors";
import { UserService } from "./user.service";
import { compare, hash } from "bcryptjs";

interface passInfo {
  oldPass: string;
  oldPassInp: string;
  newPass: string,
}

async function resetPass(this: UserService, id: number, inputs: passInfo) {
  const { oldPass, oldPassInp, newPass } = inputs;
  const doesPassMatch = await compare(oldPassInp, oldPass);

  if (!doesPassMatch) {
    throw new UnauthorizedErr('رمز ورود اشتباه است');
  }

  const newHashedPass = await hash(newPass, 16);

  await this.users.update({
    where: { id },
    data: {
      password: newHashedPass,
    }
  });
}

export { resetPass };
