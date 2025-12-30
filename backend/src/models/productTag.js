const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Product = require("./product");
const Tag = require("./tag");

const ProductTag = sequelize.define("ProductTag", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  productId: {
    type: DataTypes.INTEGER,
    references: { model: Product, key: "id" },
    allowNull: false,
  },
  tagId: {
    type: DataTypes.INTEGER,
    references: { model: Tag, key: "id" },
    allowNull: false,
  },
}, {
  tableName: 'producttags'
});


module.exports = ProductTag;