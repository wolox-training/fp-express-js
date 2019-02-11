const userModel = require('../models/user').user,
  usersService = require('../services/users'),
  logger = require('../logger'),
  bcrypt = require('bcryptjs');

const encryptPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync());

exports.create = (req, res) =>
  userModel
    .findOne({ where: { email: req.body.email } })
    .then(user => {
      if (user) {
        console.log('The user already exists');
      } else {
        return encryptPassword(req.body.password)
          .then(hashedPassword =>
            userModel
              .create({ ...req.body, password: hashedPassword })
              .then(newUser => {
                logger.info(`The user ${newUser} was created successfully`);
                res.status(201).send(newUser.toString());
              })
              .catch(error => {
                logger.info(`Failed to create the user. ${error}`);
                res.status(422).send(error.toString());
              })
          )
          .catch(error => {
            logger.info(`Failed to hash password. ${error}`);
            res.status(422).send(error.toString());
          });
      }
    })
    .catch(error => {
      logger.error(`Failed to retrieve user from database. ${error}`);
      res.status(503).send(error.toString());
    });
