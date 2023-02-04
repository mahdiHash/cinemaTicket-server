const crypto = require('crypto');
const prisma = require('../../config/prismaConfig');

const controller = async (req, res, next) => {
  let key = crypto.randomBytes(32).toString('hex');

  await prisma.api_keys.create({
    data: {
      key,
    }
  })
  res.json(key);
}

module.exports = controller;
