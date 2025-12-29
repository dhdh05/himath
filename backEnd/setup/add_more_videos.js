const pool = require('../src/config/db');

async function addMoreVideos() {
    try {
        console.log("🎬 Adding new educational videos & exercises...");

        // --- 1. Video: Bé tập đếm 1-10 ---
        // Link: https://www.youtube.com/watch?v=H7M8gqKk_84 (Bài hát tập đếm số)
        const [res1] = await pool.execute(
            `INSERT INTO lessons (title, description, video_url, thumbnail_url, topic, created_at) 
             VALUES (?, ?, ?, ?, ?, NOW())`,
            [
                'Bé tập đếm số từ 1 đến 10',
                'Học đếm số thật vui qua bài hát sôi động!',
                'https://www.youtube.com/watch?v=H7M8gqKk_84',
                'https://i.ytimg.com/vi/H7M8gqKk_84/hqdefault.jpg',
                'Toán học'
            ]
        );
        const lessonId1 = res1.insertId;
        console.log(`✅ Added Lesson 1: ID ${lessonId1}`);

        // Insert Exercises for Lesson 1
        const exercises1 = [
            { q: 'Số nào đứng sau số 1?', opts: ['0', '2', '3', '5'], ans: '2' },
            { q: 'Bàn tay bé có mấy ngón?', opts: ['2', '5', '10', '1'], ans: '5' },
            { q: 'Số 10 gồm số 1 và số mấy?', opts: ['0', '2', '5', '8'], ans: '0' },
            { q: 'Số nào lớn nhất trong các số sau?', opts: ['1', '5', '9', '3'], ans: '9' }
        ];

        for (const ex of exercises1) {
            await pool.execute(
                `INSERT INTO exercises (lesson_id, question_text, options, correct_answer) VALUES (?, ?, ?, ?)`,
                [lessonId1, ex.q, JSON.stringify(ex.opts), ex.ans]
            );
        }
        console.log(`   Added ${exercises1.length} exercises for Lesson 1.`);


        // --- 2. Video: Nhận biết hình khối ---
        // Link: https://www.youtube.com/watch?v=p4Qj3fS8wXw (Học hình khối)
        const [res2] = await pool.execute(
            `INSERT INTO lessons (title, description, video_url, thumbnail_url, topic, created_at) 
             VALUES (?, ?, ?, ?, ?, NOW())`,
            [
                'Nhận biết các hình khối cơ bản',
                'Hình tròn, hình vuông, hình tam giác có gì khác nhau nhỉ?',
                'https://www.youtube.com/watch?v=p4Qj3fS8wXw',
                'https://i.ytimg.com/vi/p4Qj3fS8wXw/hqdefault.jpg',
                'Hình học'
            ]
        );
        const lessonId2 = res2.insertId;
        console.log(`✅ Added Lesson 2: ID ${lessonId2}`);

        // Insert Exercises for Lesson 2
        const exercises2 = [
            { q: 'Hình nào có thể lăn được?', opts: ['Hình vuông', 'Hình tam giác', 'Hình tròn', 'Hình chữ nhật'], ans: 'Hình tròn' },
            { q: 'Bánh chưng ngày Tết có hình gì?', opts: ['Tròn', 'Vuông', 'Tam giác', 'Sao'], ans: 'Vuông' },
            { q: 'Hình tam giác có mấy cạnh?', opts: ['3 cạnh', '4 cạnh', '0 cạnh', '2 cạnh'], ans: '3 cạnh' },
            { q: 'Ông mặt trời thường được vẽ bằng hình gì?', opts: ['Hình vuông', 'Hình tròn', 'Hình tam giác', 'Hình chữ nhật'], ans: 'Hình tròn' }
        ];

        for (const ex of exercises2) {
            await pool.execute(
                `INSERT INTO exercises (lesson_id, question_text, options, correct_answer) VALUES (?, ?, ?, ?)`,
                [lessonId2, ex.q, JSON.stringify(ex.opts), ex.ans]
            );
        }
        console.log(`   Added ${exercises2.length} exercises for Lesson 2.`);

        console.log("🎉 Successfully added new content!");
        process.exit(0);

    } catch (err) {
        console.error("❌ Error adding videos:", err);
        process.exit(1);
    }
}

addMoreVideos();
