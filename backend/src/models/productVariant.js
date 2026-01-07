const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ProductVariant = sequelize.define("ProductVariant", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    color_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'colors',
            key: 'id'
        }
    },
    storage_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'storages',
            key: 'id'
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: "Harga untuk variant ini"
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "Stok untuk variant ini"
    },
    sku: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        comment: "SKU unik untuk variant (opsional)"
    }
}, {
    tableName: "product_variants",
    timestamps: true,
});

module.exports = ProductVariant;
