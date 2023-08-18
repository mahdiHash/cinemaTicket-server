import { PlaceRegisterService } from "./registers.place.service";

async function getOwnerRegisterReqCountById(this: PlaceRegisterService, id: number) {
  return await this.registerReqs.count({
    where: { owner_id: id, status: 'waiting' },
  });
}

export { getOwnerRegisterReqCountById };
