import { PlaceRegisterService } from "./registers.place.service";
import { BadRequestErr } from "../../helpers/errors";

async function approveRegisterReq(this: PlaceRegisterService, regReqId: number) {
  const registerReq = await this.getRegisterReqById(regReqId);

  if (registerReq!.status === 'denied' || registerReq!.status === 'approved') {
    throw new BadRequestErr('وضعیت ثبت این درخواست را نمی‌توان تغییر داد.');
  }

  const place = await this.places.createPlace(registerReq!, false);
  
  await this.updateRegisterReq(regReqId, 'approved');

  return place;
}

export { approveRegisterReq };
