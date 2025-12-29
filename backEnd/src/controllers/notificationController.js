const pool = require('../config/db');

// Tự động tạo notification
exports.createNotification = async (student_id, type, message) => {
    try {
        const [student] = await pool.execute(
            'SELECT parent_id FROM students WHERE user_id = ?',
            [student_id]
        );

        if (student[0]?.parent_id) {
            await pool.execute(
                'INSERT INTO parent_notifications (student_id, parent_id, message, type) VALUES (?, ?, ?, ?)',
                [student_id, student[0].parent_id, message, type]
            );
        }
    } catch (error) {
        console.error('Create Notification Error:', error);
    }
};

// Lấy danh sách notifications cho phụ huynh
exports.getNotifications = async (req, res) => {
    try {
        const parent_id = req.user.id;
        const [notifications] = await pool.execute(
            `SELECT pn.*, u.full_name as student_name 
       FROM parent_notifications pn
       JOIN students s ON pn.student_id = s.user_id
       JOIN users u ON s.user_id = u.user_id
       WHERE pn.parent_id = ? 
       ORDER BY pn.created_at DESC
       LIMIT 50`,
            [parent_id]
        );
        res.json({ success: true, notifications });
    } catch (error) {
        console.error('Get Notifications Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Đánh dấu đã đọc
exports.markAsRead = async (req, res) => {
    try {
        const { notification_id } = req.params;
        await pool.execute(
            'UPDATE parent_notifications SET is_read = 1 WHERE notification_id = ?',
            [notification_id]
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Mark Read Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};
