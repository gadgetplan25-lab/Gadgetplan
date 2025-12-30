const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Color = sequelize.define("Color", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
}, {
  tableName: 'colors'
});

module.exports = Color;
