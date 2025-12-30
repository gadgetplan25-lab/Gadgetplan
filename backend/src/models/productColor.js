const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Product = require("./product");
const Color = require("./color");

const ProductColor = sequelize.define("ProductColor", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  productId: {
    type: DataTypes.INTEGER,
    references: { model: Product, key: "id" },
    allowNull: false,
  },
  colorId: {
    type: DataTypes.INTEGER,
    references: { model: Color, key: "id" },
    allowNull: false,
  },
}, {
  tableName: 'productcolors'
});

module.exports = ProductColor;