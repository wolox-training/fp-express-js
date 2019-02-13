const usersService = require('../services/users'),
  logger = require('../logger'),
  errors = require('../errors');

exports.create = (req, res, next) =>
  usersService
    .findByEmail(req.body.email, res)
    .then(userInstance => {
      if (userInstance) {
        logger.info(`The user ${userInstance} already exists`);
        throw errors.defaultError(`The user with email: ${userInstance.email} already exists`);
      } else {
        return usersService.create({ ...req.body }, res).then(newUser => {
          logger.info(`The user ${newUser} was created successfully`);
          res.status(201).send(newUser);
        });
      }
    })
    .catch(error => next(error));
