const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Order = require("./order");

const Payment = sequelize.define("Payment", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  order_id: { type: DataTypes.INTEGER },
  method: { type: DataTypes.STRING(50), allowNull: true },
  status: {
    type: DataTypes.ENUM("pending", "success", "failed"),
    defaultValue: "pending"
  },
  transaction_id: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: 'payments',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

Payment.belongsTo(Order, { foreignKey: "order_id" });
Order.hasOne(Payment, { foreignKey: "order_id" });

module.exports = Payment;
