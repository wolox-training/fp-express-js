'use strict';

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'user',
    {
      firstName: { alowNull: false, type: DataTypes.STRING },
      lastName: { alowNull: false, type: DataTypes.STRING },
      email: { alowNull: false, type: DataTypes.STRING, unique: true },
      password: { alowNull: false, type: DataTypes.STRING },
      isAdmin: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN
      }
    },
    {
      paranoid: true
    }
  );
  user.associate = function(models) {
    models.user.hasMany(models.album);
  };
  return user;
};
