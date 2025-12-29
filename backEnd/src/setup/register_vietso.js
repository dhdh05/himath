
const pool = require('../config/db');

async function registerGame() {
    try {
        console.log("🎮 Đang đăng ký game 'Bé Tập Viết Số' (practice-viet-so)...");

        // 1. Thử Insert vào bảng 'games' (nếu có bảng danh mục game)
        try {
            // Kiểm tra bảng games có tồn tại columns nào
            // Giả định schema phổ biến: game_key/code/type, name
            // Dùng INSERT IGNORE để tránh lỗi
            await pool.execute(`
                INSERT IGNORE INTO games (game_code, name, description, category, thumbnail) 
                VALUES ('practice-viet-so', 'Bé Tập Viết Số', 'Luyện viết số với AI', 'practice', 'viet-so.jpg');
            `);
            console.log("✅ (Optional) Đã thêm vào bảng 'games'.");
        } catch (e) {
            // Fallback: Có thể tên cột khác (game_type, active...) -> Bỏ qua vì bảng này thường chỉ để show list
            console.log("ℹ️ Bỏ qua bảng 'games':", e.message);
        }

        // 2. QUAN TRỌNG: Insert Level 1 vào game_levels
        // Điều này đảm bảo nếu game_results có check FK level_id thì nó sẽ hoạt động
        try {
            // Xóa cũ nếu cần để reset
            // await pool.execute("DELETE FROM game_levels WHERE game_type = 'practice-viet-so'");

            // Insert level 1 căn bản
            // Lưu ý: Cột config thường là JSON
            await pool.execute(`
                INSERT INTO game_levels (game_type, level_number, name, description, config, time_limit, target_score)
                VALUES 
                ('practice-viet-so', 1, 'Làm quen', 'Luyện viết các số cơ bản', '{"numbers": [0,1,2,3,4,5,6,7,8,9]}', 0, 100)
                ON DUPLICATE KEY UPDATE level_number=1; -- Mẹo để không lỗi nếu duplicate
            `);
            console.log("✅ Đã đăng ký Level 1 cho 'practice-viet-so' trong bảng game_levels.");
        } catch (e) {
            console.error("❌ Lỗi khi thêm game_levels:", e.message);
        }

        // 3. Setup hệ thống tính điểm (nếu có bảng progress riêng ngoài student_game_progress)
        // Hiện tại student_game_progress tự động insert row mới nên không cần init.

        console.log("🎉 Đã hoàn tất setup Database cho Game AI!");

    } catch (e) {
        console.error("❌ Lỗi Script:", e);
    } finally {
        process.exit();
    }
}

registerGame();
