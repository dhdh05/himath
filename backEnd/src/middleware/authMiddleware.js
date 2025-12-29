const jwt = require('jsonwebtoken');

// Đổi từ exports.verifyToken thành khai báo biến const
const verifyToken = (req, res, next) => {
    // Lấy token từ header gửi lên (Dạng: Bearer abcxyz...)
    const authHeader = req.headers['authorization'];

    // --- DEBUG LOG ---
    console.log(`🛡️  [Auth] ${req.method} ${req.url} | Header: ${authHeader ? 'Có' : 'Không'}`);
    // -----------------

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ success: false, message: 'Chưa đăng nhập (Thiếu Token)!' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_cua_huy');
        console.log("✅ Token Valid for User:", decoded.id || decoded.user_id);
        req.user = decoded; // Lưu thông tin user vào biến req
        next(); // Cho phép đi tiếp
    } catch (error) {
        console.error("❌ Token Verification Failed:", error.message);
        return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc hết hạn!' });
    }
};

// QUAN TRỌNG: Xuất trực tiếp hàm này ra
module.exports = verifyToken;