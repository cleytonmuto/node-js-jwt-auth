'use strict';

const crypto = require('crypto');

const SECRET = crypto.randomBytes(32).toString('hex').toUpperCase();

module.exports = {
  secret: SECRET
};
