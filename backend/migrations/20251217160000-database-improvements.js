'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Modify Users table
    await queryInterface.changeColumn('Users', 'city_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.changeColumn('Users', 'name', {
      type: Sequelize.STRING(50),
      allowNull: false
    });

    await queryInterface.changeColumn('Users', 'email', {
      type: Sequelize.STRING(100),
      allowNull: false
    });

    // Add new columns to Users
    await queryInterface.addColumn('Users', 'verification_token', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'refresh_token', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'last_login', {
      type: Sequelize.DATE,
      allowNull: true
    });

    // Add deletedAt for soft delete
    await queryInterface.addColumn('Users', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });

    // 2. Modify Products table
    await queryInterface.changeColumn('Products', 'price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    });

    await queryInterface.addColumn('Products', 'category_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id'
      }
    });

    await queryInterface.addColumn('Products', 'is_active', {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    });

    await queryInterface.addColumn('Products', 'sku', {
      type: Sequelize.STRING,
      unique: true
    });

    await queryInterface.addColumn('Products', 'weight', {
      type: Sequelize.DECIMAL(8, 2),
      defaultValue: 1000
    });

    await queryInterface.addColumn('Products', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });

    // 3. Modify Orders table
    await queryInterface.changeColumn('Orders', 'total_price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    });

    await queryInterface.changeColumn('Orders', 'shipping_cost', {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0
    });

    await queryInterface.addColumn('Orders', 'shipping_address', {
      type: Sequelize.TEXT,
      allowNull: false
    });

    await queryInterface.addColumn('Orders', 'order_number', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    });

    await queryInterface.addColumn('Orders', 'shipped_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('Orders', 'delivered_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    // 4. Modify Payments table
    await queryInterface.changeColumn('Payments', 'status', {
      type: Sequelize.ENUM('pending', 'success', 'failed', 'refunded'),
      defaultValue: 'pending'
    });

    // 5. Add indexes for performance
    await queryInterface.addIndex('Products', ['category_id']);
    await queryInterface.addIndex('Products', ['name']);
    await queryInterface.addIndex('Products', ['price']);
    await queryInterface.addIndex('Products', ['is_active']);
    await queryInterface.addIndex('Orders', ['user_id']);
    await queryInterface.addIndex('Orders', ['status']);
    await queryInterface.addIndex('Orders', ['created_at']);
    await queryInterface.addIndex('Orders', ['user_id', 'status']);
    await queryInterface.addIndex('Payments', ['order_id']);
    await queryInterface.addIndex('Payments', ['transaction_id']);
    await queryInterface.addIndex('Users', ['email']);
    await queryInterface.addIndex('Users', ['city_id']);
  },

  async down(queryInterface, Sequelize) {
    // Remove new columns
    await queryInterface.removeColumn('Users', 'verification_token');
    await queryInterface.removeColumn('Users', 'refresh_token');
    await queryInterface.removeColumn('Users', 'last_login');
    await queryInterface.removeColumn('Users', 'deletedAt');

    await queryInterface.removeColumn('Products', 'category_id');
    await queryInterface.removeColumn('Products', 'is_active');
    await queryInterface.removeColumn('Products', 'sku');
    await queryInterface.removeColumn('Products', 'weight');
    await queryInterface.removeColumn('Products', 'deletedAt');

    await queryInterface.removeColumn('Orders', 'shipping_address');
    await queryInterface.removeColumn('Orders', 'order_number');
    await queryInterface.removeColumn('Orders', 'shipped_at');
    await queryInterface.removeColumn('Orders', 'delivered_at');

    // Revert changes
    await queryInterface.changeColumn('Users', 'city_id', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.changeColumn('Products', 'price', {
      type: Sequelize.FLOAT,
      allowNull: false
    });

    await queryInterface.changeColumn('Orders', 'total_price', {
      type: Sequelize.FLOAT,
      allowNull: false
    });

    await queryInterface.changeColumn('Orders', 'shipping_cost', {
      type: Sequelize.FLOAT,
      defaultValue: 0
    });

    // Remove indexes
    await queryInterface.removeIndex('Products', ['category_id']);
    await queryInterface.removeIndex('Products', ['name']);
    await queryInterface.removeIndex('Products', ['price']);
    await queryInterface.removeIndex('Products', ['is_active']);
    await queryInterface.removeIndex('Orders', ['user_id']);
    await queryInterface.removeIndex('Orders', ['status']);
    await queryInterface.removeIndex('Orders', ['created_at']);
    await queryInterface.removeIndex('Orders', ['user_id', 'status']);
    await queryInterface.removeIndex('Payments', ['order_id']);
    await queryInterface.removeIndex('Payments', ['transaction_id']);
    await queryInterface.removeIndex('Users', ['email']);
    await queryInterface.removeIndex('Users', ['city_id']);
  }
};