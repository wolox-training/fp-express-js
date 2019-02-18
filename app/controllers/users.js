const usersService = require('../services/users'),
  logger = require('../logger'),
  errors = require('../errors'),
  bcryptService = require('../services/bcrypt');

exports.create = (req, res, next) =>
  usersService
    .findBy({ email: req.body.email })
    .then(userFound => {
      if (userFound) {
        logger.info(`The user ${userFound} already exists`);
        throw errors.userAlreadyExists(`The user with email: ${userFound.email} already exists`);
      } else {
        return usersService
          .create({ ...req.body, password: bcryptService.encryptPassword(req.body.password) })
          .then(newUser => {
            logger.info(`The user ${newUser} was created successfully`);
            res.status(201).send(newUser);
          });
      }
    })
    .catch(next);
