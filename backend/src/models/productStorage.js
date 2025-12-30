const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Product = require("./product");
const Storage = require("./storage");

const ProductStorage = sequelize.define("ProductStorage", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  productId: {
    type: DataTypes.INTEGER,
    references: { model: Product, key: "id" },
    allowNull: false,
  },
  storageId: {
    type: DataTypes.INTEGER,
    references: { model: Storage, key: "id" },
    allowNull: false,
  },
}, {
  tableName: 'productstorages'
});

module.exports = ProductStorage;