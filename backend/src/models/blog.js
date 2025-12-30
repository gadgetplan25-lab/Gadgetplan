const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Blog = sequelize.define(
  "Blog",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    banner_image: { type: DataTypes.STRING(500), allowNull: true },
    author_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "blogs",
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
);

// Define associate sebagai function
Blog.associate = (models) => {
  Blog.hasMany(models.BlogContent, { foreignKey: "blog_id", as: "contents" });
};

module.exports = Blog;