const pool = require('../config/db');
const bcrypt = require('bcryptjs');

async function migratePasswords() {
    try {
        console.log('🔄 Bắt đầu kiểm tra và mã hóa mật khẩu cũ...');

        // 1. Lấy tất cả user
        const [users] = await pool.execute('SELECT user_id, password FROM users');
        let count = 0;

        for (const user of users) {
            // Kiểm tra nếu pass chưa được hash (bcrypt thường bắt đầu bằng $2a$, $2b$...)
            // Đơn giản hóa: Nếu độ dài mật khẩu < 20 ký tự thì chắc chắn là chưa hash (hash bcrypt luôn dài 60 ký tự)
            if (user.password && user.password.length < 50) {
                const hashedPassword = await bcrypt.hash(user.password, 10);

                await pool.execute('UPDATE users SET password = ? WHERE user_id = ?', [hashedPassword, user.user_id]);
                count++;
                console.log(`✅ Đã cập nhật mật khẩu cho User ID: ${user.user_id}`);
            }
        }

        if (count > 0) {
            console.log(`🎉 Thành công! Đã mã hóa lại ${count} tài khoản.`);
        } else {
            console.log('👌 Tất cả tài khoản đã được bảo mật. Không cần cập nhật.');
        }

    } catch (error) {
        console.error('❌ Lỗi Migration:', error);
    } finally {
        if (require.main === module) process.exit(0);
    }
}

if (require.main === module) {
    migratePasswords();
}

module.exports = migratePasswords;
