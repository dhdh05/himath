const jwt = require('jsonwebtoken');

// Doi tu exports.verifyToken thanh khai bao bien const
const verifyToken = (req, res, next) => {
    // Lay token tu header gui len (Dang: Bearer abcxyz...)
    const authHeader = req.headers['authorization'];

    // --- DEBUG LOG ---
    console.log(`🛡️  [Auth] ${req.method} ${req.url} | Header: ${authHeader ? 'Co' : 'Khong'}`);
    // -----------------

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ success: false, message: 'Chưa đăng nhập (Thiếu Token)!' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_cua_huy');
        console.log("✅ Token Valid for User:", decoded.id || decoded.user_id);
        req.user = decoded; // Luu thong tin user vao bien req
        next(); // Cho phep di tiep
    } catch (error) {
        console.error("❌ Token Verification Failed:", error.message);
        return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc hết hạn!' });
    }
};

// QUAN TRONG: Xuat truc tiep ham nay ra
module.exports = verifyToken;