const albums = require('../services/albums'),
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
        return albums.findBy({ albumId: req.params.id, userId: userFound.id }).then(albumFound => {
          if (albumFound) {
            logger.info(`The album with id: ${req.params.id} was already bought by the user`);
            throw errors.albumAlreadyBought(
              `The album with id: ${req.params.id} was already bought by the user`
            );
          } else {
            return albums.create(req.params.id, userFound.id).then(album => {
              logger.info(`The album ${album} was bought successfully`);
              res.status(201).send(album);
            });
          }
        });
      }
    })
    .catch(next);
};
