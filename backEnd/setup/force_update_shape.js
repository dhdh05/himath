const pool = require('../src/config/db');

async function forceUpdateShapeVideo() {
    try {
        console.log("🚀 Switching to BabyBus video (Safe Embed)...");

        // Video BabyBus: https://www.youtube.com/watch?v=Kz8rKw-rVQI
        const newUrl = 'https://www.youtube.com/watch?v=Kz8rKw-rVQI';

        // Cập nhật bằng ID hoặc LIKE title
        // Đảm bảo update đúng bài "Nhận biết các hình khối cơ bản"
        const [result] = await pool.execute(
            `UPDATE lessons 
             SET video_url = ?, 
                 thumbnail_url = 'https://i.ytimg.com/vi/Kz8rKw-rVQI/hqdefault.jpg'
             WHERE title LIKE '%hình khối%' OR topic = 'Hình học'`,
            [newUrl]
        );

        if (result.changedRows > 0) {
            console.log("✅ Database updated successfully!");
        } else {
            console.log("⚠️ No rows matched. Checking DB content...");
            const [rows] = await pool.execute("SELECT * FROM lessons WHERE topic = 'Hình học'");
            console.log("Found lessons:", rows);
        }

        process.exit(0);

    } catch (err) {
        console.error("❌ Error:", err);
        process.exit(1);
    }
}

forceUpdateShapeVideo();
