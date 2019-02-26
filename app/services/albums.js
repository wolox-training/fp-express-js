const album = require('../models').album,
  logger = require('../logger'),
  errors = require('../errors');

exports.create = (albumId, userId) =>
  album.create({ albumId, userId }).catch(error => {
    logger.info(`Failed to create the album. ${error}`);
    throw errors.databaseError(error.message);
  });

exports.findBy = condition =>
  album.findOne({ where: condition }).catch(error => {
    logger.error(`Failed to retrieve album from database. ${error}`);
    throw errors.databaseError(error.message);
  });
