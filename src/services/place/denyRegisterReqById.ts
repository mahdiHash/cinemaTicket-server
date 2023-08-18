import { PlaceRegisterService } from "./registers.place.service";
import { BadRequestErr } from "../../helpers/errors";

async function denyRegisterReq(this: PlaceRegisterService, regReqId: number) {
  const registerReq = await this.getRegisterReqById(regReqId);
  
  if (registerReq!.status === 'approved' || registerReq!.status === 'denied') {
    throw new BadRequestErr('وضعیت ثبت این درخواست را نمی‌توان تغییر داد.');
  }

  await this.updateRegisterReq(regReqId, 'denied');
}

export { denyRegisterReq };
