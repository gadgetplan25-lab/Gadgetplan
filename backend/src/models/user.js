const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50]
    }
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
      len: [5, 100]
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100]
    }
  },
  phone: {
    type: DataTypes.STRING,
    validate: {
      len: [10, 20],
      is: /^[+]?[\d\s-()]+$/
    }
  },
  address: {
    type: DataTypes.TEXT,
    validate: {
      len: [0, 255]
    }
  },
  city_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  postal_code: {
    type: DataTypes.STRING,
    validate: {
      len: [4, 10],
      is: /^[0-9]+$/
    }
  },
  role: {
    type: DataTypes.ENUM("admin", "customer"),
    defaultValue: "customer"
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'isVerified' // Database uses camelCase, not snake_case
  }
}, {
  tableName: 'users', // Explicitly set table name
  timestamps: true,
  createdAt: 'createdAt', // Database uses camelCase
  updatedAt: 'updatedAt', // Database uses camelCase
  paranoid: false, // No deleted_at column in database
  underscored: false // Database uses camelCase for timestamps
});

module.exports = User;
