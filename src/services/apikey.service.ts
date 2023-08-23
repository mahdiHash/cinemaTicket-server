import { prisma } from '../config/prismaConfig';
import { ApiKeyErr } from '../helpers/errors';
import { randomBytes } from 'crypto';

class ApiKeyService {
  constructor(private readonly apikeys = prisma.api_keys) {}

  public async findApiKeyByKey(key: string) {
    if (key === null || key === undefined || typeof key !== 'string') {
      throw new ApiKeyErr();
    }
  
    return await this.apikeys.findUnique({
      where: { key },
    });
  }

  public async generateApiKey() {
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
}

export { ApiKeyService };
