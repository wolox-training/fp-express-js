const album = require('../models').album,
  logger = require('../logger'),
  errors = require('../errors'),
  axios = require('axios');

exports.getBy = condition =>
  axios.get(`${process.env.ALBUMS_URL}?${condition}`).catch(error => {
    logger.info(`Failed to retrieve the album from api. ${error}`);
    throw errors.internalServerError(error.message);
  });

exports.create = (albumInfo, userId) =>
  album.create({ albumId: albumInfo.id, title: albumInfo.title, userId }).catch(error => {
    logger.info(`Failed to create the album. ${error}`);
    throw errors.databaseError(error.message);
  });

exports.findBy = condition =>
  album.findOne({ where: condition }).catch(error => {
    logger.error(`Failed to retrieve album from database. ${error}`);
    throw errors.databaseError(error.message);
  });

exports.findAllFromApi = () =>
  axios.get(process.env.ALBUMS_URL).catch(error => {
    logger.error(`Failed to retrieve albums from database. ${error}`);
    throw errors.databaseError(error.message);
  });

exports.findAllBy = condition =>
  album.findAll({ where: condition }).catch(error => {
    logger.error(`Failed to retrieve albums from database. ${error}`);
    throw errors.databaseError(error.message);
  });
