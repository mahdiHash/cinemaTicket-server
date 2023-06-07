import crypto = require('crypto');

function encrypt(input?: string | null) {
  if (input === null || input === undefined) {
    return null;
  }

  const cipher = crypto.createCipheriv(
    process.env.CIPHER_ALGORITHM as string,
    process.env.CIPHER_KEY as string,
    process.env.CIPHER_IV as string
  );

  return cipher.update(input, 'utf-8', 'hex');
}

function decrypt(input?: string | null) {
  if (input === null || input === undefined) {
    return null;
  }
  
  const decipher = crypto.createDecipheriv(
    process.env.CIPHER_ALGORITHM as string,
    process.env.CIPHER_KEY as string,
    process.env.CIPHER_IV as string
  );

  return decipher.update(input, 'hex', 'utf-8');
}

export {
  encrypt,
  decrypt
}
