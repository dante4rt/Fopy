'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { hashPassword } = require('../helpers/bcrypt')
    let user = require('../database/user.json');
    user.forEach((el) => {
      el.createdAt = new Date()
      el.updatedAt = new Date()
      el.password = hashPassword(el.password)
    })
    await queryInterface.bulkInsert('Users', user, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', user, {})
  }
};