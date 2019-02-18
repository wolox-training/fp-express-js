const jwt = require('jwt-simple'),
  logger = require('../logger'),
  errors = require('../errors'),
  config = require('./../../config');

const sessionSecret = config.common.session.secret;

exports.createUserToken = userPassword => jwt.encode(userPassword, sessionSecret);
