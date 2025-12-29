const pool = require('../config/db');

// Dữ liệu bài tập mẫu - CẬP NHẬT THEO YÊU CẦU NGƯỜI DÙNG
// Hỏi tiếng Việt => Đáp án tiếng Ngoại ngữ (để nghe đọc)
const exercisesData = [
    // Lesson 1: Tiếng Anh (English)
    {
        lesson_group: 0, // Index of lesson in fetched list
        question_text: "Số 1 trong tiếng Anh đọc là gì?",
        options: JSON.stringify(["One", "Two", "Three"]),
        correct_answer: "One"
    },
    {
        lesson_group: 0,
        question_text: "Số 2 trong tiếng Anh đọc là gì?",
        options: JSON.stringify(["One", "Two", "Three"]),
        correct_answer: "Two"
    },
    {
        lesson_group: 0,
        question_text: "Số 3 trong tiếng Anh đọc là gì?",
        options: JSON.stringify(["Five", "Four", "Three"]),
        correct_answer: "Three"
    },
    {
        lesson_group: 0,
        question_text: "Quả táo tiếng Anh là gì?",
        options: JSON.stringify(["Banana", "Apple", "Orange"]),
        correct_answer: "Apple"
    },

    // Lesson 2: Tiếng Hàn (Korean)
    {
        lesson_group: 1,
        question_text: "Số 1 tiếng Hàn đọc là gì?",
        options: JSON.stringify(["Hana", "Dul", "Set"]),
        correct_answer: "Hana"
    },
    {
        lesson_group: 1,
        question_text: "Số 2 tiếng Hàn đọc là gì?",
        options: JSON.stringify(["Hana", "Dul", "Set"]),
        correct_answer: "Dul"
    },

    // Lesson 3: Tiếng Trung (Chinese)
    {
        lesson_group: 2,
        question_text: "Số 1 tiếng Trung đọc là gì?",
        options: JSON.stringify(["Yi", "Er", "San"]),
        correct_answer: "Yi"
    },
    {
        lesson_group: 2,
        question_text: "Số 10 tiếng Trung là gì?",
        options: JSON.stringify(["Ba", "Jiu", "Shi"]),
        correct_answer: "Shi"
    },

    // Lesson 4: Test (General)
    {
        lesson_group: 3,
        question_text: "Video này dùng để làm gì?",
        options: JSON.stringify(["Học hát", "Test kỹ thuật", "Đếm số"]),
        correct_answer: "Test kỹ thuật"
    }
];

async function seedExercises() {
    try {
        console.log('🔄 Đang tạo dữ liệu bài tập trắc nghiệm MỚI...');

        // 1. Tắt check khóa ngoại để có thể Truncate
        await pool.execute('SET FOREIGN_KEY_CHECKS = 0');
        await pool.execute('TRUNCATE TABLE exercises');
        await pool.execute('SET FOREIGN_KEY_CHECKS = 1');
        console.log('🗑️  Đã dọn sạch bảng exercises.');

        // 2. Lấy danh sách lesson để map ID thực tế
        const [lessons] = await pool.execute('SELECT lesson_id, title FROM lessons ORDER BY lesson_id ASC LIMIT 10');

        if (lessons.length === 0) {
            console.log('⚠️ Không tìm thấy bài học nào. Hãy chạy finalize_lessons.js trước!');
            return;
        }

        console.log(`ℹ️ Tìm thấy ${lessons.length} bài học. Đang map dữ liệu...`);

        // 3. Insert dữ liệu
        for (const ex of exercisesData) {
            // Lấy lesson id thực từ mảng lessons dựa trên index group
            if (ex.lesson_group < lessons.length) {
                const realLessonId = lessons[ex.lesson_group].lesson_id;

                await pool.execute(
                    `INSERT INTO exercises (lesson_id, question_text, options, correct_answer, type, level, created_at) 
                     VALUES (?, ?, ?, ?, 'multiple_choice', 'easy', NOW())`,
                    [realLessonId, ex.question_text, ex.options, ex.correct_answer]
                );
            }
        }

        console.log(`✅ Đã cập nhật xong bộ câu hỏi mới (Hỏi Tiếng Việt -> Đáp án Ngoại ngữ).`);

    } catch (error) {
        console.error('❌ Lỗi seed exercises:', error);
    } finally {
        if (require.main === module) process.exit(0);
    }
}

if (require.main === module) {
    seedExercises();
}

module.exports = seedExercises;
