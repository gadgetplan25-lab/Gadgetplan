'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
 up: async (queryInterface, Sequelize) => {
  await queryInterface.changeColumn('BookingPayments', 'payment_method', {
    type: Sequelize.STRING,
    allowNull: true,
  });
},
down: async (queryInterface, Sequelize) => {
  await queryInterface.changeColumn('BookingPayments', 'payment_method', {
    type: Sequelize.ENUM('qris'),
    allowNull: false,
  });
}

};
