const pool = require('../config/db');

async function addDobColumn() {
    try {
        console.log('🔄 Đang thêm cột dob (ngày sinh) vào bảng users...');

        // Thêm cột dob, kiểu DATE, mặc định NULL
        await pool.execute(`
            ALTER TABLE users 
            ADD COLUMN dob DATE DEFAULT NULL
        `);

        console.log('✅ Đã thêm cột dob thành công!');
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('⚠️ Cột dob đã tồn tại.');
        } else {
            console.error('❌ Lỗi:', error.message);
        }
    } finally {
        process.exit();
    }
}

addDobColumn();
