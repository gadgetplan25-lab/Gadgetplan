const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");

const Order = sequelize.define("Order", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM("pending", "paid", "shipped", "completed", "cancelled"),
    defaultValue: "pending"
  },
  total_price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  tracking_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  paranoid: false
});

Order.belongsTo(User, { foreignKey: "user_id", as: "User" });
User.hasMany(Order, { foreignKey: "user_id", as: "orders" });

module.exports = Order;
