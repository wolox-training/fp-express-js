const albumsService = require('../services/albums'),
  usersService = require('../services/users'),
  sessionManagerService = require('../services/sessionManager'),
  logger = require('../logger'),
  errors = require('../errors');

exports.create = (req, res, next) => {
  const userData = sessionManagerService.decodeToken(req.headers[sessionManagerService.HEADER_NAME]);
  return usersService
    .findBy({ email: userData.email })
    .then(userFound => {
      if (!userFound) {
        logger.info(`The user with email: ${userData.email} could not be found`);
        throw errors.userNotFound(`The user with email: ${userData.email} could not be found`);
      } else {
        return albumsService.findBy({ albumId: req.params.id, userId: userFound.id }).then(albumFound => {
          if (albumFound) {
            logger.info(`The album with id: ${req.params.id} was already bought by the user`);
            throw errors.albumAlreadyBought(
              `The album with id: ${req.params.id} was already bought by the user`
            );
          } else {
            return albumsService.findByIdFromApi(req.params.id).then(albumInfo => {
              if (albumInfo) {
                return albumsService.create(albumInfo.data[0], userFound.id).then(album => {
                  logger.info(`The album ${album} was bought successfully`);
                  res.status(201).send(album);
                });
              } else {
                logger.info(`The album with id: ${req.params.id} does not exist`);
                throw errors.albumNotFound(`The album with id: ${req.params.id} does not exist`);
              }
            });
          }
        });
      }
    })
    .catch(next);
};

exports.getAlbums = (req, res, next) =>
  albumsService
    .findAllFromApi()
    .then(albumList => {
      logger.info(`The album list: ${albumList.data} was retrieved successfully`);
      res.status(200).send(albumList.data);
    })
    .catch(next);

exports.getAlbumPictures = (req, res, next) => {
  const userData = sessionManagerService.decodeToken(req.headers[sessionManagerService.HEADER_NAME]);
  return usersService
    .findBy({ email: userData.email })
    .then(userFound => {
      if (!userFound) {
        logger.info(`The user with email: ${userData.email} could not be found`);
        throw errors.userNotFound(`The user with email: ${userData.email} could not be found`);
      } else {
        return albumsService.findBy({ albumId: req.params.id, userId: userData.id }).then(albumBought => {
          if (!albumBought) {
            logger.info(`The user ${userFound.email} has not bought any album`);
            throw errors.albumNotFound(`The user ${userFound.email} has not bought any album`);
          } else {
            return albumsService.findAlbumPictures(albumBought.id).then(pictures => {
              logger.info(`The album ${albumBought.id} has this pictures: ${pictures.data}`);
              res.status(200).send(pictures.data);
            });
          }
        });
      }
    })
    .catch(next);
};
