const bcrypt = require('bcrypt');
const { bcryptCost } = require('../config');

exports.hash   = (plain) => bcrypt.hash(plain, bcryptCost);
exports.verify = (plain, hash) => bcrypt.compare(plain, hash);
