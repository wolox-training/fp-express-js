const user = require('../models').user,
  logger = require('../logger'),
  errors = require('../errors'),
  bcrypt = require('bcryptjs');

const encryptPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync());

exports.create = userFields =>
  user.create({ ...userFields, password: encryptPassword(userFields.password) }).catch(error => {
    logger.info(`Failed to create the user. ${error}`);
    throw errors.unprocessableEntity(error);
  });

exports.findByEmail = email =>
  user.findOne({ where: { email } }).catch(error => {
    logger.error(`Failed to retrieve user from database. ${error}`);
    throw errors.defaultError(error);
  });
