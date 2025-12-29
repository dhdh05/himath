const pool = require('../src/config/db');

async function updateShapeDrive() {
    try {
        console.log("🔄 Updating Shape Video to User's Drive Link...");

        // Link Drive mới từ user
        const newUrl = 'https://drive.google.com/file/d/1OkJ1dgjcbpBfNQqnrgDO_NGU0_1nuxgI/view?usp=drive_link';

        // Cập nhật vào bài học Hình Khối
        await pool.execute(
            `UPDATE lessons 
             SET video_url = ?
             WHERE title LIKE '%hình khối%' OR topic = 'Hình học'`,
            [newUrl]
        );

        console.log("✅ Updated Shape Video successfully to Drive Link!");
        process.exit(0);

    } catch (err) {
        console.error("❌ Error converting video:", err);
        process.exit(1);
    }
}

updateShapeDrive();
