import { PlaceService } from "./place.service";

async function getOwnerRegisterReqCountById(this: PlaceService, id: number) {
  return await this.registerModel.count({
    where: { owner_id: id, status: 'waiting' },
  });
}

export { getOwnerRegisterReqCountById };
