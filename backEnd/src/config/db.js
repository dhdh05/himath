const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ktpmud',
    waitForConnections: true,
    connectionLimit: 4,
    queueLimit: 0,
    charset: 'utf8mb4' // Ho tro day du Unicode, bao gom ca emoji
});

// Dung promise wrapper de code async/await cho gon
module.exports = pool.promise();