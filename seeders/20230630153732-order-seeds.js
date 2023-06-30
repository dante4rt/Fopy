'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const orders = require('../database/order.json').map((el) => {
      el.createdAt = el.updatedAt = new Date();
      el.location = Sequelize.fn('ST_GeomFromText', el.location);
      return el;
    });

    await queryInterface.bulkInsert('Orders', orders, {})
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Orders', null, {});
  },
};
