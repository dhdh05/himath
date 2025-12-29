const pool = require('../config/db');

// Danh sách video mới - CHẮC CHẮN CHO PHÉP NHÚNG
// Nguồn: Các kênh giáo dục trẻ em nổi tiếng (BabyBus, POPS Kids...)
const newLessons = [
    {
        title: "Bài Hát Tập Đếm Số 1-10",
        topic: "Làm quen số",
        description: "Cùng hát và đếm số với các bạn động vật dễ thương nhé!",
        video_url: "https://www.youtube.com/embed/M6Efzu2slHg",
        thumbnail_url: "https://img.youtube.com/vi/M6Efzu2slHg/mqdefault.jpg"
    },
    {
        title: "Học Phép Cộng Đơn Giản",
        topic: "Phép tính",
        description: "Bé học cộng trừ trong phạm vi 5 siêu dễ hiểu.",
        video_url: "https://www.youtube.com/embed/Z0oF_CMrR8g",
        thumbnail_url: "https://img.youtube.com/vi/Z0oF_CMrR8g/mqdefault.jpg"
    },
    {
        title: "Nhận Biết Hình Khối",
        topic: "Hình học",
        description: "Hình tròn, hình vuông, hình tam giác ở đâu nhỉ?",
        video_url: "https://www.youtube.com/embed/pSj7jT-g3qA",
        thumbnail_url: "https://img.youtube.com/vi/pSj7jT-g3qA/mqdefault.jpg"
    },
    {
        title: "So Sánh To Hơn, Nhỏ Hơn",
        topic: "So sánh",
        description: "Cá sấu tham ăn giúp bé phân biệt lớn bé.",
        video_url: "https://www.youtube.com/embed/8jOzvki-tT4",
        thumbnail_url: "https://img.youtube.com/vi/8jOzvki-tT4/mqdefault.jpg"
    }
];

async function fixLessons() {
    try {
        console.log('🔄 Đang cập nhật lại danh sách bài học...');

        // 1. Xóa hết dữ liệu cũ
        await pool.execute('TRUNCATE TABLE lessons');
        console.log('🗑️ Đã xóa dữ liệu cũ bị lỗi.');

        // 2. Thêm dữ liệu mới
        for (const lesson of newLessons) {
            await pool.execute(
                `INSERT INTO lessons (title, topic, description, video_url, thumbnail_url, created_at) 
                 VALUES (?, ?, ?, ?, ?, NOW())`,
                [lesson.title, lesson.topic, lesson.description, lesson.video_url, lesson.thumbnail_url]
            );
            console.log(`✅ Đã thêm video mới: ${lesson.title}`);
        }

        console.log('🎉 Cập nhật hoàn tất! Hãy refresh lại trang web.');

    } catch (error) {
        console.error('❌ Lỗi cập nhật lessons:', error);
    } finally {
        if (require.main === module) process.exit(0);
    }
}

if (require.main === module) {
    fixLessons();
}

module.exports = fixLessons;
