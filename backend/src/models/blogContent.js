const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BlogContent = sequelize.define(
  "BlogContent",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    blog_id: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.ENUM("text", "image"), allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: true },
    image_url: { type: DataTypes.STRING(500), allowNull: true },
    position: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "blog_contents",
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
);

// Define associate sebagai function
BlogContent.associate = (models) => {
  BlogContent.belongsTo(models.Blog, { foreignKey: "blog_id" });
};

module.exports = BlogContent;