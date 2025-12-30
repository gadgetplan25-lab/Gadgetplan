const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");
const Technician = require("./technician");
const ServiceType = require("./serviceType");

const Booking = sequelize.define("Booking", {
  service_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  service_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  jenis_perangkat: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  model_perangkat: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  status: {
    type: DataTypes.ENUM("pending", "confirmed", "proses", "selesai", "cancelled", "completed"),
    defaultValue: "pending",
  },
}, {
  tableName: 'bookings',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

// Relasi
Booking.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Booking, { foreignKey: "user_id" });

Booking.belongsTo(Technician, { foreignKey: "technician_id" });
Technician.hasMany(Booking, { foreignKey: "technician_id" });

Booking.belongsTo(ServiceType, { foreignKey: "serviceType_id" });
ServiceType.hasMany(Booking, { foreignKey: "serviceType_id" });

module.exports = Booking;