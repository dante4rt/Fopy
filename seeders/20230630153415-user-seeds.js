'use strict';

const { hashPassword } = require('../helpers/bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const users = require('../database/user.json').map((el) => {
      el.createdAt = el.updatedAt = new Date();
      el.password = hashPassword(el.password)
      // el.location = Sequelize.fn('ST_GeomFromText', el.location);
      return el;
    });

    await queryInterface.bulkInsert('Users', users, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
    */
     await queryInterface.bulkDelete('Users', null, {});
  }
};
