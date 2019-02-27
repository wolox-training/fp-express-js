const album = require('../models').album,
  logger = require('../logger'),
  errors = require('../errors'),
  axios = require('axios');

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

exports.findAll = () =>
  axios.get(process.env.ALBUMS_URL).catch(error => {
    logger.error(`Failed to retrieve albums from database. ${error}`);
    throw errors.databaseError(error.message);
  });
