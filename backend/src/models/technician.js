const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Technician = sequelize.define("Technician", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  photoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'technicians',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = Technician;