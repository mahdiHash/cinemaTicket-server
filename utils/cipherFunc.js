require('dotenv').config();
const crypto = require('crypto');
const cipher = crypto.createCipheriv(
  process.env.CIPHER_ALGORITHM,
  process.env.CIPHER_KEY,
  process.env.CIPHER_IV
);
const decipher = crypto.createDecipheriv(
  process.env.CIPHER_ALGORITHM,
  process.env.CIPHER_KEY,
  process.env.CIPHER_IV
)

function encrypt(input = "") {
  return cipher.update(input, 'utf-8', 'hex');
}

function decrypt(input = "") {
  return decipher.update(input, 'hex', 'utf-8');
}

module.exports = {
  encrypt,
  decrypt
}
