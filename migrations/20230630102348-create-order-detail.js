'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ServiceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Services",
          key: "id"
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      OrderId: {
        type: Sequelize.INTEGER,
        allowNull: false, 
        references: {
          model: "Orders",
          key: "id"
        },
        onUpdate: 'cascade',
      onDelete: 'cascade'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      totalPage: {
        type: Sequelize.INTEGER
      },
      url: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('OrderDetails');
  }
};