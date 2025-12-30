const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Cart = require("./cart");
const Product = require("./product");
const Color = require("./color");
const Storage = require("./storage");

const CartItem = sequelize.define("CartItem", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  color_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // PERBAIKAN: Boleh null untuk produk tanpa varian warna
  },
  storage_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // PERBAIKAN: Boleh null untuk produk tanpa varian storage
  },
}, {
  tableName: 'cartitems',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

// 🔗 Relasi antar tabel
CartItem.belongsTo(Cart, { foreignKey: "cart_id", onDelete: "CASCADE" });
Cart.hasMany(CartItem, { foreignKey: "cart_id" });

CartItem.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(CartItem, { foreignKey: "product_id" });

CartItem.belongsTo(Color, { foreignKey: "color_id" });
Color.hasMany(CartItem, { foreignKey: "color_id" });

CartItem.belongsTo(Storage, { foreignKey: "storage_id" });
Storage.hasMany(CartItem, { foreignKey: "storage_id" });

module.exports = CartItem;