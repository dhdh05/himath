const pool = require('../config/db');

// Helper: Trao achievement
async function awardAchievement(student_id, game_type, achievement_type, title, description) {
    try {
        // Kiểm tra xem đã có achievement này chưa
        const [existing] = await pool.execute(
            'SELECT achievement_id FROM game_achievements WHERE student_id = ? AND achievement_type = ? AND game_type = ?',
            [student_id, achievement_type, game_type || null]
        );
        
        if (existing.length === 0) {
            await pool.execute(
                'INSERT INTO game_achievements (student_id, game_type, achievement_type, title, description, earned_at) VALUES (?, ?, ?, ?, ?, NOW())',
                [student_id, game_type, achievement_type, title, description]
            );
            return true; // Achievement mới được trao
        }
        return false; // Đã có rồi
    } catch (error) {
        console.error("Lỗi trao achievement:", error);
        return false;
    }
}

// Check và trao achievements sau khi submit score
// Note: Không response, chỉ return data để gameController response
exports.checkAchievements = async (req) => {
    try {
        const student_id = req.user.id;
        const { game_type, score, level_id, stars } = req.body;
        
        const newAchievements = [];
        
        // 1. Check perfect_score (đạt 100 điểm)
        if (score === 100) {
            const awarded = await awardAchievement(
                student_id, 
                game_type, 
                'perfect_score',
                'Điểm Tuyệt Đối! ⭐',
                `Bé đã đạt 100 điểm trong ${game_type}!`
            );
            if (awarded) newAchievements.push({ type: 'perfect_score', title: 'Điểm Tuyệt Đối! ⭐' });
        }
        
        // 2. Check first_play (lần đầu chơi game)
        const [played] = await pool.execute(
            'SELECT COUNT(*) as count FROM game_results WHERE student_id = ? AND game_type = ?',
            [student_id, game_type]
        );
        if (played[0].count === 1) {
            const awarded = await awardAchievement(
                student_id,
                game_type,
                'first_play',
                'Khám Phá Mới! 🎮',
                `Bé đã thử game ${game_type} lần đầu!`
            );
            if (awarded) newAchievements.push({ type: 'first_play', title: 'Khám Phá Mới! 🎮' });
        }
        
        // 3. Check level_master (hoàn thành tất cả level của game)
        if (level_id) {
            const [levels] = await pool.execute(
                'SELECT COUNT(*) as total FROM game_levels WHERE game_type = ?',
                [game_type]
            );
            const [completed] = await pool.execute(
                'SELECT COUNT(DISTINCT level_id) as completed FROM game_results WHERE student_id = ? AND game_type = ? AND is_passed = 1',
                [student_id, game_type]
            );
            
            if (levels[0].total > 0 && completed[0].completed >= levels[0].total) {
                const awarded = await awardAchievement(
                    student_id,
                    game_type,
                    'level_master',
                    'Bậc Thầy! 🏆',
                    `Bé đã hoàn thành tất cả level của ${game_type}!`
                );
                if (awarded) newAchievements.push({ type: 'level_master', title: 'Bậc Thầy! 🏆' });
            }
        }
        
        // 4. Check star_collector (thu thập 50 sao)
        const [totalStars] = await pool.execute(
            'SELECT SUM(stars) as total FROM game_results WHERE student_id = ?',
            [student_id]
        );
        if (totalStars[0].total >= 50) {
            const awarded = await awardAchievement(
                student_id,
                null,
                'star_collector',
                'Thu Thập Sao! ⭐',
                'Bé đã thu thập được 50 sao!'
            );
            if (awarded) newAchievements.push({ type: 'star_collector', title: 'Thu Thập Sao! ⭐' });
        }
        
        // Return achievements để gameController có thể include vào response
        return { success: true, new_achievements: newAchievements };
    } catch (error) {
        console.error("Lỗi check achievements:", error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Lấy danh sách achievements của học sinh
exports.getAchievements = async (req, res) => {
    try {
        const student_id = req.user.id;
        
        const [achievements] = await pool.execute(
            'SELECT * FROM game_achievements WHERE student_id = ? ORDER BY earned_at DESC',
            [student_id]
        );
        
        // Thống kê
        const stats = {
            total: achievements.length,
            by_type: {}
        };
        
        achievements.forEach(ach => {
            stats.by_type[ach.achievement_type] = (stats.by_type[ach.achievement_type] || 0) + 1;
        });
        
        res.json({ success: true, achievements, stats });
    } catch (error) {
        console.error("Lỗi lấy achievements:", error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Check streak achievements (gọi từ streak controller)
exports.checkStreakAchievements = async (student_id, streak) => {
    try {
        if (streak === 5) {
            await awardAchievement(
                student_id,
                null,
                'streak_5',
                'Chuỗi 5 Ngày! 🔥',
                'Bé đã học liên tiếp 5 ngày!'
            );
        }
        if (streak === 10) {
            await awardAchievement(
                student_id,
                null,
                'streak_10',
                'Chuỗi 10 Ngày! 🔥🔥',
                'Bé đã học liên tiếp 10 ngày!'
            );
        }
    } catch (error) {
        console.error("Lỗi check streak achievements:", error);
    }
};

