import { prisma } from '../../config/prismaConfig';
import { findApiKeyByKey, generateApiKey } from './';

class ApiKeyService {
  constructor(protected readonly apikeys = prisma.api_keys) {}

  public findApiKeyByKey = findApiKeyByKey;
  public generateApiKey = generateApiKey;
}

export { ApiKeyService };
