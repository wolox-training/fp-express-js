const usersService = require('../services/users'),
  logger = require('../logger'),
  errors = require('../errors'),
  bcryptService = require('../services/bcrypt'),
  sessionManagerService = require('../services/sessionManager');

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

exports.signIn = (req, res, next) =>
  usersService
    .findBy({ email: req.body.email })
    .then(userFound => {
      if (!userFound) {
        logger.info(
          `The user with email: ${req.body.email} and password: ${req.body.password} could not be found`
        );
        throw errors.userNotFound(
          `The user with email: ${req.body.email} and password: ${req.body.password} could not be found`
        );
      } else {
        const userToken = sessionManagerService.createUserToken(userFound.password);
        logger.info(`The token ${userToken} was created successfully`);
        res.status(201).send(userToken);
      }
    })
    .catch(next);
