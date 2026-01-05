const pool = require('../config/db');

// Lay streak hien tai cua hoc sinh
exports.getStreak = async (req, res) => {
    try {
        const student_id = req.user.id;

        // Lay cac ngay da hoc (tu study_sessions - bang da co)
        const [sessions] = await pool.execute(
            `SELECT DISTINCT DATE(start_time) as study_date
             FROM study_sessions
             WHERE user_id = ? 
               AND page_name != 'home' 
               AND page_name != 'users'
               AND duration > 0
             ORDER BY study_date DESC
             LIMIT 30`, // Chi check 30 ngay gan nhat
            [student_id]
        );

        // Tinh streak (so ngay lien tiep)
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < sessions.length; i++) {
            const sessionDate = new Date(sessions[i].study_date);
            sessionDate.setHours(0, 0, 0, 0);

            const diffDays = Math.floor((today - sessionDate) / (1000 * 60 * 60 * 24));

            // Neu ngay hoc cach hom nay dung i ngay -> streak tiep tuc
            // Cho phep streak neu hoc hom nay hoac hom qua (de tinh streak dung)
            if (diffDays === i || (i === 0 && diffDays <= 1)) {
                streak++;
            } else {
                break;
            }
        }

        // Tinh tong so ngay da hoc
        const totalDays = sessions.length;

        res.json({
            success: true,
            streak: streak,
            total_days: totalDays,
            last_study_date: sessions[0]?.study_date || null
        });
    } catch (error) {
        console.error("Loi lay streak:", error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

