'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('CartItems', 'color_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
        });

        await queryInterface.changeColumn('CartItems', 'storage_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('CartItems', 'color_id', {
            type: Sequelize.INTEGER,
            allowNull: false,
        });

        await queryInterface.changeColumn('CartItems', 'storage_id', {
            type: Sequelize.INTEGER,
            allowNull: false,
        });
    }
};
