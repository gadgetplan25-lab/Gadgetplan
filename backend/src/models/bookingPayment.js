const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Booking = require("./booking");

const BookingPayment = sequelize.define("BookingPayment", {
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  payment_status: {
    type: DataTypes.ENUM("pending", "success", "failed"),
    defaultValue: "pending",
  },
  transaction_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'bookingpayments',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

// Relasi
BookingPayment.belongsTo(Booking, { foreignKey: "booking_id" });
Booking.hasMany(BookingPayment, { foreignKey: "booking_id" });

module.exports = BookingPayment;