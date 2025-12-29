// Frontend Configuration
// API Base URL - có thể override bằng environment variable hoặc config
(function () {
  // Cho phép override từ HTML hoặc environment
  // Nếu có window.API_BASE_URL (set từ HTML) thì dùng, nếu không thì tự detect
  const API_BASE_URL = window.API_BASE_URL ||
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000'
      : (window.location.hostname.includes('render.com')
        ? 'https://himath-be.onrender.com'  // Thay bằng backend URL thực tế của bạn
        : 'https://your-backend-domain.com'));

  // Export ra window object để các file khác có thể dùng
  window.API_CONFIG = {
    BASE_URL: API_BASE_URL,
    ENDPOINTS: {
      AUTH: {
        LOGIN: `${API_BASE_URL}/api/auth/login`,
        REGISTER: `${API_BASE_URL}/api/auth/register`,
        CHECK_IN: `${API_BASE_URL}/api/auth/check-in`,
        FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
        RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
        UPDATE_INFO: `${API_BASE_URL}/api/auth/update-info`
      },
      GAMES: {
        LEVELS: (gameType) => `${API_BASE_URL}/api/games/levels/${gameType}`,
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

