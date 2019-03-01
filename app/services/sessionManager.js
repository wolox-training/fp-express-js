const jwt = require('jwt-simple'),
  moment = require('moment'),
  config = require('./../../config');

const SESSION_SECRET = config.common.session.secret;

exports.HEADER_NAME = config.common.session.header_name;

exports.createToken = userData =>
  jwt.encode(
    {
      ...userData,
      expirationTime: moment
        .utc()
        .add(process.env.TOKEN_EXPIRATION_TIME, 'minutes')
        .unix()
    },
    SESSION_SECRET
  );

exports.decodeToken = token => jwt.decode(token, SESSION_SECRET);
