const pool = require('../config/db');

const sampleLessons = [
    {
        title: "Bé học đếm số từ 1 đến 10",
        topic: "Làm quen số",
        description: "Video vui nhộn giúp bé làm quen với các con số cơ bản.",
        // Using a YouTube Embed link example (generic educational content)
        video_url: "https://www.youtube.com/embed/e0dJWfQHF8Y",
        thumbnail_url: "https://img.youtube.com/vi/e0dJWfQHF8Y/maxresdefault.jpg"
    },
    {
        title: "Phép cộng trong phạm vi 5",
        topic: "Phép tính",
        description: "Học cách cộng các số nhỏ đơn giản và thú vị.",
        video_url: "https://www.youtube.com/embed/Up9Mc7Jv8M0",
        thumbnail_url: "https://img.youtube.com/vi/Up9Mc7Jv8M0/maxresdefault.jpg"
    },
    {
        title: "So sánh Lớn hơn, Bé hơn",
        topic: "So sánh",
        description: "Cá sấu tham ăn sẽ giúp bé phân biệt số lớn và số bé.",
        video_url: "https://www.youtube.com/embed/M6Efzu2slHg",
        thumbnail_url: "https://img.youtube.com/vi/M6Efzu2slHg/maxresdefault.jpg"
    },
    {
        title: "Hình học vui nhộn: Hình tròn, Vuông, Tam giác",
        topic: "Hình học",
        description: "Nhận biết các hình khối cơ bản xung quanh ta.",
        video_url: "https://www.youtube.com/embed/3yX3i9wI_d0",
        thumbnail_url: "https://img.youtube.com/vi/3yX3i9wI_d0/maxresdefault.jpg"
    }
];

async function seedLessons() {
    try {
        console.log('🌱 Đang khởi tạo dữ liệu bài học mẫu...');

        // 1. Clear existing lessons to avoid weird duplicates (optional, strictly for dev/demo)
        // await pool.execute('TRUNCATE TABLE lessons'); 

        // 2. Insert if not exists
        for (const lesson of sampleLessons) {
            // Check existence by title
            const [rows] = await pool.execute('SELECT lesson_id FROM lessons WHERE title = ?', [lesson.title]);

            if (rows.length === 0) {
                await pool.execute(
                    `INSERT INTO lessons (title, topic, description, video_url, thumbnail_url, created_at) 
                     VALUES (?, ?, ?, ?, ?, NOW())`,
                    [lesson.title, lesson.topic, lesson.description, lesson.video_url, lesson.thumbnail_url]
                );
                console.log(`✅ Đã thêm: ${lesson.title}`);
            } else {
                console.log(`👌 Đã có: ${lesson.title}`);
            }
        }
        console.log('🏁 Hoàn tất khởi tạo dữ liệu bài học.');
    } catch (error) {
        console.error('❌ Lỗi seed lessons:', error);
    } finally {
        if (require.main === module) process.exit(0);
    }
}

if (require.main === module) {
    seedLessons();
}

module.exports = seedLessons;
