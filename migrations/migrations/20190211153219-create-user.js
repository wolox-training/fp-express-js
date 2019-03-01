'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      isAdmin: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      isEnableToLoggin: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      deletedAt: { type: Sequelize.DATE }
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('users')
};
