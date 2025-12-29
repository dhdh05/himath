const pool = require('../config/db');

// Helper: Trao reward
async function awardReward(student_id, reward_title, reason) {
    try {
        await pool.execute(
            'INSERT INTO rewards (student_id, reward_title, reason, date_awarded) VALUES (?, ?, ?, NOW())',
            [student_id, reward_title, reason]
        );
        return true;
    } catch (error) {
        console.error("Lỗi trao reward:", error);
        return false;
    }
}

// Check và trao rewards khi đạt mốc
// Note: Không response, chỉ return data để gameController response
exports.checkRewards = async (req) => {
    try {
        const student_id = req.user.id;
        const newRewards = [];
        
        // 1. Check streak_10 -> trao reward
        const [sessions] = await pool.execute(
            `SELECT DISTINCT DATE(start_time) as study_date
             FROM study_sessions
             WHERE user_id = ? AND page_name != 'home' AND page_name != 'users' AND duration > 0
             ORDER BY study_date DESC LIMIT 10`,
            [student_id]
        );
        
        if (sessions.length >= 10) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let streak = 0;
            
            for (let i = 0; i < sessions.length; i++) {
                const sessionDate = new Date(sessions[i].study_date);
                sessionDate.setHours(0, 0, 0, 0);
                const diffDays = Math.floor((today - sessionDate) / (1000 * 60 * 60 * 24));
                if (diffDays === i || (i === 0 && diffDays <= 1)) {
                    streak++;
                } else break;
            }
            
            if (streak >= 10) {
                const [existing] = await pool.execute(
                    'SELECT reward_id FROM rewards WHERE student_id = ? AND reward_title LIKE ?',
                    [student_id, '%Chăm Chỉ%']
                );
                
                if (existing.length === 0) {
                    const awarded = await awardReward(
                        student_id,
                        '🏆 Học Sinh Chăm Chỉ',
                        'Đã học liên tiếp 10 ngày!'
                    );
                    if (awarded) newRewards.push({ title: '🏆 Học Sinh Chăm Chỉ', reason: 'Đã học liên tiếp 10 ngày!' });
                }
            }
        }
        
        // 2. Check 100 sao -> trao reward
        const [stars] = await pool.execute(
            'SELECT SUM(stars) as total FROM game_results WHERE student_id = ?',
            [student_id]
        );
        
        if (stars[0].total >= 100) {
            const [existing] = await pool.execute(
                'SELECT reward_id FROM rewards WHERE student_id = ? AND reward_title LIKE ?',
                [student_id, '%Thu Thập Sao%']
            );
            
            if (existing.length === 0) {
                const awarded = await awardReward(
                    student_id,
                    '⭐ Thu Thập Sao',
                    'Đã thu thập 100 sao!'
                );
                if (awarded) newRewards.push({ title: '⭐ Thu Thập Sao', reason: 'Đã thu thập 100 sao!' });
            }
        }
        
        // 3. Check 1000 điểm -> trao reward
        const [scores] = await pool.execute(
            'SELECT SUM(score) as total FROM game_results WHERE student_id = ?',
            [student_id]
        );
        
        if (scores[0].total >= 1000) {
            const [existing] = await pool.execute(
                'SELECT reward_id FROM rewards WHERE student_id = ? AND reward_title LIKE ?',
                [student_id, '%Điểm Cao%']
            );
            
            if (existing.length === 0) {
                const awarded = await awardReward(
                    student_id,
                    '🎯 Điểm Cao',
                    'Đã đạt tổng 1000 điểm!'
                );
                if (awarded) newRewards.push({ title: '🎯 Điểm Cao', reason: 'Đã đạt tổng 1000 điểm!' });
            }
        }
        
        // Return rewards để gameController có thể include vào response
        return { success: true, new_rewards: newRewards };
    } catch (error) {
        console.error("Lỗi check rewards:", error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Lấy danh sách rewards của học sinh
exports.getRewards = async (req, res) => {
    try {
        const student_id = req.user.id;
        
        const [rewards] = await pool.execute(
            'SELECT * FROM rewards WHERE student_id = ? ORDER BY date_awarded DESC',
            [student_id]
        );
        
        res.json({ success: true, rewards });
    } catch (error) {
        console.error("Lỗi lấy rewards:", error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

