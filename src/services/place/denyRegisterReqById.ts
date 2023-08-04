import { PlaceService } from "./place.service";
import { BadRequestErr } from "../../helpers/errors";

async function denyRegisterReqById(this: PlaceService, id: number) {
  const registerReq = await this.getRegisterReqById(id);
  
  if (registerReq!.status === 'approved' || registerReq!.status === 'denied') {
    throw new BadRequestErr('وضعیت ثبت این درخواست را نمی‌توان تغییر داد.');
  }

  await this.updateRegisterReqById(id, 'denied');
}

export { denyRegisterReqById };
