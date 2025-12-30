module.exports = (sequelize, DataTypes) => {
    const ProductReview = sequelize.define("ProductReview", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Products',
                key: 'id'
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        order_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Orders',
                key: 'id'
            }
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },
        review: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'ProductReviews',
        timestamps: true
    });

    ProductReview.associate = (models) => {
        ProductReview.belongsTo(models.Product, { foreignKey: 'product_id' });
        ProductReview.belongsTo(models.User, { foreignKey: 'user_id' });
        ProductReview.belongsTo(models.Order, { foreignKey: 'order_id' });
    };

    return ProductReview;
};
