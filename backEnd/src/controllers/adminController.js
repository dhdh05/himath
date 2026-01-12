const pool = require('../config/db');
const emailService = require('../services/emailService');

// --- THONG KE DASHBOARD ---
exports.getDashboardStats = async (req, res) => {
    try {
        const [userCount] = await pool.execute("SELECT COUNT(*) as total FROM users WHERE role != 'admin'");

        let gameCountVal = 0;
        try {
            const [gameCount] = await pool.execute('SELECT COUNT(*) as total FROM game_results');
            gameCountVal = gameCount[0].total;
        } catch (e) { }

        const [activeToday] = await pool.query(`
            SELECT COUNT(DISTINCT user_id) as total 
            FROM login_logs 
            WHERE DATE(login_time) = CURDATE()
        `);

        res.json({
            success: true,
            stats: {
                totalUsers: userCount[0].total,
                totalGamesPlayed: gameCountVal,
                activeUsersToday: activeToday[0].total || 0
            }
        });
    } catch (err) {
        console.error("Admin Stats Error:", err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// --- LAY DANH SACH USER ---
exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT user_id, username, full_name, email, role, created_at, is_blocked, parent_pin FROM users ORDER BY created_at DESC'
        );
        res.json({
            success: true,
            users: rows
        });
    } catch (err) {
        console.error("Admin Get Users Error:", err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// --- KHOA / MO USER ---
exports.toggleBlockUser = async (req, res) => {
    const { id } = req.params;
    const { is_blocked } = req.body;

    try {
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ success: false, message: 'Không thể tự khóa tài khoản của mình' });
        }

        await pool.execute('UPDATE users SET is_blocked = ? WHERE user_id = ?', [is_blocked, id]);

        res.json({
            success: true,
            message: `Đã ${is_blocked ? 'khóa' : 'mở khóa'} tài khoản thành công.`
        });
    } catch (err) {
        console.error("Admin Block User Error:", err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// --- LICH SU DANG NHAP ---
exports.getLoginLogs = async (req, res) => {
    try {
        const [logs] = await pool.query("SELECT * FROM login_logs ORDER BY login_time DESC LIMIT 100");
        res.json({ success: true, logs });
    } catch (err) {
        console.error("Get Logs Error:", err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// --- XEM CHI TIET USER ---
exports.getUserDetails = async (req, res) => {
    try {
        const userId = req.params.id;

        // 1. Info
        const [users] = await pool.query(
            "SELECT user_id, username, full_name, email, role, created_at, is_blocked, dob, parent_pin FROM users WHERE user_id = ?",
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const user = users[0];

        // 2. Stats & Stars (FROM game_results)
        let stats = { total_plays: 0, total_score: 0, high_score: 0, total_stars: 0 };

        try {
            // Stats basics
            const [gameStats] = await pool.query(`
                SELECT 
                    COUNT(*) as total_plays,
                    SUM(score) as total_score,
                    MAX(score) as high_score
                FROM game_results 
                WHERE student_id = ?
            `, [userId]);

            // Stars
            try {
                const [starStats] = await pool.query(`
                      SELECT SUM(stars) as total_stars FROM game_results WHERE student_id = ?
                 `, [userId]);
                if (starStats[0]) {
                    stats.total_stars = starStats[0].total_stars || 0;
                }
            } catch (starErr) { }

            if (gameStats[0]) {
                stats.total_plays = gameStats[0].total_plays || 0;
                stats.total_score = gameStats[0].total_score || 0;
                stats.high_score = gameStats[0].high_score || 0;
            }

        } catch (e) {
            console.log("Stats query error (Using game_results):", e.message);
        }

        // 3. Recent Activity (FROM game_results)
        let recentActivity = [];
        try {
            const [activity] = await pool.query(`
                SELECT 
                    game_type as game_name, 
                    score, 
                    stars,
                    completed_at as played_at 
                FROM game_results
                WHERE student_id = ?
                ORDER BY completed_at DESC
                LIMIT 20
            `, [userId]);
            recentActivity = activity;
        } catch (e) { console.log("Activity query error:", e.message); }

        res.json({
            success: true,
            user: user,
            stats: stats,
            recent_activity: recentActivity
        });

    } catch (err) {
        console.error("Get User Details Error:", err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// --- GUI BAO CAO HOC TAP (REFACOR: USE SERVICE) ---
exports.sendMonthlyReport = async (req, res) => {
    try {
        const userId = req.params.id;

        // 1. Lay thong tin user
        const [users] = await pool.query("SELECT * FROM users WHERE user_id = ?", [userId]);
        if (users.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
        const user = users[0];

        if (!user.email) return res.status(400).json({ success: false, message: 'User chưa có email để gửi.' });

        // 2. Lay du lieu hoc tap (thang hien tai)
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        // 2.1 Tong quan
        const [games] = await pool.query(`
            SELECT COUNT(*) as total_count, SUM(score) as total_score, SUM(stars) as total_stars 
            FROM game_results 
            WHERE student_id = ? AND MONTH(completed_at) = ? AND YEAR(completed_at) = ?
        `, [userId, currentMonth, currentYear]);

        const stats = games[0] || { total_count: 0, total_score: 0, total_stars: 0 };

        // 2.2 Top Games
        const [topGames] = await pool.query(`
             SELECT game_type, COUNT(*) as play_count, MAX(score) as high_score
             FROM game_results
             WHERE student_id = ?
             GROUP BY game_type
             ORDER BY play_count DESC
             LIMIT 3
        `, [userId]);

        // 3. Noi dung Email
        const subject = `[Hi Math] Báo cáo học tập tháng ${currentMonth}/${currentYear} - Bé ${user.full_name || user.username}`;
        const htmlContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                   <div style="background: linear-gradient(135deg, #4a6bff, #2f80ed); padding: 25px; text-align: center; color: white;">
                      <h1 style="margin: 0; font-size: 26px;">📊 Báo Cáo Học Tập Tháng ${currentMonth}</h1>
                      <p style="margin: 5px 0 0; opacity: 0.9;">Hệ thống học toán Hi Math</p>
                   </div>
                   
                   <div style="padding: 25px;">
                      <p style="font-size: 16px;">Xin chào phụ huynh bé <b style="color:#2c3e50;">${user.full_name || user.username}</b>,</p>
                      <p style="line-height: 1.5; color: #555;">Hi Math xin gửi tới gia đình bản tổng hợp kết quả học tập của bé trong tháng vừa qua. Bé đã có những nỗ lực rất đáng khen ngợi!</p>
                      
                      <div style="display: flex; gap: 15px; margin: 30px 0;">
                          <div style="flex: 1; background: #f8f9fc; padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #eef1f6;">
                              <div style="font-size: 32px; font-weight: 800; color: #4a6bff; margin-bottom:5px;">${stats.total_count}</div>
                              <div style="font-size: 13px; color: #666; font-weight:600;">Lần Chơi Game</div>
                          </div>
                          <div style="flex: 1; background: #fffcf0; padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #fef3c7;">
                              <div style="font-size: 32px; font-weight: 800; color: #f59e0b;">${stats.total_stars || 0} ★</div>
                              <div style="font-size: 13px; color: #666; font-weight:600;">Sao Tích Lũy</div>
                          </div>
                      </div>

                      <h3 style="border-bottom: 2px solid #f1f2f6; padding-bottom: 10px; color: #2c3e50; margin-top:0;">🏆 Top Trò Chơi Yêu Thích</h3>
                      <ul style="padding-left: 0; list-style: none;">
                          ${topGames.length > 0 ? topGames.map((g, index) => `
                            <li style="background: #fff; border-bottom: 1px solid #eee; padding: 12px 0; display: flex; align-items: center; justify-content: space-between;">
                                <span><span style="display:inline-block; width:24px; height:24px; background:#4a6bff; color:white; border-radius:50%; text-align:center; line-height:24px; margin-right:10px; font-size:12px;">${index + 1}</span> <b>${g.game_type}</b></span>
                                <span style="color:#666; font-size:14px;">Chơi ${g.play_count} lần (Max: ${g.high_score})</span>
                            </li>
                          `).join('') : '<li style="color:#999; padding:10px 0;">Chưa có dữ liệu trò chơi tháng này</li>'}
                      </ul>

                      <div style="background: #d1fae5; color: #065f46; padding: 20px; border-radius: 12px; margin-top: 30px; font-style: italic; border: 1px solid #a7f3d0;">
                          💡 <b>Góc tư vấn:</b> "Hãy khuyến khích bé duy trì thói quen học tập 15 phút mỗi ngày. Các bài toán so sánh và ghi nhớ sẽ giúp bé phát triển tư duy logic rất tốt trong giai đoạn này!"
                      </div>
                      
                      <div style="text-align: center; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
                          <p style="font-size: 12px; color: #999; margin:0;">
                              Email này được gửi tự động từ hệ thống Hi Math.<br>
                              © 2026 Hi Math Education.
                          </p>
                      </div>
                   </div>
                </div>
            `;

        // 4. Gui Email qua Service
        await emailService.sendEmail(user.email, subject, htmlContent);

        res.json({ success: true, message: 'Đã gửi báo cáo thành công tới ' + user.email });

    } catch (err) {
        console.error("Send Report Error:", err);
        res.status(500).json({ success: false, message: 'Lỗi gửi mail: ' + err.message });
    }
};
