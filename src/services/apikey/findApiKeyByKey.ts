import { prisma } from "../../config";
import { ApiKeyErr } from "../../helpers/errors";

async function findApiKeyByKey(key: string) {
  if (key === null || key === undefined || typeof key !== 'string') {
    throw new ApiKeyErr();
  }

  return await prisma.api_keys.findUnique({
    where: { key },
  });
}

export { findApiKeyByKey };
