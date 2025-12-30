const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Category = require("./category");

const Tag = sequelize.define("Tag", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.STRING },
  categoryId: {
    type: DataTypes.INTEGER,
    references: { model: Category, key: "id" },
    allowNull: true,
  },
}, {
  tableName: 'tags'
});


Tag.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

module.exports = Tag;