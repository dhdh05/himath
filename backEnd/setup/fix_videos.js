const pool = require('../src/config/db');

async function fixVideos() {
    try {
        console.log("🛠️ Fixing video links to nicer sources (VTV7 Kids)...");

        // 1. Fix Bài đếm số
        // Video VTV7: https://www.youtube.com/watch?v=Aq4UAss33qA
        await pool.execute(
            `UPDATE lessons 
             SET video_url = 'https://www.youtube.com/watch?v=Aq4UAss33qA',
                 thumbnail_url = 'https://i.ytimg.com/vi/Aq4UAss33qA/hqdefault.jpg'
             WHERE title LIKE '%đếm số%' OR title LIKE '%1 đến 10%'`
        );
        console.log("✅ Updated Lesson 1 (Counting) to VTV7 source.");

        // 2. Fix Bài hình khối
        // Video VTV7: https://www.youtube.com/watch?v=FzCag9bJg-4
        await pool.execute(
            `UPDATE lessons 
             SET video_url = 'https://www.youtube.com/watch?v=FzCag9bJg-4',
                 thumbnail_url = 'https://i.ytimg.com/vi/FzCag9bJg-4/hqdefault.jpg'
             WHERE title LIKE '%hình khối%' OR title LIKE '%Tròn, Vuông%'`
        );
        console.log("✅ Updated Lesson 2 (Shapes) to VTV7 source.");

        console.log("🎉 All videos repaired!");
        process.exit(0);

    } catch (err) {
        console.error("❌ Error fixing videos:", err);
        process.exit(1);
    }
}

fixVideos();
