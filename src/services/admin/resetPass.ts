import { prisma } from "../../config";
import { hash, compare } from "bcryptjs";
import { AdminService } from "./admin.service";
import { UnauthorizedErr } from "../../helpers/errors";

async function resetPassById(this: AdminService, id: number, oldPass: string, newPass: string) {
  const admin = await this.getAdminById(id);
  const doesPassMatch = await compare(oldPass, admin!.password);

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
