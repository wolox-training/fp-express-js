'use strict';

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'user',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      firstName: { alowNull: false, type: DataTypes.STRING },
      lastName: { alowNull: false, type: DataTypes.STRING },
      email: { alowNull: false, type: DataTypes.STRING, unique: true },
      password: { alowNull: false, type: DataTypes.STRING }
    },
    {}
  );
  user.associate = function(models) {
    // associations can be defined here
  };
  return user;
};
