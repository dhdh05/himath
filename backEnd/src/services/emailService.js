const path = require('path');
// Thu nap .env tu thu muc cha (backEnd root) truoc
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
// Fallback: nap tu thu muc hien tai neu co
require('dotenv').config();

const nodemailer = require('nodemailer');

console.log("---------------------------------------------------");
console.log("📧 EMAIL SERVICE CONFIG CHECK (UPDATED PORT 587):");
console.log(`   - EMAIL_USER: ${process.env.EMAIL_USER ? '✅ LOADED' : '❌ MISSING'}`);
console.log(`   - EMAIL_PASS: ${process.env.EMAIL_PASS ? '✅ LOADED' : '❌ MISSING'}`);
console.log("---------------------------------------------------");

// 1. CẤU HÌNH SMTP (GMAIL - PORT 587 - STARTTLS)
// Đây là cấu hình khuyên dùng cho Render / Heroku để tránh bị chặn Port 465
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,              // Chuyển sang 587 thay vì 465
    secure: false,          // false cho port 587 (sẽ tự động nâng cấp lên TLS)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Chấp nhận chứng chỉ tự ký (giúp tránh lỗi trên server cloud)
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
});

// 2. HÀM GỬI EMAIL THÔNG MINH (CÓ THỂ MỞ RỘNG API SAU NÀY)
exports.sendEmail = async (to, subject, htmlContent) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error("Missing credentials in .env file");
        }

        const mailOptions = {
            from: `"Hi Math Support" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: htmlContent
        };

        // Thử gửi bằng SMTP (Nodemailer)
        console.log(`⏳ Đang gửi mail tới ${to} qua SMTP (Port 587)...`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully: ${info.messageId}`);
        return { success: true, info, method: 'SMTP' };

    } catch (error) {
        console.error("❌ SMTP Error:", error.message);

        // --- LOGIC FALLBACK (Dự phòng) ---
        // Tại đây bạn có thể thêm code gọi API (ví dụ: Resend, SendGrid) nếu SMTP thất bại.
        // Hiện tại ta sẽ throw lỗi để biết đường fix, nhưng log rõ ràng hơn.

        console.log("⚠️ Gợi ý: Nếu Deploy trên Render bị lỗi Timeout:");
        console.log("   1. Hãy chắc chắn bạn đã Add Environment Variables trên Dashboard Render.");
        console.log("   2. Google có thể chặn IP lạ -> Vào account google -> Security check.");

        throw error;
    }
};
