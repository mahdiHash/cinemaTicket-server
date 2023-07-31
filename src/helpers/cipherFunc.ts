import crypto = require('crypto');
import { envVariables } from '../config';

function encrypt(input?: string | null) {
  if (input === null || input === undefined) {
    return null;
  }

  const cipher = crypto.createCipheriv(
    envVariables.cipherAlgorithm,
    envVariables.cipherKey,
    envVariables.cipherIV,
  );

  return cipher.update(input, 'utf-8', 'hex');
}

function decrypt(input?: string | null) {
  if (input === null || input === undefined) {
    return null;
  }
  
  const decipher = crypto.createDecipheriv(
    envVariables.cipherAlgorithm,
    envVariables.cipherKey,
    envVariables.cipherIV,
  );

  return decipher.update(input, 'hex', 'utf-8');
}

export {
  encrypt,
  decrypt
}
