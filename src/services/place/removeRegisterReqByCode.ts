import { PlaceRegisterService } from "./registers.place.service";

async function removeRegisterReqByCode(this: PlaceRegisterService, code: string) {
  await this.registerReqs.delete({
    where: { code },
  });
}

export { removeRegisterReqByCode };
