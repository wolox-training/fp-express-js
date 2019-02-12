const bcrypt = require('bcryptjs');

exports.encryptPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync());
