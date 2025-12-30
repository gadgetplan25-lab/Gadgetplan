const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user"); // pakai model User yang sudah ada

const OTP = sequelize.define("OTP", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  code: { type: DataTypes.STRING, allowNull: false },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
  type: { type: DataTypes.ENUM("register", "login"), allowNull: false },
}, {
  tableName: 'otps',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

// Relasi: OTP belongsTo User
OTP.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(OTP, { foreignKey: "userId" });

module.exports = OTP;