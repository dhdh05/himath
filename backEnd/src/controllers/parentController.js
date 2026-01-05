const pool = require('../config/db');

exports.verifyPin = async (req, res) => {
    const { pin } = req.body;

    // ⚠️ SUA LOI 1: Trong token (luc login) ban luu key la 'id', khong phai 'student_id'
    const student_id = req.user.id;

    try {
        const [rows] = await pool.execute('SELECT parent_pin FROM users WHERE user_id = ?', [student_id]);

        // --- DEBUG LOG START ---
        console.log(`🔍 [Verify PIN] StudentID: ${student_id}`);
        console.log(`   - Input PIN: "${pin}"`);
        if (rows.length > 0) {
            console.log(`   - DB PIN:    "${rows[0].parent_pin}"`);
        } else {
            console.log(`   - DB Result: User not found`);
        }
        // --- DEBUG LOG END ---

        if (rows.length > 0) {
            const correctPin = rows[0].parent_pin || '1234';

            // Ep kieu ve string de so sanh an toan
            if (String(pin).trim() === String(correctPin).trim()) {
                res.json({ success: true });
            } else {
                res.status(401).json({ success: false, message: 'Mã PIN không đúng!' });
            }
        } else {
            res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản' });
        }
    } catch (err) {
        console.error("Loi Verify PIN:", err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

exports.getStats = async (req, res) => {
    const { student_id } = req.params;

    console.log('📊 GetStats called for student_id:', student_id);

    try {
        // BUOC 1: Query tu game_results (code cu - dung cho hocsinh)
        const gameResultsSql = `
            SELECT 
                DATE_FORMAT(completed_at, '%d/%m/%Y') as play_date,
                game_type,
                SUM(time_spent) as total_time,
                SUM(score) as total_score,
                COUNT(*) as play_count
            FROM game_results 
            WHERE student_id = ?
            GROUP BY play_date, game_type
            ORDER BY completed_at DESC`;

        const [gameResultsRows] = await pool.execute(gameResultsSql, [student_id]);
        console.log('📊 game_results rows:', gameResultsRows.length, gameResultsRows);

        // BUOC 2: Query tu study_sessions (cho cac tai khoan khac)
        // Sua: bo dieu kien duration > 0 vi co the co records voi duration = 0 nhung van hop le
        const sessionsSql = `
            SELECT 
                DATE_FORMAT(COALESCE(end_time, start_time), '%d/%m/%Y') as play_date,
                CASE 
                    WHEN page_name = 'digits-chan-le' THEN 'chan-le'
                    WHEN page_name = 'digits-ghep-so' THEN 'ghep-so'
                    WHEN page_name = 'digits-dem-so' THEN 'dem-so'
                    WHEN page_name = 'digits-dem-hinh' THEN 'dem-so'
                    WHEN page_name = 'digits-hoc-so' THEN 'hoc-chu-so'
                    WHEN page_name = 'practice-tinh-toan' THEN 'tinh-toan'
                    WHEN page_name = 'practice-nhan-ngon' THEN 'practice-nhan-ngon'
                    WHEN page_name = 'practice-so-sanh' THEN 'so-sanh'
                    WHEN page_name = 'compare-so-sanh' THEN 'so-sanh'
                    WHEN page_name = 'compare-xep-so' THEN 'xep-so'
                    WHEN page_name = 'games-dino' THEN 'dino-math'
                    WHEN page_name = 'games-hung-tao' THEN 'hung-tao'
                    WHEN page_name = 'games' THEN 'hung-tao' -- Xu ly du lieu cu
                    ELSE REPLACE(REPLACE(REPLACE(REPLACE(page_name, 'digits-', ''), 'practice-', ''), 'games-', ''), 'compare-', '')
                END as game_type,
                SUM(COALESCE(duration, 0)) as total_time,
                COUNT(*) as play_count
            FROM study_sessions 
            WHERE user_id = ? AND page_name != 'home' AND page_name != 'users'
            GROUP BY play_date, game_type`;

        const [sessionsRows] = await pool.execute(sessionsSql, [student_id]);
        console.log('📊 study_sessions rows:', sessionsRows.length, sessionsRows);

        // BUOC 3: Merge du lieu - uu tien game_results, bo sung tu study_sessions
        const dataMap = {};

        // Them du lieu tu game_results (uu tien - cho hocsinh)
        gameResultsRows.forEach(row => {
            const key = `${row.play_date}_${row.game_type}`;
            if (row.play_date && row.game_type) {
                dataMap[key] = {
                    play_date: String(row.play_date).trim(),
                    game_type: String(row.game_type).trim(),
                    total_time: parseInt(row.total_time) || 0,
                    total_score: parseInt(row.total_score) || 0,
                    play_count: parseInt(row.play_count) || 0
                };
            }
        });

        // Bo sung tu study_sessions (cho cac tai khoan khac)
        sessionsRows.forEach(row => {
            const key = `${row.play_date}_${row.game_type}`;
            if (row.play_date && row.game_type) {
                if (!dataMap[key]) {
                    // Chi them neu chua co trong game_results
                    dataMap[key] = {
                        play_date: String(row.play_date).trim(),
                        game_type: String(row.game_type).trim(),
                        total_time: parseInt(row.total_time) || 0,
                        total_score: 0, // study_sessions khong co diem
                        play_count: parseInt(row.play_count) || 0
                    };
                } else {
                    // Neu da co tu game_results, giu nguyen diem so nhung co the cap nhat thoi gian
                    const existingTime = dataMap[key].total_time;
                    const sessionTime = parseInt(row.total_time) || 0;
                    // Neu thoi gian tu study_sessions lon hon, cap nhat (nhung giu nguyen diem tu game_results)
                    if (sessionTime > existingTime) {
                        dataMap[key].total_time = sessionTime;
                    }
                }
            }
        });

        // Chuyen map thanh array va sap xep
        const mergedData = Object.values(dataMap)
            .filter(item => item.play_date && item.game_type) // Loc bo cac item khong hop le
            .sort((a, b) => {
                // Sap xep theo ngay giam dan
                try {
                    const dateA = a.play_date.split('/').reverse().join('-');
                    const dateB = b.play_date.split('/').reverse().join('-');
                    return dateB.localeCompare(dateA);
                } catch (e) {
                    return 0;
                }
            });

        console.log('📊 Merged data:', mergedData.length, 'rows');
        if (mergedData.length > 0) {
            console.log('📊 Sample data (first 3):', JSON.stringify(mergedData.slice(0, 3), null, 2));
        } else {
            console.log('⚠️ No data found! game_results:', gameResultsRows.length, 'study_sessions:', sessionsRows.length);
        }

        res.json({ success: true, data: mergedData });
    } catch (err) {
        console.error("Loi Get Stats:", err);
        res.status(500).json({ success: false, message: 'Lỗi lấy thống kê' });
    }
};

// API moi: Lay tong thoi gian truy cap website trong ngay hom nay
exports.getTodayTotalTime = async (req, res) => {
    const student_id = req.user.id; // Lay tu token

    try {
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const todayEnd = new Date(todayStart);
        todayEnd.setDate(todayEnd.getDate() + 1);

        const todayStartStr = todayStart.toISOString().slice(0, 19).replace('T', ' ');
        const todayEndStr = todayEnd.toISOString().slice(0, 19).replace('T', ' ');

        // Query tong duration tu tat ca study_sessions trong ngay hom nay
        // Loai tru 'home' va 'users' nhung bao gom tat ca cac page khac
        const [rows] = await pool.execute(
            `SELECT SUM(COALESCE(duration, 0)) as total_seconds
             FROM study_sessions 
             WHERE user_id = ? 
               AND page_name != 'home' 
               AND page_name != 'users'
               AND start_time >= ? 
               AND start_time < ?`,
            [student_id, todayStartStr, todayEndStr]
        );

        const totalSeconds = parseInt(rows[0]?.total_seconds || 0);

        res.json({
            success: true,
            total_seconds: totalSeconds
        });
    } catch (err) {
        console.error("Loi Get Today Total Time:", err);
        res.status(500).json({ success: false, message: 'Lỗi lấy thời gian' });
    }
};