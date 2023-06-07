import ImageKit = require('imagekit');

const storage = new ImageKit({
  publicKey: process.env.IMAGEKIT_STORAGE_PUBLIC_KEY as string,
  privateKey: process.env.IMAGEKIT_STORAGE_PRIVATE_KEY as string,
  urlEndpoint: process.env.IMAGEKIT_STORAGE_URL_ENDPOINT as string,
});

export { storage as imageKit };
