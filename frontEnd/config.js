// Frontend Configuration
// API Base URL - co the override bang environment variable hoac config
(function () {
  // Cho phep override tu HTML hoac environment
  // Neu co window.API_BASE_URL (set tu HTML) thi dung, neu khong thi tu detect
  const API_BASE_URL = window.API_BASE_URL ||
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000'
      : (window.location.hostname.includes('render.com')
        ? 'https://himath-be.onrender.com' // Explicit Backend URL provided by user
        : 'https://himath-be.onrender.com')); // Default fallback to prod backend if unknown msg

  // Export ra window object de cac file khac co the dung
  window.API_CONFIG = {
    BASE_URL: API_BASE_URL,
    ENDPOINTS: {
      AUTH: {
        LOGIN: `${API_BASE_URL}/api/auth/login`,
        REGISTER: `${API_BASE_URL}/api/auth/register`,
        CHECK_IN: `${API_BASE_URL}/api/auth/check-in`,
        FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
        RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
        UPDATE_INFO: `${API_BASE_URL}/api/auth/update-info`,
        FORGOT_PIN: `${API_BASE_URL}/api/auth/forgot-pin`,
        RESET_PIN_OTP: `${API_BASE_URL}/api/auth/reset-pin-otp`
      },
      GAMES: {
        LEVELS: (gameType) => `${API_BASE_URL}/api/games/levels/${gameType}`,
        QUESTIONS: `${API_BASE_URL}/api/games/questions/:gameType`,
        SUBMIT: `${API_BASE_URL}/api/games/submit`
      },
      PARENTS: {
        VERIFY_PIN: `${API_BASE_URL}/api/parents/verify-pin`,
        STATS: (studentId) => `${API_BASE_URL}/api/parents/stats/${studentId}`,
        TODAY_TIME: `${API_BASE_URL}/api/parents/today-time`
      },
      STATS: {
        VISIT: `${API_BASE_URL}/api/stats/visit`,
        EVENT: `${API_BASE_URL}/api/stats/event`
      },
      LEADERBOARD: {
        SCORE: `${API_BASE_URL}/api/leaderboard/score`,
        TIME: `${API_BASE_URL}/api/leaderboard/time`,
        STARS: `${API_BASE_URL}/api/leaderboard/stars`,
        ALL: `${API_BASE_URL}/api/leaderboard/all`
      },
      ACHIEVEMENTS: {
        GET: `${API_BASE_URL}/api/achievements`,
        CHECK: `${API_BASE_URL}/api/achievements/check`
      },
      REWARDS: {
        GET: `${API_BASE_URL}/api/rewards`,
        CHECK: `${API_BASE_URL}/api/rewards/check`
      },
      LESSONS: {
        GET: `${API_BASE_URL}/api/lessons`,
        EXERCISES: (lessonId) => `${API_BASE_URL}/api/lessons/${lessonId}/exercises`
      },
      NOTIFICATIONS: {
        GET: `${API_BASE_URL}/api/notifications`,
        MARK_READ: (id) => `${API_BASE_URL}/api/notifications/${id}/read`,
        MARK_ALL_READ: `${API_BASE_URL}/api/notifications/read-all`
      },
      GOALS: {
        GET: `${API_BASE_URL}/api/goals`,
        UPDATE: `${API_BASE_URL}/api/goals`
      }
    }
  };

  console.log('✅ API Config loaded:', window.API_CONFIG.BASE_URL);
})();

