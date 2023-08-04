import { NotFoundErr } from "../../helpers/errors";
import { PlaceService } from "./place.service";

async function getRegisterReqByCode(this: PlaceService, code: string) {
  const registerReq = await this.registerModel.findUnique({
    where: { code },
  });

  if (registerReq === null) {
    throw new NotFoundErr('درخواستی با این کد پیدا نشد');
  }

  return registerReq;
}

export { getRegisterReqByCode };
