const userModel = require('../models').user,
  usersService = require('../services/users'),
  logger = require('../logger'),
  bcrypt = require('bcryptjs');

const encryptPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync());

exports.create = (req, res) =>
  userModel
    .findOne({ where: { email: req.body.email } })
    .then(user => {
      if (user) {
        logger.info(`The user ${user} already exists`);
        res.status(422).send(`The user with email: ${user.email} already exists`);
      } else {
        return usersService
          .create({ ...req.body, password: encryptPassword(req.body.password) })
          .then(newUser => {
            logger.info(`The user ${newUser} was created successfully`);
            res.status(201).send(newUser);
          })
          .catch(error => {
            logger.info(`Failed to create the user. ${error}`);
            res.status(422).send(error.toString());
          });
      }
    })
    .catch(error => {
      logger.error(`Failed to retrieve user from database. ${error}`);
      res.status(503).send(error.toString());
    });
