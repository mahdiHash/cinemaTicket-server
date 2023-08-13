import { PlaceRegisterService } from "./registers.place.service";
import { non_approved_places_status } from "@prisma/client";

async function updateRegisterReq(this: PlaceRegisterService, id: number, status: non_approved_places_status) {
  const registerReq = await this.getRegisterReqById(id);
  const upRegisterReq = await this.registerReqs.update({
    where: { id: registerReq!.id },
    data: { status },
  });

  return upRegisterReq;
}

export { updateRegisterReq };
