// models/serviceType.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ServiceType = sequelize.define("ServiceType", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  harga: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  waktu_proses: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "Durasi pengerjaan service (menit/jam)",
  },
}, {
  tableName: "service_types",
  timestamps: true,
}, {
  tableName: 'service_types',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = ServiceType;