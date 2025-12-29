const pool = require('../config/db');

// Lấy danh sách Level
exports.getLevels = async (req, res) => {
    try {
        const { gameType } = req.params;
        let dbType = gameType === 'dino' ? 'dino-math' : gameType;

        const [rows] = await pool.execute(
            'SELECT * FROM game_levels WHERE game_type = ? ORDER BY level_number ASC',
            [dbType]
        );
        //parse config
        const levels = rows.map(level => {
            if (level.config && typeof level.config === 'string') {
                try {
                    let parsed = JSON.parse(level.config);
                    if (typeof parsed === 'string') parsed = JSON.parse(parsed);
                    level.config = parsed;
                } catch (e) { level.config = {}; }
            }
            return level;
        });

        res.json({ success: true, data: levels });
    } catch (error) {
        console.error("Lỗi lấy level:", error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Lưu kết quả chơi
exports.submitScore = async (req, res) => {
    try {
        const student_id = req.user.id;
        const { level_id, game_type, score, stars, is_passed, time_spent } = req.body;
        let dbType = game_type === 'dino' ? 'dino-math' : game_type;

        console.log(`📝 Submit: User ${student_id} | Game ${dbType} | Score ${score}`);

        // Xử lý level_id:
        // Nếu game_type là 'learning', level_id nên là NULL (hoặc 0 nếu DB bắt buộc nhưng không có FK)
        // Check if level_id is provided, otherwise default to NULL if allowed, or handling FK issues
        // Check if level_id is provided. Default to NULL to avoid FK error on 0.
        // For 'learning', level_id is often irrelevant so NULL is safer.
        let finalLevelId = (level_id && level_id != 0 && level_id != '0') ? level_id : null;
        
        // Cố gắng Insert (try to insert with NULL first)
        // Nếu DB không cho phép NULL, nó sẽ lỗi. Nhưng thường level_id nên là nullable.
        try {
             await pool.execute(
                `INSERT INTO game_results (student_id, level_id, game_type, score, stars, is_passed, time_spent, completed_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
                [student_id, finalLevelId, dbType, score, stars, is_passed ? 1 : 0, time_spent || 0]
            );
        } catch (err) {
            // Fallback: Nếu lỗi (có thể do level_id không được NULL), thử set về 1 (hoặc tìm level min)
            // Hoặc log lỗi để debug
            console.warn("⚠️ Insert game_result failed with level_id=NULL. Retrying/Logging:", err.message);
            // Nếu lỗi FK, ta không thể làm gì nhiều ngoài việc đảm bảo DB có data chuẩn.
            // Tạm thời throw tiếp để catch ở ngoài handle
            throw err;
        }

        // 🚀 TỐI ƯU: Cập nhật tiến độ tổng hợp vào bảng student_game_progress
        if (is_passed) {
             // Logic: Nếu level này cao hơn level đã lưu thì update, cộng dồn sao, v.v.
             // Tuy nhiên level_id ở đây đang là ID trong DB, còn logic game thường dùng level_number.
             // Ta sẽ đơn giản hóa: Luôn cập nhật/tạo mới dòng progress cho loại game này.
             
             // 1. Tìm level_number tương ứng với level_id (nếu có)
             let currentLevelNum = 1;
             if (finalLevelId > 0) {
                 try {
                     const [lvlRows] = await pool.execute('SELECT level_number FROM game_levels WHERE level_id = ?', [finalLevelId]);
                     if (lvlRows.length > 0) currentLevelNum = lvlRows[0].level_number;
                 } catch (e) { /* Ignore */ }
             }

             // 2. Upsert vào student_game_progress
             // Cập nhật:
             // - highest_level_passed: Lấy MAX của mức cũ và mức mới
             // - total_stars: Cộng thêm sao vừa đạt được
             // - total_attempts: Cộng thêm 1
             // - last_played_at: Cập nhật thời gian
             const sqlUpsert = `
                INSERT INTO student_game_progress 
                    (student_id, game_type, current_level, highest_level_passed, total_stars, total_attempts, last_played_at, last_updated_at)
                VALUES 
                    (?, ?, ?, ?, ?, 1, NOW(), NOW())
                ON DUPLICATE KEY UPDATE 
                    highest_level_passed = GREATEST(highest_level_passed, ?),
                    total_stars = total_stars + ?,
                    total_attempts = total_attempts + 1,
                    last_played_at = NOW(),
                    last_updated_at = NOW();
             `;
             
             // Lưu ý: current_level có thể hiểu là "level tiếp theo phải chơi".
             // Ở đây ta tạm để bằng currentLevelNum + 1 (mở khóa màn sau)
             await pool.execute(sqlUpsert, [
                 student_id, dbType, currentLevelNum + 1, currentLevelNum, stars, // Values cho Insert
                 currentLevelNum, stars // Values cho Update
             ]);
        } else {
             // Nếu không qua màn, vẫn cập nhật số lần chơi và thời gian
             const sqlUpdateFail = `
                INSERT INTO student_game_progress 
                    (student_id, game_type, current_level, highest_level_passed, total_stars, total_attempts, last_played_at, last_updated_at)
                VALUES 
                    (?, ?, 1, 0, 0, 1, NOW(), NOW())
                ON DUPLICATE KEY UPDATE 
                    total_attempts = total_attempts + 1,
                    last_played_at = NOW(),
                    last_updated_at = NOW();
             `;
             await pool.execute(sqlUpdateFail, [student_id, dbType]);
        }

        // Tự động check achievements và rewards (không block response nếu có lỗi)
        let newAchievements = [];
        let newRewards = [];
        
        try {
            const achievementController = require('./achievementController');
            // Tạo một mock req object với body data
            const mockReq = {
                user: req.user,
                body: { game_type: dbType, score, level_id: finalLevelId, stars }
            };
            const achResult = await achievementController.checkAchievements(mockReq);
            if (achResult && achResult.new_achievements) {
                newAchievements = achResult.new_achievements;
            }
        } catch (achError) {
            console.error("Lỗi check achievements (không ảnh hưởng):", achError);
        }
        
        try {
            const rewardController = require('./rewardController');
            const rewardResult = await rewardController.checkRewards(req);
            if (rewardResult && rewardResult.new_rewards) {
                newRewards = rewardResult.new_rewards;
            }
        } catch (rewardError) {
            console.error("Lỗi check rewards (không ảnh hưởng):", rewardError);
        }

        res.json({ 
            success: true, 
            message: 'Lưu thành công',
            new_achievements: newAchievements,
            new_rewards: newRewards
        });
    } catch (error) {
        console.error("Lỗi lưu điểm:", error);
        res.status(500).json({ success: false, message: 'Lỗi lưu điểm' });
    }
};





// const db = require('../config/db');

// // API 1: Lấy danh sách Level theo loại game (ví dụ: 'hoc-so')
// exports.getLevelsByGameType = async (req, res) => {
//     try {
//         const { gameType } = req.params; // Lấy từ URL
//         const [rows] = await db.execute(
//             'SELECT * FROM game_levels WHERE game_type = ? ORDER BY level_number ASC',
//             [gameType]
//         );
        
//         // Parse JSON config để Frontend dùng được luôn
//         const levels = rows.map(level => ({
//             ...level,
//             config: typeof level.config === 'string' ? JSON.parse(level.config) : level.config
//         }));

//         res.json({ success: true, data: levels });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Lỗi server' });
//     }
// };

// // API 2: Nộp bài và lưu kết quả
// exports.submitGameResult = async (req, res) => {
//     try {
//         const { student_id, level_id, game_type, score, stars, time_spent, is_passed, answers } = req.body;

//         // 1. Lưu vào bảng lịch sử chi tiết (game_results)
//         await db.execute(
//             `INSERT INTO game_results 
//             (student_id, level_id, game_type, score, stars, time_spent, is_passed, answers) 
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//             [student_id, level_id, game_type, score, stars, time_spent, is_passed, JSON.stringify(answers)]
//         );

//         // 2. Cập nhật tiến độ tổng (student_game_progress)
//         // Logic: Nếu chưa có thì tạo mới, nếu có rồi thì update level cao nhất và cộng dồn sao
//         if (is_passed) {
//             // Lấy level number hiện tại
//             const [levelInfo] = await db.execute('SELECT level_number FROM game_levels WHERE level_id = ?', [level_id]);
//             const currentLevelNum = levelInfo[0].level_number;

//             // Upsert (Insert nếu chưa có, Update nếu đã có)
//             const sqlUpdateProgress = `
//                 INSERT INTO student_game_progress (student_id, game_type, current_level, highest_level_passed, total_stars, last_played_at)
//                 VALUES (?, ?, ?, ?, ?, NOW())
//                 ON DUPLICATE KEY UPDATE 
//                     highest_level_passed = GREATEST(highest_level_passed, ?),
//                     total_stars = total_stars + ?,
//                     last_played_at = NOW();
//             `;
//             await db.execute(sqlUpdateProgress, [student_id, game_type, currentLevelNum + 1, currentLevelNum, stars, currentLevelNum, stars]);
//         }

//         res.json({ success: true, message: 'Lưu kết quả thành công!' });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Lỗi lưu kết quả' });
//     }
// };