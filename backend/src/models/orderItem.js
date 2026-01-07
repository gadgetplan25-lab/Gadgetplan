const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Order = require("./order");
const Product = require("./product");
const Color = require("./color");
const Storage = require("./storage");

const OrderItem = sequelize.define("OrderItem", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  order_id: { type: DataTypes.INTEGER },
  product_id: { type: DataTypes.INTEGER },
  variant_id: { type: DataTypes.INTEGER, allowNull: true }, // NEW: Track which variant was ordered
  color_id: { type: DataTypes.INTEGER, allowNull: true },
  storage_id: { type: DataTypes.INTEGER, allowNull: true }
}, {
  tableName: 'orderitems',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

OrderItem.belongsTo(Order, { foreignKey: "order_id" });
Order.hasMany(OrderItem, { foreignKey: "order_id" });

OrderItem.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(OrderItem, { foreignKey: "product_id" });

OrderItem.belongsTo(Color, { foreignKey: "color_id" });
Color.hasMany(OrderItem, { foreignKey: "color_id" });

OrderItem.belongsTo(Storage, { foreignKey: "storage_id" });
Storage.hasMany(OrderItem, { foreignKey: "storage_id" });

module.exports = OrderItem;
