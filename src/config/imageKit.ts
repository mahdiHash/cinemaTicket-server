import ImageKit = require('imagekit');
import { envVariables } from './envVariables';

const storage = new ImageKit({
  publicKey: envVariables.imageKitStoragePublicKey as string,
  privateKey: envVariables.imageKitStoragePrivateKey as string,
  urlEndpoint: envVariables.imageKitStorageUrlEndpoint as string,
});

export { storage as imageKit };
