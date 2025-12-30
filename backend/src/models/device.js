const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");

const Device = sequelize.define("Device", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  deviceId: { type: DataTypes.STRING, allowNull: false },
  lastUsed: { type: DataTypes.DATE, allowNull: false },
}, {
  tableName: 'devices',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

// Relasi: Device belongsTo User
Device.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(Device, { foreignKey: "userId" });

module.exports = Device;