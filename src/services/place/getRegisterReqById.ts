import { NotFoundErr } from "../../helpers/errors";
import { PlaceService } from "./place.service";

async function getRegisterReqById(this: PlaceService, id: number) {
  const place = this.registerModel.findUnique({
    where: { id },
  });

  if (place === null) {
    throw new NotFoundErr('درخواست ثبت نام با این شناسه پیدا نشد');
  }

  return place;
}

export { getRegisterReqById };
