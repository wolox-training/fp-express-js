'use strict';

module.exports = (sequelize, DataTypes) => {
  const album = sequelize.define(
    'album',
    {
      title: {
        allowNull: false,
        type: DataTypes.STRING
      },
      albumId: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER
      }
    },
    {}
  );
  album.associate = function(models) {
    models.album.belongsTo(models.user);
  };
  return album;
};
