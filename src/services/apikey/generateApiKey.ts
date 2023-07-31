import { prisma } from "../../config";
import { randomBytes } from "crypto";

async function generateApiKey() {
  let key;

  while (true) {
    key = randomBytes(32).toString('hex');
    let duplicate = await prisma.api_keys.findFirst({ where: { key }});

    if (duplicate === null) {
      break;
    }
  }

  await prisma.api_keys.create({
    data: {
      key,
    }
  });

  return key;
}

export { generateApiKey };
