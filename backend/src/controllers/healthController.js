const sequelize = require('../config/db');

// Health check endpoint
exports.healthCheck = async (req, res) => {
    try {
        // Check database connection
        await sequelize.authenticate();

        const healthStatus = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            database: {
                status: 'connected',
                host: process.env.DB_HOST,
                name: process.env.DB_NAME,
            },
            server: {
                nodeVersion: process.version,
                platform: process.platform,
                memory: {
                    total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
                    used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
                },
            },
        };

        res.status(200).json(healthStatus);
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error.message,
            database: {
                status: 'disconnected',
            },
        });
    }
};

// Simple ping endpoint
exports.ping = (req, res) => {
    res.status(200).json({
        message: 'pong',
        timestamp: new Date().toISOString(),
    });
};

// Detailed system info (for admin only)
exports.systemInfo = async (req, res) => {
    try {
        const [results] = await sequelize.query('SELECT VERSION() as version');
        const dbVersion = results[0]?.version || 'unknown';

        const systemInfo = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            server: {
                nodeVersion: process.version,
                platform: process.platform,
                arch: process.arch,
                uptime: Math.round(process.uptime()) + ' seconds',
                pid: process.pid,
            },
            database: {
                type: 'MySQL',
                version: dbVersion,
                host: process.env.DB_HOST,
                name: process.env.DB_NAME,
            },
            memory: {
                rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + ' MB',
                heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
                heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
                external: Math.round(process.memoryUsage().external / 1024 / 1024) + ' MB',
            },
            environment: {
                nodeEnv: process.env.NODE_ENV || 'development',
                port: process.env.PORT || 4000,
            },
        };

        res.status(200).json(systemInfo);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};
