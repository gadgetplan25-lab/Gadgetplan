const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");

const Cart = sequelize.define("Cart", {
  status: {
    type: DataTypes.ENUM("active", "checked_out"),
    defaultValue: "active",
  },
}, {
  tableName: 'carts',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

Cart.belongsTo(User, { foreignKey: "user_id" });
User.hasOne(Cart, { foreignKey: "user_id" });

module.exports = Cart;