const usersService = require('../services/users'),
  logger = require('../logger'),
  errors = require('../errors');

exports.create = (req, res, next) =>
  usersService
    .findBy({ email: req.body.email }, res)
    .then(userFound => {
      if (userFound) {
        logger.info(`The user ${userFound} already exists`);
        throw errors.userAlreadyExists(`The user with email: ${userFound.email} already exists`);
      } else {
        return usersService.create({ ...req.body }, res).then(newUser => {
          logger.info(`The user ${newUser} was created successfully`);
          res.status(201).send(newUser);
        });
      }
    })
    .catch(next);
