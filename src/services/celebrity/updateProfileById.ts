import { CelebrityService } from "./celebrity.service";
import { celebProfileUpdate } from "../../types/interfaces/updateFields";

async function updateProfileById(this: CelebrityService, id: number, data: celebProfileUpdate) {
  const celeb = await this.getCelebById(id);
  const upCeleb = await this.model.update({
    where: { id: celeb.id },
    data,
  });

  return upCeleb;
}

export { updateProfileById };
