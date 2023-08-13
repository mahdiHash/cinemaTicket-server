import { ApiKeyService } from "./apikey.service";
import { ApiKeyErr } from "../../helpers/errors";

async function findApiKeyByKey(this: ApiKeyService, key: string) {
  if (key === null || key === undefined || typeof key !== 'string') {
    throw new ApiKeyErr();
  }

  return await this.apikeys.findUnique({
    where: { key },
  });
}

export { findApiKeyByKey };
