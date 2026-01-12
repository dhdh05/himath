module.exports = (req, res, next) => {
    // req.user has been populated by verifyToken
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        console.warn(`[Admin] Unauthorized access attempt by user ${req.user ? req.user.id : 'unknown'}`);
        res.status(403).json({ success: false, message: 'Truy cập bị từ chối. Chức năng chỉ dành cho Admin.' });
    }
};
