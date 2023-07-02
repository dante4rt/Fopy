'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let order = require('../database/orderstatus.json');
    order.forEach((el) => {
      el.createdAt = new Date()
      el.updatedAt = new Date()
      el.location = Sequelize.fn(
        'ST_GeomFromText',
        el.location
      )
    })
    await queryInterface.bulkInsert('Orders', order, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Orders', order, {})
  }
};