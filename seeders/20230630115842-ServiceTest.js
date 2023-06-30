'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let service = require('../database/service.json');
    service.forEach((el) => {
      el.createdAt = new Date()
      el.updatedAt = new Date()
    })
    await queryInterface.bulkInsert('Services', service, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Services', service, {})
  }
};