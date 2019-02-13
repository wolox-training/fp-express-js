const user = require('../models').user,
  logger = require('../logger'),
  errors = require('../errors'),
  bcryptService = require('../services/bcrypt');

exports.create = userFields =>
  user
    .create({ ...userFields, password: bcryptService.encryptPassword(userFields.password) })
    .catch(error => {
      logger.info(`Failed to create the user. ${error}`);
      throw errors.databaseError(error.message);
    });

exports.findBy = condition =>
  user.findOne({ where: condition }).catch(error => {
    logger.error(`Failed to retrieve user from database. ${error}`);
    throw errors.databaseError(error.message);
  });
