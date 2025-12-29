const pool = require('../config/db');

// Tạo mục tiêu mới
exports.createGoal = async (req, res) => {
    try {
        const student_id = req.user.id; // User hiện tại (học sinh) tự đặt hoặc phụ huynh đặt (cần check role)
        // Nếu role là phụ huynh, cần student_id từ body. Nếu là học sinh, lấy từ req.user.id

        let target_student_id = student_id;
        if (req.user.role === 'parent' && req.body.student_id) {
            target_student_id = req.body.student_id;
        }

        const { goal_type, target_value, deadline } = req.body;

        // Validation cơ bản
        if (!goal_type || !target_value) {
            return res.status(400).json({ success: false, message: 'Thiếu thông tin goal_type hoặc target_value' });
        }

        await pool.execute(
            'INSERT INTO learning_goals (student_id, goal_type, target_value, deadline, created_at) VALUES (?, ?, ?, ?, NOW())',
            [target_student_id, goal_type, target_value, deadline || null]
        );

        res.json({ success: true, message: 'Đã tạo mục tiêu mới' });
    } catch (error) {
        console.error('Create Goal Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
    }
};

// Lấy danh sách mục tiêu
exports.getGoals = async (req, res) => {
    try {
        let student_id = req.user.id;

        // Nếu là phụ huynh xem của con
        if (req.user.role === 'parent' && req.params.student_id) {
            student_id = req.params.student_id;
        }

        const [goals] = await pool.execute(
            'SELECT * FROM learning_goals WHERE student_id = ? ORDER BY created_at DESC',
            [student_id]
        );
        res.json({ success: true, goals });
    } catch (error) {
        console.error('Get Goals Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};
