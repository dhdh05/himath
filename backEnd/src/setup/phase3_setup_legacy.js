const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'src/.env') });

const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ktpmud'
};

async function setupPhase3() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        const createLearningGoalsTable = `
      CREATE TABLE IF NOT EXISTS learning_goals (
        goal_id int(11) NOT NULL AUTO_INCREMENT,
        student_id int(11) NOT NULL,
        goal_type enum('time','stars','score') NOT NULL, 
        target_value int(11) NOT NULL,
        deadline datetime DEFAULT NULL,
        status enum('active','completed','failed') DEFAULT 'active',
        created_at datetime DEFAULT current_timestamp(),
        PRIMARY KEY (goal_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

        await connection.execute(createLearningGoalsTable);
        console.log('✅ Table `learning_goals` checked/created successfully.');

    } catch (error) {
        console.error('❌ Error setting up Phase 3 database:', error);
    } finally {
        if (connection) await connection.end();
    }
}

setupPhase3();
