const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Storage = sequelize.define("Storage", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
}, {
  tableName: 'storages'
});

module.exports = Storage;