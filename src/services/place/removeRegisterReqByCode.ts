import { PlaceService } from "./place.service";

async function removeRegisterReqByCode(this: PlaceService, code: string) {
  await this.registerModel.delete({
    where: { code },
  });
}

export { removeRegisterReqByCode };
