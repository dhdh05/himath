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
    port: process.env.DB_PORT || 3306, // Them cong (CleverCloud thuong la 3306, nhung doi khi khac)
    waitForConnections: true,
    connectionLimit: 4,
    queueLimit: 0,
    charset: 'utf8mb4',
    enableKeepAlive: true, // GIUP KET NOI KHONG BI TREO TREN CLOUD
    keepAliveInitialDelay: 0
});

// Dung promise wrapper de code async/await cho gon
module.exports = pool.promise();