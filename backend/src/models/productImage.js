const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ProductImage = sequelize.define("ProductImage", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  image_url: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'productimages'
});

module.exports = ProductImage;
