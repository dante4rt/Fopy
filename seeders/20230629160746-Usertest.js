'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { hashPassword } = require('../helpers/bcrypt')
    let admin = require('../database/administrator.json');
    admin.forEach((el) => {
      el.createdAt = new Date()
      el.updatedAt = new Date()
      el.password = hashPassword(el.password)
    })
    await queryInterface.bulkInsert('Administrators', admin, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Administrators', null, {});
  }
};