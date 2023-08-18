import { NotFoundErr } from "../../helpers/errors";
import { PlaceRegisterService } from "./registers.place.service";

async function getRegisterReqByCode(this: PlaceRegisterService, code: string) {
  const registerReq = await this.registerReqs.findUnique({
    where: { code },
  });

  if (registerReq === null) {
    throw new NotFoundErr('درخواستی با این کد پیدا نشد');
  }

  return registerReq;
}

export { getRegisterReqByCode };
