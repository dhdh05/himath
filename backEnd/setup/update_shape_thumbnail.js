const pool = require('../src/config/db');

async function updateShapeThumbnail() {
    try {
        console.log("🖼️ Updating Shape Lesson Thumbnail...");

        // Sử dụng thumbnail xịn xò, màu sắc rực rỡ (BabyBus style)
        const newThumb = 'https://i.ytimg.com/vi/Kz8rKw-rVQI/maxresdefault.jpg';
        // maxresdefault cho nét hơn hqdefault

        await pool.execute(
            `UPDATE lessons 
             SET thumbnail_url = ?
             WHERE title LIKE '%hình khối%' OR topic = 'Hình học'`,
            [newThumb]
        );

        console.log("✅ Updated Thumbnail successfully!");
        process.exit(0);

    } catch (err) {
        console.error("❌ Error updating thumbnail:", err);
        process.exit(1);
    }
}

updateShapeThumbnail();
