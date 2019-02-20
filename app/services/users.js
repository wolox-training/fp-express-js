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

exports.findAll = (limit = 5, offset = 0) =>
  user.findAll({ limit, offset }).catch(error => {
    logger.error(`Failed to retrieve users from database. ${error}`);
    throw errors.databaseError(error.message);
  });

exports.createAdmin = userFields =>
  user.create({ ...userFields, isAdmin: true }).catch(error => {
    logger.info(`Failed to create the admin user. ${error}`);
    throw errors.databaseError(error.message);
  });

exports.update = (userToUpdate, newUserFields) =>
  userToUpdate.update(newUserFields).catch(error => {
    logger.info(`Failed to create the admin user. ${error}`);
    throw errors.databaseError(error.message);
  });
