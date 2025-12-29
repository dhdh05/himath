const pool = require('../src/config/db');

async function restoreVideos() {
    try {
        console.log("🚑 Restoring original Drive videos...");

        // 1. Phục hồi bài Tiếng Hàn
        await pool.execute(
            `UPDATE lessons 
             SET video_url = ?, thumbnail_url = ?
             WHERE title LIKE '%tiếng Hàn%'`,
            [
                'https://drive.google.com/file/d/1PvVUcItfaHe_WosHsELAu6wB0hRBCWPr/view?usp=drive_link',
                './assets/images/thumbnails/kr-numbers-1.png'
            ]
        );
        console.log("✅ Restored Korean counting video.");

        // 2. Phục hồi bài Tiếng Anh (nếu cần)
        await pool.execute(
            `UPDATE lessons 
             SET video_url = ?
             WHERE title LIKE '%tiếng Anh%'`,
            [
                'https://drive.google.com/file/d/1FV7ZNywSaBBqP1ShVJXOBoB7mB3TPzkx/view?usp=drive_link'
            ]
        );
        console.log("✅ Restored English counting video.");

        // 3. Phục hồi bài Tiếng Trung (nếu cần)
        await pool.execute(
            `UPDATE lessons 
             SET video_url = ?
             WHERE title LIKE '%tiếng Trung%'`,
            [
                'https://drive.google.com/file/d/1HPvHALcAmGGY2VmBEXbe9XiS6sF9NyO4/view?usp=sharing'
            ]
        );
        console.log("✅ Restored Chinese counting video.");

        console.log("🎉 Restoration Complete. Sorry for the trouble!");
        process.exit(0);

    } catch (err) {
        console.error("❌ Restore Error:", err);
        process.exit(1);
    }
}

restoreVideos();
