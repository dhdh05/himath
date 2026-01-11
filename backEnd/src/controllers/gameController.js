const pool = require('../config/db');

// Lay danh sach Level
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
        console.error("Loi lay level:", error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Luu ket qua choi
exports.submitScore = async (req, res) => {
    try {
        const student_id = req.user.id;
        const { level_id, game_type, score, stars, is_passed, time_spent } = req.body;
        let dbType = game_type === 'dino' ? 'dino-math' : game_type;

        console.log(`📝 Submit: User ${student_id} | Game ${dbType} | Score ${score}`);

        // Xu ly level_id:
        // Neu game_type la 'learning', level_id nen la NULL (hoac 0 neu DB bat buoc nhung khong co FK)
        // Check if level_id is provided, otherwise default to NULL if allowed, or handling FK issues
        // Check if level_id is provided. Default to NULL to avoid FK error on 0.
        // For 'learning', level_id is often irrelevant so NULL is safer.
        let finalLevelId = (level_id && level_id != 0 && level_id != '0') ? level_id : null;
        console.log(finalLevelId);

        // Co gang Insert (try to insert with NULL first)
        // Neu DB khong cho phep NULL, no se loi. Nhung thuong level_id nen la nullable.
        try {
            await pool.execute(
                `INSERT INTO game_results (student_id, level_id, game_type, score, stars, is_passed, time_spent, completed_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
                [student_id, finalLevelId, dbType, score, stars, is_passed ? 1 : 0, time_spent || 0]
            );
        } catch (err) {
            // Fallback: Neu loi (co the do level_id khong duoc NULL), thu set ve 1 (hoac tim level min)
            // Hoac log loi de debug
            console.warn("⚠️ Insert game_result failed with level_id=NULL. Retrying/Logging:", err.message);
            // Neu loi FK, ta khong the lam gi nhieu ngoai viec dam bao DB co data chuan.
            // Tam thoi throw tiep de catch o ngoai handle
            throw err;
        }

        // 🚀 TOI UU: Cap nhat tien do tong hop vao bang student_game_progress
        if (is_passed) {
            // Logic: Neu level nay cao hon level da luu thi update, cong don sao, v.v.
            // Tuy nhien level_id o day dang la ID trong DB, con logic game thuong dung level_number.
            // Ta se don gian hoa: Luon cap nhat/tao moi dong progress cho loai game nay.

            // 1. Tim level_number tuong ung voi level_id (neu co)
            let currentLevelNum = 1;
            if (finalLevelId > 0) {
                try {
                    const [lvlRows] = await pool.execute('SELECT level_number FROM game_levels WHERE level_id = ?', [finalLevelId]);
                    if (lvlRows.length > 0) currentLevelNum = lvlRows[0].level_number;
                } catch (e) { /* Ignore */ }
            }

            // 2. Upsert vao student_game_progress
            // Cap nhat:
            // - highest_level_passed: Lay MAX cua muc cu va muc moi
            // - total_stars: Cong them sao vua dat duoc
            // - total_attempts: Cong them 1
            // - last_played_at: Cap nhat thoi gian
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

            // Luu y: current_level co the hieu la "level tiep theo phai choi".
            // O day ta tam de bang currentLevelNum + 1 (mo khoa man sau)
            await pool.execute(sqlUpsert, [
                student_id, dbType, currentLevelNum + 1, currentLevelNum, stars, // Values cho Insert
                currentLevelNum, stars // Values cho Update
            ]);
        } else {
            // Neu khong qua man, van cap nhat so lan choi va thoi gian
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

        // Tu dong check achievements va rewards (khong block response neu co loi)
        let newAchievements = [];
        let newRewards = [];

        try {
            const achievementController = require('./achievementController');
            // Tao mot mock req object voi body data
            const mockReq = {
                user: req.user,
                body: { game_type: dbType, score, level_id: finalLevelId, stars }
            };
            const achResult = await achievementController.checkAchievements(mockReq);
            if (achResult && achResult.new_achievements) {
                newAchievements = achResult.new_achievements;
            }
        } catch (achError) {
            console.error("Loi check achievements (khong anh huong):", achError);
        }

        try {
            const rewardController = require('./rewardController');
            const rewardResult = await rewardController.checkRewards(req);
            if (rewardResult && rewardResult.new_rewards) {
                newRewards = rewardResult.new_rewards;
            }
        } catch (rewardError) {
            console.error("Loi check rewards (khong anh huong):", rewardError);
        }

        res.json({
            success: true,
            message: 'Lưu thành công',
            new_achievements: newAchievements,
            new_rewards: newRewards
        });
    } catch (error) {
        console.error("Loi luu diem:", error);
        res.status(500).json({ success: false, message: 'Lỗi lưu điểm' });
    }
};

// Lay danh sach cau hoi (custom for specific games like keo-co)
exports.getQuestions = async (req, res) => {
    try {
        const { gameType } = req.params;

        // Auto-migrate function internal
        const ensureTableAndData = async () => {
            try {
                // Test query
                await pool.execute('SELECT 1 FROM game_questions LIMIT 1');
            } catch (err) {
                if (err.code === 'ER_NO_SUCH_TABLE') {
                    console.log("⚠️ Table game_questions missing. Creating...");
                    await pool.execute(`
                        CREATE TABLE game_questions (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            game_type VARCHAR(50) NOT NULL,
                            question_text TEXT NOT NULL,
                            answers LONGTEXT NOT NULL COMMENT 'JSON array',
                            correct_index INT NOT NULL,
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                        )
                    `);

                } else {
                    throw err;
                }
            }

            // Data is now managed via SQL script (database/update_keo_co.sql)
        };

        await ensureTableAndData();

        const [rows] = await pool.execute(
            'SELECT * FROM game_questions WHERE game_type = ? ORDER BY RAND() LIMIT 20',
            [gameType]
        );

        const questions = rows.map(q => {
            let parsedAnswers = [];
            try {
                parsedAnswers = typeof q.answers === 'string' ? JSON.parse(q.answers) : q.answers;
            } catch (e) { parsedAnswers = []; }
            return {
                q: q.question_text,
                a: parsedAnswers,
                c: q.correct_index
            };
        });

        // If empty (maybe other game type), return empty
        res.json({ success: true, data: questions });

    } catch (error) {
        console.error("Loi lay cau hoi:", error);
        res.status(500).json({ success: false, message: 'Lỗi lấy câu hỏi' });
    }
};