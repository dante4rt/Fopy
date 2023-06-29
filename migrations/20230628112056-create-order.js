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
      UserId: {
        type: Sequelize.INTEGER
      },
      totalAmount: {
        type: Sequelize.INTEGER
      },
      isPaid: {
        type: Sequelize.BOOLEAN
      },
      orderItem: {
        type: Sequelize.STRING
      },
      orderStatus: {
        type: Sequelize.STRING
      },
      orderDate: {
        type: Sequelize.DATE
      },
      deliveryMethod: {
        type: Sequelize.STRING
      },
      invoiceId: {
        type: Sequelize.INTEGER
      },
      OrderServiceId: {
        type: Sequelize.INTEGER
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