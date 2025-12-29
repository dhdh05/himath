const pool = require('../config/db');

async function setupPhase3() {
    try {
        console.log('🔄 Đang kiểm tra cấu trúc Database (Phase 3)...');

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

        await pool.execute(createLearningGoalsTable);
        console.log('✅ Bảng `learning_goals` đã được kiểm tra/khởi tạo thành công.');

    } catch (error) {
        console.error('❌ Lỗi khi setup Database:', error);
    } finally {
        // Chúng ta không đóng pool ở đây nếu muốn dùng script này import vào server.js
        // Nhưng nếu chạy độc lập (node database_setup.js) thì cần ctrl+c hoặc process.exit
        // Để linh hoạt, ta chỉ log xong.
        console.log('🏁 Setup hoàn tất.');
        // Nếu chạy trực tiếp file này -> thoát process
        if (require.main === module) {
            process.exit(0);
        }
    }
}

// Nếu file được chạy trực tiếp (node database_setup.js)
if (require.main === module) {
    setupPhase3();
}

module.exports = setupPhase3;
