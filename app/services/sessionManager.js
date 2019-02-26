const jwt = require('jwt-simple'),
  config = require('./../../config');

const SESSION_SECRET = config.common.session.secret;

exports.HEADER_NAME = config.common.session.header_name;

exports.createToken = userData => jwt.encode(userData, SESSION_SECRET);

exports.decodeToken = token => jwt.decode(token, SESSION_SECRET);
