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
        logger.info(`The user with email: ${req.body.email} could not be found`);
        throw errors.userNotFound(`The user with email: ${req.body.email} could not be found`);
      } else {
        return bcryptService.comparePassword(req.body.password, userFound.password).then(isSamePassword => {
          if (isSamePassword) {
            const userToken = sessionManagerService.createToken(userFound.password);
            logger.info(`The token ${userToken} was created successfully`);
            res.status(200).send({ token: userToken });
          } else {
            logger.info('The credentials are not valid');
            throw errors.invalidPassword('The credentials are not valid');
          }
        });
      }
    })
    .catch(next);

exports.getUsers = (req, res, next) =>
  usersService
    .findAllBy(req.query.limit, req.query.offset)
    .then(userList => {
      logger.info(`The user list: ${userList} was retrieved successfully`);
      res.status(200).send(userList);
    })
    .catch(next);

exports.createAdmin = (req, res, next) =>
  usersService
    .findBy({ email: req.body.email })
    .then(userFound => {
      if (userFound) {
        if (userFound.isAdmin) {
          logger.info(`The user ${userFound} is already an admin`);
          throw errors.userAlreadyAdmin(`The user with email: ${userFound.email} is already an admin`);
        } else {
          return usersService.update(userFound, { isAdmin: true }).then(adminUser => {
            logger.info(`The user ${adminUser} was updated as admin successfully`);
            res.status(200).send(adminUser);
          });
        }
      } else {
        return usersService
          .create({ ...req.body, password: bcryptService.encryptPassword(req.body.password), isAdmin: true })
          .then(newAdminUser => {
            logger.info(`The user ${newAdminUser} was created successfully as an admin`);
            res.status(201).send(newAdminUser);
          });
      }
    })
    .catch(next);
