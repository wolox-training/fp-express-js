const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync();

exports.encryptPassword = password => bcrypt.hashSync(password, salt);

exports.comparePassword = (password, hash) => bcrypt.compare(password, hash);
