const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
