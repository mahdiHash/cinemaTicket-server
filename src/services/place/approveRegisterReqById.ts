import { PlaceService } from "./place.service";
import { BadRequestErr } from "../../helpers/errors";

async function approveRegisterReqById(this: PlaceService, id: number) {
  const registerReq = await this.getRegisterReqById(id);

  if (registerReq!.status === 'denied' || registerReq!.status === 'approved') {
    throw new BadRequestErr('وضعیت ثبت این درخواست را نمی‌توان تغییر داد.');
  }

  const place = await this.createPlace(registerReq!, false);
  
  await this.updateRegisterReqById(id, 'approved');

  return place;
}

export { approveRegisterReqById };
