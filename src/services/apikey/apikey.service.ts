import { findApiKeyByKey, generateApiKey } from "./";

class ApiKeyService {
  static findApiKeyByKey = findApiKeyByKey;
  static generateApiKey = generateApiKey;
}

export { ApiKeyService };
