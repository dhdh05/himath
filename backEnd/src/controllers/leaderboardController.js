const pool = require('../config/db');

// Bảng xếp hạng theo điểm số
exports.getLeaderboardByScore = async (req, res) => {
    try {
        const { limit = 100 } = req.query;
        
        const [rankings] = await pool.execute(
            `SELECT 
                s.user_id,
                u.full_name,
                u.avatar_url,
                u.username,
                COALESCE(SUM(gr.score), 0) as total_score,
                COALESCE(SUM(gr.stars), 0) as total_stars,
                COUNT(DISTINCT gr.game_type) as games_played,
                COUNT(gr.result_id) as total_games
             FROM students s
             JOIN users u ON s.user_id = u.user_id
             LEFT JOIN game_results gr ON s.user_id = gr.student_id
             GROUP BY s.user_id, u.full_name, u.avatar_url, u.username
             ORDER BY total_score DESC, total_stars DESC
             LIMIT ?`,
            [parseInt(limit)]
        );
        
        // Thêm rank
        const rankingsWithRank = rankings.map((item, index) => ({
            ...item,
            rank: index + 1
        }));
        
        res.json({ success: true, rankings: rankingsWithRank });
    } catch (error) {
        console.error("Lỗi lấy leaderboard by score:", error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Bảng xếp hạng theo thời gian học
exports.getLeaderboardByTime = async (req, res) => {
    try {
        const { limit = 100 } = req.query;
        
        const [rankings] = await pool.execute(
            `SELECT 
                s.user_id,
                u.full_name,
                u.avatar_url,
                u.username,
                COALESCE(SUM(ss.duration), 0) as total_time,
                COUNT(DISTINCT DATE(ss.start_time)) as study_days,
                COUNT(DISTINCT ss.page_name) as games_played
             FROM students s
             JOIN users u ON s.user_id = u.user_id
             LEFT JOIN study_sessions ss ON s.user_id = ss.user_id
             WHERE ss.page_name IS NULL OR (ss.page_name != 'home' AND ss.page_name != 'users')
             GROUP BY s.user_id, u.full_name, u.avatar_url, u.username
             ORDER BY total_time DESC
             LIMIT ?`,
            [parseInt(limit)]
        );
        
        // Thêm rank và format time
        const rankingsWithRank = rankings.map((item, index) => ({
            ...item,
            rank: index + 1,
            total_time_formatted: formatTime(item.total_time)
        }));
        
        res.json({ success: true, rankings: rankingsWithRank });
    } catch (error) {
        console.error("Lỗi lấy leaderboard by time:", error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Bảng xếp hạng theo sao
exports.getLeaderboardByStars = async (req, res) => {
    try {
        const { limit = 100 } = req.query;
        
        const [rankings] = await pool.execute(
            `SELECT 
                s.user_id,
                u.full_name,
                u.avatar_url,
                u.username,
                COALESCE(SUM(gr.stars), 0) as total_stars,
                COUNT(gr.result_id) as total_games,
                AVG(gr.score) as avg_score
             FROM students s
             JOIN users u ON s.user_id = u.user_id
             LEFT JOIN game_results gr ON s.user_id = gr.student_id
             GROUP BY s.user_id, u.full_name, u.avatar_url, u.username
             ORDER BY total_stars DESC, avg_score DESC
             LIMIT ?`,
            [parseInt(limit)]
        );
        
        // Thêm rank
        const rankingsWithRank = rankings.map((item, index) => ({
            ...item,
            rank: index + 1,
            avg_score: item.avg_score ? Math.round(item.avg_score * 10) / 10 : 0
        }));
        
        res.json({ success: true, rankings: rankingsWithRank });
    } catch (error) {
        console.error("Lỗi lấy leaderboard by stars:", error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Bảng xếp hạng tổng hợp (tất cả thông tin)
exports.getLeaderboardAll = async (req, res) => {
    try {
        const { limit = 100 } = req.query;
        
        // Lấy tất cả students
        const [students] = await pool.execute(
            `SELECT DISTINCT s.user_id, u.full_name, u.avatar_url, u.username
             FROM students s
             JOIN users u ON s.user_id = u.user_id`
        );
        
        // Lấy điểm số và sao từ game_results
        const [scoreData] = await pool.execute(
            `SELECT 
                student_id,
                COALESCE(SUM(score), 0) as total_score,
                COALESCE(SUM(stars), 0) as total_stars,
                COUNT(DISTINCT game_type) as games_played
             FROM game_results
             GROUP BY student_id`
        );
        
        // Lấy thời gian học từ study_sessions
        const [timeData] = await pool.execute(
            `SELECT 
                user_id,
                COALESCE(SUM(duration), 0) as total_time
             FROM study_sessions
             WHERE page_name IS NULL OR (page_name != 'home' AND page_name != 'users')
             GROUP BY user_id`
        );
        
        // Merge dữ liệu
        const scoreMap = {};
        scoreData.forEach(item => {
            scoreMap[item.student_id] = {
                total_score: item.total_score,
                total_stars: item.total_stars,
                games_played: item.games_played
            };
        });
        
        const timeMap = {};
        timeData.forEach(item => {
            timeMap[item.user_id] = {
                total_time: item.total_time
            };
        });
        
        // Tạo leaderboard với tất cả thông tin
        const leaderboard = students.map(student => {
            const scoreInfo = scoreMap[student.user_id] || { total_score: 0, total_stars: 0, games_played: 0 };
            const timeInfo = timeMap[student.user_id] || { total_time: 0 };
            
            return {
                user_id: student.user_id,
                full_name: student.full_name,
                username: student.username,
                avatar_url: student.avatar_url,
                total_score: scoreInfo.total_score,
                total_stars: scoreInfo.total_stars,
                games_played: scoreInfo.games_played,
                total_time: timeInfo.total_time,
                total_time_formatted: formatTime(timeInfo.total_time)
            };
        });
        
        // Sắp xếp theo điểm số
        leaderboard.sort((a, b) => {
            if (b.total_score !== a.total_score) {
                return b.total_score - a.total_score;
            }
            if (b.total_stars !== a.total_stars) {
                return b.total_stars - a.total_stars;
            }
            return b.total_time - a.total_time;
        });
        
        // Giới hạn số lượng
        const limitedLeaderboard = leaderboard.slice(0, parseInt(limit));
        
        // Thêm rank
        const rankingsWithRank = limitedLeaderboard.map((item, index) => ({
            ...item,
            rank: index + 1
        }));
        
        res.json({ success: true, rankings: rankingsWithRank });
    } catch (error) {
        console.error("Lỗi lấy leaderboard all:", error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Helper function
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
}

