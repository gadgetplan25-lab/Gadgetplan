const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TradeInTemplate = sequelize.define(
    "TradeInTemplate",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        base_price_min: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        base_price_max: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        component_prices: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: "JSON object with component deductions: {battery: 450000, lcd: 1950000, ...}",
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: "trade_in_templates",
        timestamps: true,
    }
);

module.exports = TradeInTemplate;
