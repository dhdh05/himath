const pool = require('../config/db');

async function addEmailColumn() {
    try {
        console.log('🔄 Đang thêm cột email vào bảng users...');

        // Thêm cột email, set UNIQUE để không trùng
        await pool.execute(`
            ALTER TABLE users 
            ADD COLUMN email VARCHAR(255) UNIQUE DEFAULT NULL
        `);

        console.log('✅ Đã thêm cột email thành công!');
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('⚠️ Cột email đã tồn tại, không cần thêm.');
        } else {
            console.error('❌ Lỗi:', error.message);
        }
    } finally {
        process.exit();
    }
}

addEmailColumn();
