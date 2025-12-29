const pool = require('../config/db');

exports.logVisit = async (req, res) => {
    const { type, page, ts } = req.body;
    const userId = req.user.id; // Lấy từ token

    // Chuyển timestamp sang format MySQL
    const timeLog = new Date(ts).toISOString().slice(0, 19).replace('T', ' ');

    console.log(`📡 STATS VISIT: ${type} - ${page} - User: ${userId}`);

    try {
        if (type === 'visit_start') {
            await pool.execute(
                'INSERT INTO study_sessions (user_id, page_name, start_time) VALUES (?, ?, ?)',
                [userId, page, timeLog]
            );
        }
        else if (type === 'visit_end') {
            await pool.execute(
                `UPDATE study_sessions 
                 SET end_time = ?, duration = TIMESTAMPDIFF(SECOND, start_time, ?) 
                 WHERE user_id = ? AND page_name = ? AND end_time IS NULL 
                 ORDER BY start_time DESC LIMIT 1`,
                [timeLog, timeLog, userId, page]
            );
        }
        res.json({ success: true });
    } catch (err) {
        console.error("Stats Visit Error:", err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

exports.logEvent = async (req, res) => {
    const { type, game, level, attempt, data } = req.body;
    const userId = req.user.id;

    let eventType = 'UNKNOWN';
    let saveData = {};

    if (type === 'level') {
        eventType = 'LEVEL_UP';
        saveData = { level: level };
    } else if (type === 'attempt') {
        eventType = 'ATTEMPT';
        saveData = attempt;
    } else {
        eventType = 'EVENT';
        saveData = data;
    }

    try {
        await pool.execute(
            'INSERT INTO analytics_events (user_id, event_type, game_name, event_data) VALUES (?, ?, ?, ?)',
            [userId, eventType, game, JSON.stringify(saveData)]
        );
        res.json({ success: true });
    } catch (err) {
        console.error("Stats Event Error:", err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};