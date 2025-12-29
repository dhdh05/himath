const pool = require('../config/db');

exports.getLessons = async (req, res) => {
    try {
        const [lessons] = await pool.execute('SELECT * FROM lessons ORDER BY created_at DESC');
        res.json({ success: true, data: lessons });
    } catch (error) {
        console.error('Get Lessons Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi tải bài học' });
    }
};

exports.getExercisesByLesson = async (req, res) => {
    try {
        const { lesson_id } = req.params;
        const [exercises] = await pool.execute(
            'SELECT * FROM exercises WHERE lesson_id = ? ORDER BY RAND() LIMIT 5',
            [lesson_id]
        );

        // Parse JSON options if string
        const parsedExercises = exercises.map(ex => {
            if (typeof ex.options === 'string') {
                try { ex.options = JSON.parse(ex.options); } catch (e) { }
            }
            return ex;
        });

        res.json({ success: true, data: parsedExercises });
    } catch (error) {
        console.error('Get Exercises Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi tải bài tập' });
    }
};
