import { PlaceService } from "./place.service";
import { randomBytes } from "crypto";

async function generateRegisterCode(this: PlaceService) {
  let code: string;

  // generate a unique code
  while (true) {
    code = randomBytes(8).toString('hex');
    let duplicate = await this.registerModel.findUnique({
      where: { code },
    });

    if (duplicate === null) {
      break;
    }
  }

  return code;
}

export { generateRegisterCode };
