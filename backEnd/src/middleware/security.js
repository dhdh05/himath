/**
 * Simple Security Middleware
 * Adds standard security headers and protections.
 * Use 'helmet' package for more advanced protection if possible.
 */
module.exports = function (req, res, next) {
    // 1. Anti-clickjacking: Deny iframe embedding
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');

    // 2. HTTP Strict Transport Security (HSTS) - Force HTTPS
    // Uncomment if using SSL
    // res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

    // 3. Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // 4. Basic XSS Protection
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // 5. Remove 'X-Powered-By' header (Obscure tech stack)
    res.removeHeader('X-Powered-By');

    // 6. Referrer Policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    next();
};
