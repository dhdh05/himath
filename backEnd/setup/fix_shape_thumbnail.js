const pool = require('../src/config/db');

async function fixShapeThumbnail() {
    try {
        console.log("🛠️ Fixing Shape Lesson Thumbnail...");

        // Chuyển sang hqdefault (luôn tồn tại) thay vì maxresdefault (có thể lỗi)
        const saferThumb = 'https://i.ytimg.com/vi/Kz8rKw-rVQI/hqdefault.jpg';

        await pool.execute(
            `UPDATE lessons 
             SET thumbnail_url = ?
             WHERE title LIKE '%hình khối%' OR topic = 'Hình học'`,
            [saferThumb]
        );

        console.log("✅ Fixed Thumbnail URL to hqdefault (Safe Mode)!");
        process.exit(0);

    } catch (err) {
        console.error("❌ Error:", err);
        process.exit(1);
    }
}

fixShapeThumbnail();
