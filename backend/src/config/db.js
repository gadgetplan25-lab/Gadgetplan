require('dotenv').config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false, // Matikan log SQL biar console bersih

    // Connection pool configuration
    pool: {
      max: 10,        // Maximum connections
      min: 0,         // Minimum connections
      acquire: 30000, // Maximum time (ms) to get connection
      idle: 10000     // Maximum idle time (ms) before releasing
    },

    // Retry configuration
    retry: {
      max: 3,
      timeout: 30000
    },

    // Timezone
    timezone: '+07:00',

    // Additional options
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true
    },

    // Query options
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false,
      supportBigNumbers: true,
      bigNumberStrings: true
    }
  }
);

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    console.log(`   Host: ${process.env.DB_HOST}`);
    console.log(`   Database: ${process.env.DB_NAME}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Only test connection in development or when explicitly called
if (process.env.NODE_ENV !== 'test') {
  testConnection();
}

module.exports = sequelize;
