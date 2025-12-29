const pool = require('../src/config/db');

async function initLearningCorner() {
    try {
        console.log("🏗️ Initializing Learning Corner Database...");

        // 1. Create table `lessons`
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS lessons (
                lesson_id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                video_url VARCHAR(500),
                thumbnail_url VARCHAR(500),
                topic VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("✅ Table 'lessons' ready.");

        // 2. Create table `exercises`
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS exercises (
                exercise_id INT AUTO_INCREMENT PRIMARY KEY,
                lesson_id INT,
                question_text TEXT NOT NULL,
                options JSON, -- Lưu mảng đáp án dạng JSON ["A", "B", "C", "D"]
                correct_answer VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id) ON DELETE CASCADE
            )
        `);
        console.log("✅ Table 'exercises' ready.");

        // 3. Check data
        const [rows] = await pool.execute('SELECT COUNT(*) as count FROM lessons');
        if (rows[0].count === 0) {
            console.log("📥 Seeding sample data...");

            // --- Lesson 1: Counting ---
            const [res1] = await pool.execute(
                `INSERT INTO lessons (title, description, video_url, thumbnail_url, topic) 
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    'Bé tập đếm số từ 1 đến 10',
                    'Học đếm số thật vui cùng VTV7 Kids!',
                    'https://www.youtube.com/watch?v=Aq4UAss33qA',
                    'https://i.ytimg.com/vi/Aq4UAss33qA/hqdefault.jpg',
                    'Toán học'
                ]
            );

            // Exercises 1
            const ex1 = [
                { q: 'Số nào đứng sau số 1?', opts: ['0', '2', '3', '5'], ans: '2' },
                { q: 'Bàn tay bé có mấy ngón?', opts: ['2', '5', '10', '1'], ans: '5' },
                { q: 'Số 10 gồm số 1 và số mấy?', opts: ['0', '2', '5', '8'], ans: '0' }
            ];
            for (const ex of ex1) {
                await pool.execute(
                    'INSERT INTO exercises (lesson_id, question_text, options, correct_answer) VALUES (?, ?, ?, ?)',
                    [res1.insertId, ex.q, JSON.stringify(ex.opts), ex.ans]
                );
            }

            // --- Lesson 2: Shapes ---
            const [res2] = await pool.execute(
                `INSERT INTO lessons (title, description, video_url, thumbnail_url, topic) 
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    'Nhận biết các hình khối cơ bản',
                    'Hình tròn, hình vuông, hình tam giác có gì khác nhau nhỉ?',
                    'https://www.youtube.com/watch?v=FzCag9bJg-4',
                    'https://i.ytimg.com/vi/FzCag9bJg-4/hqdefault.jpg',
                    'Hình học'
                ]
            );

            // Exercises 2
            const ex2 = [
                { q: 'Hình nào có thể lăn được?', opts: ['Hình vuông', 'Hình tam giác', 'Hình tròn', 'Hình chữ nhật'], ans: 'Hình tròn' },
                { q: 'Hình tam giác có mấy cạnh?', opts: ['3 cạnh', '4 cạnh', '0 cạnh', '2 cạnh'], ans: '3 cạnh' }
            ];
            for (const ex of ex2) {
                await pool.execute(
                    'INSERT INTO exercises (lesson_id, question_text, options, correct_answer) VALUES (?, ?, ?, ?)',
                    [res2.insertId, ex.q, JSON.stringify(ex.opts), ex.ans]
                );
            }

            console.log("✅ Data seeded successfully!");
        } else {
            console.log("ℹ️ Data already exists. Skipping seed.");
        }

        console.log("🎉 Learning Corner Initialization Complete!");
        process.exit(0);

    } catch (err) {
        console.error("❌ Init Error:", err);
        process.exit(1);
    }
}

initLearningCorner();
