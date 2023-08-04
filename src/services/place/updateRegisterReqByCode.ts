import { PlaceService } from "./place.service";
import { non_approved_places_status } from "@prisma/client";

async function updateRegisterReqById(this: PlaceService, id: number, status: non_approved_places_status) {
  const registerReq = await this.getRegisterReqById(id);
  const upRegisterReq = await this.registerModel.update({
    where: { id: registerReq!.id },
    data: { status },
  });

  return upRegisterReq;
}

export { updateRegisterReqById };
