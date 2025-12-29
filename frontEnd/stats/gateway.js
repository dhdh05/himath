

(function () {
  const QUEUE_KEY = 'hm_stats_queue';
  
  // Helper function để lấy user_id từ localStorage (current user)
  function getCurrentUserId() {
    try {
      const currentUser = JSON.parse(localStorage.getItem('hm_user') || 'null');
      if (currentUser && (currentUser.id || currentUser.user_id)) {
        return currentUser.id || currentUser.user_id;
      }
    } catch (e) {}
    // Fallback: Nếu chưa đăng nhập, return null (không gửi stats)
    return null;
  }
  
  // Set/get HiMathUserId từ current user
  function updateHiMathUserId() {
    const userId = getCurrentUserId();
    if (userId) {
      window.HiMathUserId = userId;
    }
    return userId;
  }
  
  // Khởi tạo lần đầu
  updateHiMathUserId();
  
  // Export function để có thể update khi user đăng nhập
  window.updateHiMathUserId = updateHiMathUserId;

  function _now() { return Date.now(); }

  function _getQueued() {
    try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); } catch (e) { return []; }
  }
  function _saveQueued(q) { try { localStorage.setItem(QUEUE_KEY, JSON.stringify(q)); } catch (e) {} }
  function _enqueue(item) { const q = _getQueued(); q.push(item); _saveQueued(q); }

  // Lấy API URL từ config hoặc fallback về localhost
  const API_URL = window.API_CONFIG?.BASE_URL || 'http://localhost:3000';

  async function _post(path, body) {
  try {
      // Lấy token từ localStorage để gửi kèm request
      const token = localStorage.getItem('user_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const res = await fetch(API_URL + path, { 
        method: 'POST', 
        headers: headers, 
        body: JSON.stringify(body) 
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`❌ Stats API Error: ${res.status} ${res.statusText}`, errorText);
        throw new Error(`Network response not ok: ${res.status}`);
      }
      const result = await res.json();
      console.log('✅ Stats API Success:', path, result);
      return true;
    } catch (e) {
      console.error("❌ Lỗi gửi Stats API:", path, e); // In lỗi ra để dễ kiểm tra
      try { _enqueue({ path, body, ts: _now() }); } catch (err) {}
      return false;
    }
  }

  // Public API - standardized packets
  const Gateway = {
    // page visit start
    startPage(page, meta) {
      const userId = getCurrentUserId();
      if (!userId) {
        console.warn('⚠️ Stats: Cannot startPage - user not logged in', page);
        return;
      }
      const payload = {
        type: 'visit_start',
        page,
        userId: userId,
        meta: meta || null,
        ts: _now()
      };
      console.log('📊 Stats: startPage', page, 'userId:', userId);
      _post('/api/stats/visit', payload);
    },

    // page visit end (duration optional if available)
    endPage(page, meta) {
      const userId = getCurrentUserId();
      if (!userId) {
        console.warn('⚠️ Stats: Cannot endPage - user not logged in', page);
        return;
      }
      const payload = {
        type: 'visit_end',
        page,
        userId: userId,
        meta: meta || null,
        ts: _now()
      };
      console.log('📊 Stats: endPage', page, 'userId:', userId);
      _post('/api/stats/visit', payload);
    },

    // generic event
    event(name, data) {
      const userId = getCurrentUserId();
      const payload = {
        type: 'event',
        name,
        userId: userId,
        data: data || {},
        ts: _now()
      };
      _post('/api/stats/event', payload);
    },

    // higher-level helpers
    // record an attempt within a question: gameKey e.g. 'dem-so', 'practice-tinh-toan'
    recordAttempt(gameKey, attemptData) {
      const userId = getCurrentUserId();
      const payload = {
        type: 'attempt',
        game: gameKey,
        userId: userId,
        attempt: attemptData,
        ts: _now()
      };
      _post('/api/stats/event', payload);
    },

    // record level / milestone
    recordLevel(gameKey, level) {
      const userId = getCurrentUserId();
      const payload = {
        type: 'level',
        game: gameKey,
        userId: userId,
        level: level,
        ts: _now()
      };
      _post('/api/stats/event', payload);
    },

    // expose queue for debug / manual flush
    getQueue() { return _getQueued(); },
    clearQueue() { _saveQueued([]); }
  };

  // Provide a compatibility wrapper named HiMathStats used by panels
  window.HiMathStats = window.HiMathStats || {
    startPage: (p, m) => Gateway.startPage(p, m),
    endPage: (p, m) => Gateway.endPage(p, m),
    event: (n, d) => Gateway.event(n, d),
    record: (n, d) => {
      // convenience: if name suggests attempt or level, route accordingly
      if (typeof n === 'string' && n.indexOf('level') !== -1) Gateway.recordLevel(n, d);
      else Gateway.event(n, d);
    },
    recordAttempt: (gameKey, data) => Gateway.recordAttempt(gameKey, data),
    __gateway: Gateway
  };

  // expose gateway directly
  window.StatsGateway = Gateway;
})();
