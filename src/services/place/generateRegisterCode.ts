import { PlaceRegisterService } from "./registers.place.service";
import { randomBytes } from "crypto";

async function generateRegisterCode(this: PlaceRegisterService) {
  let code: string;

  // generate a unique code
  while (true) {
    code = randomBytes(8).toString('hex');
    let duplicate = await this.registerReqs.findUnique({
      where: { code },
    });

    if (duplicate === null) {
      break;
    }
  }

  return code;
}

export { generateRegisterCode };
