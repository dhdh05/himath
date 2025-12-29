const pool = require('../config/db');

// Lấy streak hiện tại của học sinh
exports.getStreak = async (req, res) => {
    try {
        const student_id = req.user.id;
        
        // Lấy các ngày đã học (từ study_sessions - bảng đã có)
        const [sessions] = await pool.execute(
            `SELECT DISTINCT DATE(start_time) as study_date
             FROM study_sessions
             WHERE user_id = ? 
               AND page_name != 'home' 
               AND page_name != 'users'
               AND duration > 0
             ORDER BY study_date DESC
             LIMIT 30`, // Chỉ check 30 ngày gần nhất
            [student_id]
        );
        
        // Tính streak (số ngày liên tiếp)
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < sessions.length; i++) {
            const sessionDate = new Date(sessions[i].study_date);
            sessionDate.setHours(0, 0, 0, 0);
            
            const diffDays = Math.floor((today - sessionDate) / (1000 * 60 * 60 * 24));
            
            // Nếu ngày học cách hôm nay đúng i ngày -> streak tiếp tục
            // Cho phép streak nếu học hôm nay hoặc hôm qua (để tính streak đúng)
            if (diffDays === i || (i === 0 && diffDays <= 1)) {
                streak++;
            } else {
                break;
            }
        }
        
        // Tính tổng số ngày đã học
        const totalDays = sessions.length;
        
        res.json({ 
            success: true, 
            streak: streak,
            total_days: totalDays,
            last_study_date: sessions[0]?.study_date || null
        });
    } catch (error) {
        console.error("Lỗi lấy streak:", error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

