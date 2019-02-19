const jwt = require('jwt-simple'),
  logger = require('../logger'),
  errors = require('../errors'),
  config = require('./../../config');

const sessionSecret = config.common.session.secret;

exports.createToken = userPassword => jwt.encode(userPassword, sessionSecret);

exports.decodeToken = token => jwt.decode(token, sessionSecret);
