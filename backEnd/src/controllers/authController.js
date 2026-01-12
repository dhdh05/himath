const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const emailService = require('../services/emailService'); // Import email service shared
dotenv.config();

// 1. Dang nhap
exports.login = async (req, res) => {
    const { username, password } = req.body;
    console.log(`📡 Login Request: ${username}`);

    try {
        // BUOC A: Chi tim user bang username (Bo check password trong SQL)
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Tài khoản không tồn tại' });
        }

        const user = rows[0];

        // BUOC B: So sanh mat khau nhap vao (password) voi mat khau trong DB (user.password)
        // Kiem tra xem password trong DB co phai la bcrypt hash khong (bat dau bang $2a$ hoac $2b$)
        let isMatch = false;
        const isHashed = user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$'));

        console.log(`🔐 Password check - Is hashed: ${isHashed}, Input length: ${password?.length}, DB password length: ${user.password?.length}`);

        if (isHashed) {
            // Password da duoc hash bang bcrypt -> dung bcrypt.compare
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            // Password la plain text (data cu) -> so sanh truc tiep
            isMatch = password === user.password;
        }

        if (user.is_blocked) {
            return res.status(403).json({ success: false, message: 'Tài khoản này đã bị khóa. Vui lòng liên hệ Admin.' });
        }

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Sai mật khẩu' });
        }

        // Tao token (chua id, username, role)
        const token = jwt.sign(
            {
                id: user.user_id,
                username: user.username,
                role: user.role,
            },
            process.env.JWT_SECRET || 'secret_key_cua_huy',
            { expiresIn: '24h' }
        );

        // BUOC C: Neu khop thi tra ve info nhu cu
        res.json({
            success: true,
            message: 'Đăng nhập thành công',
            token: token,
            user: {
                id: user.user_id,
                username: user.username,
                name: user.full_name,
                role: user.role,
                avatar: user.avatar_url,
                email: user.email,
                dob: user.dob // Tra ve ngay sinh
            }
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// 2. Dang ky
exports.register = async (req, res) => {
    const { username, password, full_name, role, parent_pin, email, dob } = req.body;

    try {
        if (!email) return res.status(400).json({ success: false, message: 'Vui lòng nhập Email' });
        if (!dob) return res.status(400).json({ success: false, message: 'Vui lòng nhập Ngày sinh' });

        // Kiem tra user ton tai
        const [exists] = await pool.execute('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
        if (exists.length > 0) {
            if (exists[0].email === email) return res.status(400).json({ success: false, message: 'Email đã được sử dụng' });
            return res.status(400).json({ success: false, message: 'Tên đăng nhập đã tồn tại' });
        }

        const userRole = role || 'student';
        const userPin = parent_pin || '1234';

        // BUOC D: Ma hoa mat khau truoc khi luu
        const salt = await bcrypt.genSalt(10); // Tao muoi
        const hashedPassword = await bcrypt.hash(password, salt); // Tao mat khau da bam

        // BUOC E: Luu hashedPassword, Email va DOB
        const [result] = await pool.execute(
            'INSERT INTO users (username, password, full_name, role, parent_pin, email, dob, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
            [username, hashedPassword, full_name, userRole, userPin, email, dob]
        );

        // Tao bang phu cho hoc sinh
        if (userRole === 'student') {
            await pool.execute('INSERT INTO students (user_id) VALUES (?)', [result.insertId]);
        }

        res.json({ success: true, message: 'Đăng ký thành công!' });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ success: false, message: 'Lỗi server khi đăng ký' });
    }
};

// 3. Reset PIN (Can xac thuc bang mat khau)
exports.resetPin = async (req, res) => {
    try {
        const { user_id, password, new_pin } = req.body;

        // Find user
        const [rows] = await pool.execute('SELECT * FROM users WHERE user_id = ?', [user_id]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });

        const user = rows[0];

        // Verify Password
        let isMatch = false;
        const isHashed = user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$'));
        if (isHashed) {
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            isMatch = password === user.password;
        }

        if (!isMatch) return res.status(401).json({ success: false, message: 'Mật khẩu hiện tại không đúng' });

        // Update PIN
        await pool.execute('UPDATE users SET parent_pin = ? WHERE user_id = ?', [new_pin, user_id]);

        res.json({ success: true, message: 'Đổi PIN thành công' });
    } catch (err) {
        console.error("Reset PIN error:", err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// OTP LocalStore
const otpStore = new Map();

// 4. Forgot Password (Send OTP via Email)
exports.requestPasswordReset = async (req, res) => {
    try {
        const { username } = req.body;

        // 1. Kiem tra user co ton tai khong
        const [rows] = await pool.execute('SELECT user_id, username, full_name, role, email FROM users WHERE username = ?', [username]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'Tài khoản không tồn tại' });

        const user = rows[0];
        if (!user.email) return res.status(400).json({ success: false, message: 'Tài khoản chưa có Email. Hãy liên hệ GV để cập nhật.' });

        // 2. Tao OTP ngau nhien (6 so)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 3. Luu OTP (het han sau 5 phut)
        otpStore.set(username, {
            otp: otp,
            expires: Date.now() + 5 * 60 * 1000 // 5 phut
        });

        const emailTo = user.email;
        const subject = `[Hi Math] Mã xác thực reset mật khẩu cho ${username}`;
        const html = `
                <h3>Yêu cầu đặt lại mật khẩu</h3>
                <p>Xin chào <b>${user.full_name}</b>,</p>
                <p>Bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản: <b>${username}</b></p>
                <p>Mã xác thực của bạn là:</p>
                <h1 style="color: #4a6bff; letter-spacing: 5px;">${otp}</h1>
                <p>Mã này sẽ hết hạn sau 5 phút.</p>
                <p>Nếu không phải bạn, vui lòng bỏ qua email này.</p>
            `;

        try {
            await emailService.sendEmail(emailTo, subject, html);
            res.json({
                success: true,
                message: 'Mã xác thực đã được gửi về mail của bạn.',
            });
        } catch (mailError) {
            console.error("❌ Email Error -> DEBUG MODE:", mailError);
            res.json({
                success: true,
                message: `[DEBUG MODE - LỖI EMAIL] Mã OTP của bạn là: ${otp}`,
                debug_otp: otp
            });
        }

    } catch (err) {
        console.error("Forgot Pass Error:", err);
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

// 5. Submit New Password & Verify OTP
exports.resetPassword = async (req, res) => {
    try {
        const { username, new_password, otp } = req.body; // Can nhan them OTP

        // 1. Kiem tra OTP
        const storedData = otpStore.get(username);

        if (!storedData) {
            return res.status(400).json({ success: false, message: 'Vui lòng yêu cầu mã xác thực trước!' });
        }

        if (Date.now() > storedData.expires) {
            otpStore.delete(username);
            return res.status(400).json({ success: false, message: 'Mã xác thực đã hết hạn!' });
        }

        if (storedData.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Mã xác thực không đúng!' });
        }

        // 2. OTP dung -> Doi mat khau
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);

        await pool.execute('UPDATE users SET password = ? WHERE username = ?', [hashedPassword, username]);

        // 3. Xoa OTP sau khi dung xong
        otpStore.delete(username);

        res.json({ success: true, message: 'Đặt lại mật khẩu thành công! Hãy đăng nhập lại.' });
    } catch (err) {
        console.error("Reset Pass Error:", err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// 6. Cap nhat thong tin thieu (Email, Ngay sinh)
exports.updateUserInfo = async (req, res) => {
    try {
        const { user_id, email, dob } = req.body;

        let updates = [];
        let params = [];

        // Validate & Build Email Update
        if (email) {
            if (!email.includes('@')) return res.status(400).json({ success: false, message: 'Email không hợp lệ' });

            // Check duplicate
            const [exists] = await pool.execute('SELECT user_id FROM users WHERE email = ? AND user_id != ?', [email, user_id]);
            if (exists.length > 0) return res.status(400).json({ success: false, message: 'Email đã được sử dụng' });

            updates.push('email = ?');
            params.push(email);
        }

        // Build DOB Update
        if (dob) {
            updates.push('dob = ?');
            params.push(dob);
        }

        if (updates.length === 0) return res.status(400).json({ success: false, message: 'Không có thông tin nào được gửi lên' });

        params.push(user_id);

        const sql = `UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`;
        await pool.execute(sql, params);

        res.json({ success: true, message: 'Cập nhật thông tin thành công!' });
    } catch (err) {
        console.error("Update Info Error:", err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// 7. Quen PIN: Yeu cau OTP
exports.requestPinResetOTP = async (req, res) => {
    try {
        const { user_id } = req.body;

        // Lay thong tin user
        const [rows] = await pool.execute('SELECT user_id, username, full_name, email FROM users WHERE user_id = ?', [user_id]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });

        const user = rows[0];
        if (!user.email) return res.status(400).json({ success: false, message: 'Bạn chưa có email! Vui lòng cập nhật email trước.' });

        // Tao OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Luu OTP (Key rieng biet cho PIN)
        const key = `pin_reset_${user_id}`;
        otpStore.set(key, { otp, expires: Date.now() + 5 * 60 * 1000 });

        // Gui Email
        const subject = `[Hi Math] Mã xác thực Reset PIN`;
        const html = `<h3>Reset PIN Phụ Huynh</h3><p>Mã OTP của bạn là: <b style="font-size: 20px; color: blue;">${otp}</b></p><p>Đừng chia sẻ mã này cho ai khác.</p>`;

        try {
            await emailService.sendEmail(user.email, subject, html);
            res.json({ success: true, message: 'Đã gửi mã OTP về email của bạn.' });
        } catch (mailError) {
            console.error("❌ PIN Email Error -> DEBUG MODE:", mailError);
            res.json({
                success: true,
                message: `[DEBUG MODE - LỖI EMAIL] Mã OTP của bạn là: ${otp}`,
                debug_otp: otp
            });
        }

    } catch (err) {
        console.error("Req PIN OTP Error:", err);
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

// 8. Quen PIN: Submit OTP & PIN moi
exports.resetPinWithOTP = async (req, res) => {
    try {
        const { user_id, otp, new_pin } = req.body;

        const key = `pin_reset_${user_id}`;
        const stored = otpStore.get(key);

        if (!stored) return res.status(400).json({ success: false, message: 'Vui lòng yêu cầu mã OTP trước' });
        if (Date.now() > stored.expires) {
            otpStore.delete(key);
            return res.status(400).json({ success: false, message: 'Mã OTP đã hết hạn' });
        }
        if (stored.otp !== otp) return res.status(400).json({ success: false, message: 'Mã OTP không đúng' });

        // Update PIN
        await pool.execute('UPDATE users SET parent_pin = ? WHERE user_id = ?', [new_pin, user_id]);

        // Clear OTP
        otpStore.delete(key);

        res.json({ success: true, message: 'Đổi PIN thành công! Vui lòng dùng PIN mới để đăng nhập.' });
    } catch (err) {
        console.error("Reset PIN OTP Error:", err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// 9. Daily Check-in (Tinh Streak)
exports.dailyCheckIn = async (req, res) => {
    try {
        // req.user duoc gan tu middleware authMiddleware
        const user_id = req.user.id;

        // 1. Lay thong tin hien tai tu bang student
        // JOIN de chac chan lay dung student tuong ung user_id
        // (Gia su bang students co cot user_id la khoa ngoai tro toi users)
        const [rows] = await pool.execute(
            `SELECT streak_count, last_activity_date FROM students WHERE user_id = ?`,
            [user_id]
        );

        if (rows.length === 0) {
            // Truong hop user co nhung chua co row trong students (hiem, nhung cu handle)
            return res.json({ success: true, streak: 0 });
        }

        let streak = rows[0].streak_count || 0;
        let lastDate = rows[0].last_activity_date; // Format 'YYYY-MM-DD'

        // 2. Tinh ngay hom nay va thoi gian VN
        const now = new Date();
        const vnTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));

        const yyyy = vnTime.getUTCFullYear();
        const mm = String(vnTime.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(vnTime.getUTCDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;

        // BACKFILL LOGIC: Neu user cu chua co last_activity_date, tim trong lich su choi game
        if (!lastDate) {
            try {
                // Tim ngay choi gan nhat tu game_results
                const [gameRows] = await pool.execute(
                    `SELECT completed_at FROM game_results WHERE student_id = ? ORDER BY completed_at DESC LIMIT 1`,
                    [user_id]
                );

                if (gameRows.length > 0) {
                    const lastPlay = new Date(gameRows[0].completed_at);
                    const lpTime = new Date(lastPlay.getTime() + (7 * 60 * 60 * 1000));
                    const lp_yyyy = lpTime.getUTCFullYear();
                    const lp_mm = String(lpTime.getUTCMonth() + 1).padStart(2, '0');
                    const lp_dd = String(lpTime.getUTCDate()).padStart(2, '0');
                    lastDate = `${lp_yyyy}-${lp_mm}-${lp_dd}`;

                    // Gia dinh streak it nhat la 1 o thoi diem do
                    streak = 1;
                    console.log(`User ${user_id} Backfill LastDate: ${lastDate}`);
                }
            } catch (e) { console.warn("Backfill failed", e); }
        }

        // Neu hom nay da check-in roi -> Tra ve luon
        if (lastDate === todayStr) {
            return res.json({ success: true, streak: streak });
        }

        // Tinh ngay hom qua
        const yesterdayTime = new Date(vnTime.getTime() - (24 * 60 * 60 * 1000));
        const y_yyyy = yesterdayTime.getUTCFullYear();
        const y_mm = String(yesterdayTime.getUTCMonth() + 1).padStart(2, '0');
        const y_dd = String(yesterdayTime.getUTCDate()).padStart(2, '0');
        const yesterdayStr = `${y_yyyy}-${y_mm}-${y_dd}`;

        let newStreak = streak;

        if (lastDate === yesterdayStr) {
            newStreak++; // Lien tiep
        } else if (lastDate && lastDate < yesterdayStr) {
            newStreak = 1; // Ngat quang
        } else if (!lastDate) {
            newStreak = 1; // Moi tinh
        } else {
            // Truong hop lastDate == todayStr da handle o tren
            // Truong hop lastDate > todayStr (Vo ly nhung cu giu streak)
        }

        // 3. Update DB
        // Luu y: Neu cot chua co, SQL se loi. Dam bao chay update_streak_schema.js truoc.
        await pool.execute(
            'UPDATE students SET streak_count = ?, last_activity_date = ? WHERE user_id = ?',
            [newStreak, todayStr, user_id]
        );

        console.log(`🔥 User ${user_id} Check-in: ${todayStr}. Streak: ${newStreak}`);

        res.json({ success: true, streak: newStreak });

    } catch (err) {
        console.error("Check-in Error:", err);
        // Co the loi do chua co cot streak_count -> Bao ve client van success nhung streak 0 de khong crash app
        res.status(200).json({ success: true, streak: 0, message: "DB schema outdated" });
    }
};