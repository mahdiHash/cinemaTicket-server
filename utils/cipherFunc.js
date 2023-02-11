require('dotenv').config();
const crypto = require('crypto');

function encrypt(input = "") {
  if (input === null) {
    return null;
  }

  const cipher = crypto.createCipheriv(
    process.env.CIPHER_ALGORITHM,
    process.env.CIPHER_KEY,
    process.env.CIPHER_IV
  );

  return cipher.update(input, 'utf-8', 'hex');
}

function decrypt(input = "") {
  if (input === null) {
    return null;
  }
  
  const decipher = crypto.createDecipheriv(
    process.env.CIPHER_ALGORITHM,
    process.env.CIPHER_KEY,
    process.env.CIPHER_IV
  );

  return decipher.update(input, 'hex', 'utf-8');
}

module.exports = {
  encrypt,
  decrypt
}
