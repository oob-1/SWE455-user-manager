const jwt = require('jsonwebtoken');
const { jwt: cfg } = require('../config');

exports.sign = ({ sub, email }) =>
  jwt.sign({ sub, email }, cfg.secret, {
    algorithm: 'HS256',
    issuer:    cfg.issuer,
    expiresIn: cfg.ttlSeconds,
  });

exports.verify = (token) =>
  jwt.verify(token, cfg.secret, { algorithms: ['HS256'], issuer: cfg.issuer });
