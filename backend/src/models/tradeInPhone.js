const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TradeInPhone = sequelize.define(
    "TradeInPhone",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "Mini, Standard, Pro, Pro Max, etc",
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        price_min: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        price_max: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        template_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'trade_in_templates',
                key: 'id'
            },
            comment: "If set, inherits from template. Can be overridden.",
        },
        custom_deductions: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: null,
            comment: "Override specific component prices from template",
            get() {
                const rawValue = this.getDataValue('custom_deductions');
                if (!rawValue) return null;
                // Auto-parse if it's a string
                if (typeof rawValue === 'string') {
                    try {
                        return JSON.parse(rawValue);
                    } catch (e) {
                        return null;
                    }
                }
                return rawValue;
            }
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: "trade_in_phones",
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["model", "category"],
            },
        ],
    }
);

module.exports = TradeInPhone;
