const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

// Config DB Config (Have fallback for Local Dev)
console.log(`🔌 DB Config: Host=${process.env.DB_HOST || 'localhost'}, User=${process.env.DB_USER}, DB=${process.env.DB_NAME}`);

const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ktpmud',
    port: process.env.DB_PORT || 3306, 
    waitForConnections: true,
    connectionLimit: 3,
    queueLimit: 0,
    charset: 'utf8mb4',
    enableKeepAlive: true, 
    keepAliveInitialDelay: 0
});

// Dung promise wrapper de code async/await cho gon
module.exports = pool.promise();