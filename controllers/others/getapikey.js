const crypto = require('crypto');
const prisma = require('../../config/prismaConfig');

const controller = async (req, res, next) => {
  let key;
  
  while (true) {
    key = crypto.randomBytes(32).toString('hex');
    let duplicate = await prisma.api_keys.findFirst({ where: { key }});

    if (!duplicate) {
      break;
    }
  }

  await prisma.api_keys.create({
    data: {
      key,
    }
  })
  res.json(key);
}

module.exports = controller;
