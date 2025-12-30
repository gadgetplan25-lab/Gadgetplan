"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Bookings", "jenis_perangkat", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "",
    });
    await queryInterface.addColumn("Bookings", "model_perangkat", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Bookings", "jenis_perangkat");
    await queryInterface.removeColumn("Bookings", "model_perangkat");
  },
};
