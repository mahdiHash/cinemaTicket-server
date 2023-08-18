import { ApiKeyService } from "./apikey.service";
import { randomBytes } from "crypto";

async function generateApiKey(this: ApiKeyService) {
  let key;

  while (true) {
    key = randomBytes(32).toString('hex');
    let duplicate = await this.apikeys.findFirst({ where: { key }});

    if (duplicate === null) {
      break;
    }
  }

  await this.apikeys.create({
    data: {
      key,
    }
  });

  return key;
}

export { generateApiKey };
