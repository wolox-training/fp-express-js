const user = require('../models').user,
  logger = require('../logger'),
  errors = require('../errors');

exports.create = userFields =>
  user.create({ ...userFields }).catch(error => {
    logger.info(`Failed to create the user. ${error}`);
    throw errors.databaseError(error.message);
  });

exports.findBy = condition =>
  user.findOne({ where: condition }).catch(error => {
    logger.error(`Failed to retrieve user from database. ${error}`);
    throw errors.databaseError(error.message);
  });

exports.findAllBy = (limit = 5, offset = 0, condition) =>
  user.findAll({ limit, offset }, { where: condition }).catch(error => {
    logger.error(`Failed to retrieve users from database. ${error}`);
    throw errors.databaseError(error.message);
  });

exports.update = (userToUpdate, newUserFields) =>
  userToUpdate.update(newUserFields).catch(error => {
    logger.info(`Failed to create the admin user. ${error}`);
    throw errors.databaseError(error.message);
  });
