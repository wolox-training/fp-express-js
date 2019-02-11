const userModel = require('../models').user;

exports.create = userFields => userModel.create(userFields);
