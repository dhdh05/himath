const pool = require('../config/db');

// Danh sách video CHUẨN: Chỉ dùng Link Google Drive (của User) & MP4 Test
// Đã loại bỏ toàn bộ link Youtube lỗi.
const finalLessons = [
    {
        title: "Học đếm số tiếng Anh (1-10)",
        topic: "Ngoại ngữ",
        description: "Bé học đếm số tiếng Anh vui nhộn.",
        // Link Drive User cung cấp
        video_url: "https://drive.google.com/file/d/1FV7ZNywSaBBqP1ShVJXOBoB7mB3TPzkx/view?usp=drive_link",
        thumbnail_url: "https://img.freepik.com/free-vector/numbers-cartoons-set_1284-11652.jpg"
    },
    {
        title: "Học đếm số tiếng Hàn (1-10)",
        topic: "Ngoại ngữ",
        description: "Cùng Pinkfong đếm số tiếng Hàn thật dễ dàng.",
        // Link Drive User cung cấp
        video_url: "https://drive.google.com/file/d/1PvVUcItfaHe_WosHsELAu6wB0hRBCWPr/view?usp=drive_link",
        thumbnail_url: "./assets/images/thumbnails/kr-numbers-1.png"
    },
    {
        title: "Cùng đếm từ 1 tới 10 bằng tiếng Trung nhé",
        topic: "Ngoại ngữ",
        description: "Học đếm số tiếng Trung qua bài hát vui nhộn.",
        // Link Drive User cung cấp
        video_url: "https://drive.google.com/file/d/1HPvHALcAmGGY2VmBEXbe9XiS6sF9NyO4/view?usp=sharing",
        thumbnail_url: "./assets/images/thumbnails/chinese_numbers.jpg"
    },
    {
        title: "TEST KỸ THUẬT: Sintel (W3C)",
        topic: "Test",
        description: "Video này để kiểm tra trình phát MP4.",
        video_url: "https://media.w3.org/2010/05/sintel/trailer.mp4",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Sintel_poster.jpg/640px-Sintel_poster.jpg"
    }
];

async function finalizeLessons() {
    try {
        console.log('🔄 Đang đồng bộ danh sách Video Drive vào Database...');

        // 1. Tắt check khóa ngoại để có thể Truncate
        await pool.execute('SET FOREIGN_KEY_CHECKS = 0');

        // 2. Xóa hết dữ liệu cũ
        await pool.execute('TRUNCATE TABLE lessons');
        console.log('🗑️  Đã dọn sạch bảng lessons.');

        // 3. Bật lại check khóa ngoại
        await pool.execute('SET FOREIGN_KEY_CHECKS = 1');

        // 2. Thêm dữ liệu mới
        for (const lesson of finalLessons) {
            await pool.execute(
                `INSERT INTO lessons (title, topic, description, video_url, thumbnail_url, created_at) 
                 VALUES (?, ?, ?, ?, ?, NOW())`,
                [lesson.title, lesson.topic, lesson.description, lesson.video_url, lesson.thumbnail_url]
            );
            console.log(`✅ Đã thêm: ${lesson.title}`);
        }
        console.log('🎉 Hoàn tất! Danh sách bài học hiện tại đã sạch sẽ và chạy tốt.');

    } catch (error) {
        console.error('❌ Lỗi cập nhật lessons:', error);
    } finally {
        if (require.main === module) process.exit(0);
    }
}

if (require.main === module) {
    finalizeLessons();
}

module.exports = finalizeLessons;
