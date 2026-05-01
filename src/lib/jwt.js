const jwt = require('jsonwebtoken');
const { jwt: cfg } = require('../config');

exports.sign = ({ sub, email }) =>
  jwt.sign(
    { sub, email },
    cfg.secret,
    { expiresIn: cfg.ttlSeconds || 3600 }
  );

exports.verify = (token) =>
  jwt.verify(token, cfg.secret);