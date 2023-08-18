const variables = {
  port: process.env.PORT as string,
  env: process.env.ENV as string,
  dbURL: process.env.DB_URL as string,
  jwtTokenSecret: process.env.JWT_TOKEN_SECRET as string,
  cookieSecret: process.env.COOKIE_SECRET as string,
  cipherKey: process.env.CIPHER_KEY as string,
  cipherAlgorithm: process.env.CIPHER_ALGORITHM as string,
  cipherIV: process.env.CIPHER_IV as string,
  imageKitStoragePublicKey: process.env.IMAGEKIT_STORAGE_PUBLIC_KEY as string,
  imageKitStoragePrivateKey: process.env.IMAGEKIT_STORAGE_PRIVATE_KEY as string,
  imageKitStorageUrlEndpoint: process.env.IMAGEKIT_STORAGE_URL_ENDPOINT as string,
};

export { variables as envVariables };
