const pool = require('../config/db');

exports.verifyPin = async (req, res) => {
    const { pin } = req.body;

    // ⚠️ SỬA LỖI 1: Trong token (lúc login) bạn lưu key là 'id', không phải 'student_id'
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

            // Ép kiểu về string để so sánh an toàn
            if (String(pin).trim() === String(correctPin).trim()) {
                res.json({ success: true });
            } else {
                res.status(401).json({ success: false, message: 'Mã PIN không đúng!' });
            }
        } else {
            res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản' });
        }
    } catch (err) {
        console.error("Lỗi Verify PIN:", err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

exports.getStats = async (req, res) => {
    const { student_id } = req.params;

    console.log('📊 GetStats called for student_id:', student_id);

    try {
        // BƯỚC 1: Query từ game_results (code cũ - đúng cho hocsinh)
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

        // BƯỚC 2: Query từ study_sessions (cho các tài khoản khác)
        // Sửa: bỏ điều kiện duration > 0 vì có thể có records với duration = 0 nhưng vẫn hợp lệ
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
                    WHEN page_name = 'games' THEN 'hung-tao' -- Xử lý dữ liệu cũ
                    ELSE REPLACE(REPLACE(REPLACE(REPLACE(page_name, 'digits-', ''), 'practice-', ''), 'games-', ''), 'compare-', '')
                END as game_type,
                SUM(COALESCE(duration, 0)) as total_time,
                COUNT(*) as play_count
            FROM study_sessions 
            WHERE user_id = ? AND page_name != 'home' AND page_name != 'users'
            GROUP BY play_date, game_type`;

        const [sessionsRows] = await pool.execute(sessionsSql, [student_id]);
        console.log('📊 study_sessions rows:', sessionsRows.length, sessionsRows);

        // BƯỚC 3: Merge dữ liệu - ưu tiên game_results, bổ sung từ study_sessions
        const dataMap = {};

        // Thêm dữ liệu từ game_results (ưu tiên - cho hocsinh)
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

        // Bổ sung từ study_sessions (cho các tài khoản khác)
        sessionsRows.forEach(row => {
            const key = `${row.play_date}_${row.game_type}`;
            if (row.play_date && row.game_type) {
                if (!dataMap[key]) {
                    // Chỉ thêm nếu chưa có trong game_results
                    dataMap[key] = {
                        play_date: String(row.play_date).trim(),
                        game_type: String(row.game_type).trim(),
                        total_time: parseInt(row.total_time) || 0,
                        total_score: 0, // study_sessions không có điểm
                        play_count: parseInt(row.play_count) || 0
                    };
                } else {
                    // Nếu đã có từ game_results, giữ nguyên điểm số nhưng có thể cập nhật thời gian
                    const existingTime = dataMap[key].total_time;
                    const sessionTime = parseInt(row.total_time) || 0;
                    // Nếu thời gian từ study_sessions lớn hơn, cập nhật (nhưng giữ nguyên điểm từ game_results)
                    if (sessionTime > existingTime) {
                        dataMap[key].total_time = sessionTime;
                    }
                }
            }
        });

        // Chuyển map thành array và sắp xếp
        const mergedData = Object.values(dataMap)
            .filter(item => item.play_date && item.game_type) // Lọc bỏ các item không hợp lệ
            .sort((a, b) => {
                // Sắp xếp theo ngày giảm dần
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
        console.error("Lỗi Get Stats:", err);
        res.status(500).json({ success: false, message: 'Lỗi lấy thống kê' });
    }
};

// API mới: Lấy tổng thời gian truy cập website trong ngày hôm nay
exports.getTodayTotalTime = async (req, res) => {
    const student_id = req.user.id; // Lấy từ token

    try {
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const todayEnd = new Date(todayStart);
        todayEnd.setDate(todayEnd.getDate() + 1);

        const todayStartStr = todayStart.toISOString().slice(0, 19).replace('T', ' ');
        const todayEndStr = todayEnd.toISOString().slice(0, 19).replace('T', ' ');

        // Query tổng duration từ tất cả study_sessions trong ngày hôm nay
        // Loại trừ 'home' và 'users' nhưng bao gồm tất cả các page khác
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
        console.error("Lỗi Get Today Total Time:", err);
        res.status(500).json({ success: false, message: 'Lỗi lấy thời gian' });
    }
};