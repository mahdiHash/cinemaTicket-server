const ImageKit = require('imagekit');
const storage = new ImageKit({
  publicKey: process.env.IMAGEKIT_STORAGE_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_STORAGE_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_STORAGE_URL_ENDPOINT,
});

module.exports = storage;
