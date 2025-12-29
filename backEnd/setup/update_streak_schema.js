const pool = require('./src/config/db');

async function updateSchema() {
    try {
        console.log("🛠️ Starting Schema Update for Streak...");

        // 1. Thêm cột streak_count vào bảng students nếu chưa có
        try {
            await pool.query(`ALTER TABLE students ADD COLUMN streak_count INT DEFAULT 0`);
            console.log("✅ Added streak_count column.");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log("ℹ️ streak_count column already exists.");
            else console.error("⚠️ Error adding streak_count:", e.message);
        }

        // 2. Thêm cột last_activity_date vào bảng students nếu chưa có
        try {
            await pool.query(`ALTER TABLE students ADD COLUMN last_activity_date TINYTEXT DEFAULT NULL`);
            // Dùng TINYTEXT hoặc VARCHAR để lưu string 'YYYY-MM-DD' cho dễ so sánh
            console.log("✅ Added last_activity_date column.");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log("ℹ️ last_activity_date column already exists.");
            else console.error("⚠️ Error adding last_activity_date:", e.message);
        }

        console.log("🎉 Schema Update Completed!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Fatal Error:", err);
        process.exit(1);
    }
}

updateSchema();
