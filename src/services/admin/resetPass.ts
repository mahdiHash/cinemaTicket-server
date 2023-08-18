import { prisma } from "../../config";
import { hash, compare } from "bcryptjs";
import { AdminService } from "./admin.service";
import { UnauthorizedErr } from "../../helpers/errors";

interface resetPassData {
  oldPass: string;
  oldPassInput: string;
  newPass: string;
}

async function resetPassById(this: AdminService, id: number, data: resetPassData) {
  const { oldPass, oldPassInput, newPass } = data;
  const doesPassMatch = await compare(oldPass, oldPassInput);

  if (!doesPassMatch) {
    throw new UnauthorizedErr('رمز ورود قدیمی اشتباه است.');
  }

  const hashedPass = await hash(newPass, 16);

  await prisma.admins.update({
    where: { id },
    data: {
      password: hashedPass,
    }
  });

  return newPass;
}

export { resetPassById };
