import { NotFoundErr } from "../../helpers/errors";
import { PlaceRegisterService } from "./registers.place.service";

async function getRegisterReqById(this: PlaceRegisterService, id: number) {
  const place = this.registerReqs.findUnique({
    where: { id },
  });

  if (place === null) {
    throw new NotFoundErr('درخواست ثبت نام با این شناسه پیدا نشد');
  }

  return place;
}

export { getRegisterReqById };
