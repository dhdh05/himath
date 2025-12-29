const pool = require('../src/config/db');

async function replaceShapeVideo() {
    try {
        console.log("🔄 Replacing Shape Video with a more reliable source...");

        // Video mới: Dạy bé nhận biết hình khối (Kênh phổ biến, ít bị chặn)
        // Link: https://www.youtube.com/watch?v=Q74V3Y29tYs
        const newUrl = 'https://www.youtube.com/watch?v=Q74V3Y29tYs';
        const newThumb = 'https://i.ytimg.com/vi/Q74V3Y29tYs/hqdefault.jpg';

        await pool.execute(
            `UPDATE lessons 
             SET video_url = ?, thumbnail_url = ?
             WHERE title LIKE '%hình khối%' OR title LIKE '%các hình%' OR topic = 'Hình học'`,
            [newUrl, newThumb]
        );

        console.log("✅ Updated Shape Video successfully!");
        console.log(`🔗 New URL: ${newUrl}`);
        process.exit(0);

    } catch (err) {
        console.error("❌ Error replacing video:", err);
        process.exit(1);
    }
}

replaceShapeVideo();
