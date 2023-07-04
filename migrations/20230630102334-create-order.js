'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      AdministratorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Administrators",
          key: "id"
        },
        onUpdate: 'cascade',
      onDelete: 'cascade'
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id"
        },
        onUpdate: 'cascade',
      onDelete: 'cascade'
      },
      totalPrice: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      orderStatus: {
        type: Sequelize.STRING,
        allowNull: false
      },
      orderDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      location: {
        type: Sequelize.GEOMETRY,
        allowNull: false
      },
      deliveryMethod: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  }
};