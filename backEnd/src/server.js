const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const parentRoutes = require('./routes/parentRoutes');
const statsRoutes = require('./routes/statsRoutes');
const streakRoutes = require('./routes/streakRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const rewardRoutes = require('./routes/rewardRoutes');



dotenv.config();

const app = express();

// Middleware
// CORS Configuration - cho phép frontend gọi API
// Development: Cho phép nhiều origin, Production: Chỉ cho phép domain cụ thể
const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép requests không có origin (mobile apps, Postman, etc.) trong development
    if (!origin || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    // Production: Kiểm tra whitelist
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:5500',
      'http://localhost:3000',
      'http://127.0.0.1:5500',
      'http://127.0.0.1:3000'
    ].filter(Boolean);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/streak', streakRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/lessons', require('./routes/lessonRoutes'));
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📡 API Endpoints:`);
  console.log(`   - Auth: /api/auth/login, /api/auth/register`);
  console.log(`   - Games: /api/games/levels/:gameType, /api/games/submit`);
  console.log(`   - Parents: /api/parents/verify-pin, /api/parents/stats/:student_id, /api/parents/today-time`);
  console.log(`   - Stats: /api/stats/visit, /api/stats/event`);
  console.log(`   - Streak: /api/streak`);
  console.log(`   - Leaderboard: /api/leaderboard/score, /api/leaderboard/time, /api/leaderboard/stars`);
  console.log(`   - Achievements: /api/achievements, /api/achievements/check`);
  console.log(`   - Rewards: /api/rewards, /api/rewards/check`);
  console.log(`   - Lessons: /api/lessons`);
  console.log(`   - Notifications: /api/notifications`);
  console.log(`   - Goals: /api/goals`);
  console.log(`\n💡 Frontend cần mở bằng http://localhost:5500 hoặc Live Server`);
});




