const dns = require('dns');
if (dns.setDefaultResultOrder) dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const parentRoutes = require('./routes/parentRoutes');
const statsRoutes = require('./routes/statsRoutes');
const streakRoutes = require('./routes/streakRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const rewardRoutes = require('./routes/rewardRoutes');

const app = express();

// SECURITY MIDDLEWARE (Manually added for max security)
app.use(require('./middleware/security'));

// Middleware
// CORS Configuration - cau hinh CORS cho phep frontend goi API
const corsOptions = {
  origin: function (origin, callback) {
    // Cho phep requests khong co origin (mobile apps, Postman) trong moi truong development
    if (!origin || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    // Production: Kiem tra whitelist
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
app.use('/api/chatbot', require('./routes/chatbotRoutes'));
app.use('/api/lessons', require('./routes/lessonRoutes'));

// --- SERVE FRONTEND (SPA Support) ---
// Serve static files from frontEnd directory
app.use(express.static(path.join(__dirname, '../../frontEnd')));

// Handle SPA fallback: Any route not starting with /api returns index.html
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API Not Found' });
  }
  res.sendFile(path.join(__dirname, '../../frontEnd/index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`✅ Server dang chay tai http://localhost:${PORT}`);
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
  console.log(`\n💡 Frontend can mo bang http://localhost:5500 hoac Live Server`);

  // --- DATABASE CONNECTION CHECK ---
  try {
    const db = require('./config/db');
    await db.execute('SELECT 1');
    console.log('✅ DATABASE CONNECTION SUCCESSFUL');
  } catch (err) {
    console.error('❌ DATABASE CONNECTION FAILED:', err.message);
    console.error('   Hint: Tren Render/Vercel, ban KHONG THE ket noi den localhost/XAMPP cua may ban.');
    console.error('   Giai phap: Ban phai tao Database tren Cloud (Aiven, Supabase, Railway...) va cau hinh bien moi truong DB_HOST.');
  }
});




