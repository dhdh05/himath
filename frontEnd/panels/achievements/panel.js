export function mount(container) {
  if (!container) return;

  container.innerHTML = `
    <div class="achievements-panel">
      <div class="achievements-header">
        <h2>🏆 Thành Tích</h2>
        <div class="achievements-stats" id="achievementsStats"></div>
      </div>
      <div class="achievements-grid" id="achievementsGrid">
        <div class="loading">Đang tải...</div>
      </div>

      <div class="achievements-header" style="margin-top: 30px; border-top: 2px dashed #eee; padding-top: 20px;">
        <h2>🎁 Kho Phần Thưởng & Huy Hiệu</h2>
      </div>
      <div class="achievements-grid" id="rewardsGrid">
         <div class="loading">Đang tải phần thưởng...</div>
      </div>
    </div>
  `;

  loadAchievements();
}

async function loadAchievements() {
  const gridEl = document.getElementById('achievementsGrid');
  const statsEl = document.getElementById('achievementsStats');

  if (!gridEl) return;

  try {
    const apiUrl = window.API_CONFIG?.ENDPOINTS?.ACHIEVEMENTS?.GET || 'http://localhost:3000/api/achievements';
    const headers = window.getAuthHeaders ? window.getAuthHeaders() : { 'Content-Type': 'application/json' };

    const res = await fetch(apiUrl, { headers: headers });
    if (!res.ok) throw new Error('Failed to fetch achievements');

    const data = await res.json();
    if (!data.success) {
      gridEl.innerHTML = '<div class="error">Không có dữ liệu</div>';
      return;
    }

    // Show stats
    if (statsEl && data.stats) {
      statsEl.innerHTML = `
        <div class="stat-item">
          <span class="stat-value">${data.stats.total}</span>
          <span class="stat-label">Thành tích</span>
        </div>
      `;
    }

    // Render achievements
    if (data.achievements && data.achievements.length > 0) {
      gridEl.innerHTML = data.achievements.map(ach => {
        const icon = getAchievementIcon(ach.achievement_type);
        const date = new Date(ach.earned_at).toLocaleDateString('vi-VN');

        return `
          <div class="achievement-card">
            <div class="achievement-icon">${icon}</div>
            <div class="achievement-info">
              <div class="achievement-title">${ach.title}</div>
              <div class="achievement-description">${ach.description || ''}</div>
              <div class="achievement-date">${date}</div>
            </div>
          </div>
        `;
      }).join('');
    } else {
      gridEl.innerHTML = '<div class="empty">Chưa có thành tích nào. Hãy bắt đầu học để nhận thành tích nhé! 🎯</div>';
    }

    // --- NEW: Load Rewards ---
    const rewardsContainer = document.getElementById('rewardsGrid');
    if (rewardsContainer) {
      try {
        const resRewards = await fetch('http://localhost:3000/api/rewards', { headers: headers });
        const dateRewards = await resRewards.json();
        if (dateRewards.success && dateRewards.rewards && dateRewards.rewards.length > 0) {
          rewardsContainer.innerHTML = dateRewards.rewards.map(r => `
                <div class="achievement-card reward-card" style="border-color: #FFD700; background: #fffbe6;">
                  <div class="achievement-icon">🎁</div>
                  <div class="achievement-info">
                    <div class="achievement-title" style="color: #d4af37;">${r.reward_title}</div>
                    <div class="achievement-description">${r.reason}</div>
                    <div class="achievement-date">${new Date(r.date_awarded).toLocaleDateString('vi-VN')}</div>
                  </div>
                </div>
              `).join('');
        } else {
          rewardsContainer.innerHTML = '<div class="empty" style="grid-column: 1/-1;">Chưa có phần thưởng đặc biệt nào.</div>';
        }
      } catch (e) {
        console.warn('Loi load rewards:', e);
        rewardsContainer.innerHTML = '';
      }
    }

  } catch (error) {
    console.error('Loi load achievements:', error);
    gridEl.innerHTML = '<div class="error">Lỗi tải dữ liệu</div>';
  }
}

function getAchievementIcon(type) {
  const icons = {
    'first_play': '🎮',
    'perfect_score': '⭐',
    'level_master': '🏆',
    'streak_5': '🔥',
    'streak_10': '🔥🔥',
    'speedrun': '⚡',
    'game_guru': '🎓',
    'star_collector': '⭐'
  };
  return icons[type] || '🏅';
}

// Function de hien thi popup khi co achievement moi (goi tu game panels)
export function showAchievementPopup(achievements) {
  if (!achievements || achievements.length === 0) return;

  const popup = document.createElement('div');
  popup.className = 'achievement-popup';
  popup.innerHTML = `
    <div class="popup-content">
      <div class="popup-icon">🎉</div>
      <div class="popup-title">Thành Tích Mới!</div>
      <div class="popup-achievements">
        ${achievements.map(ach => `
          <div class="popup-achievement-item">
            <span class="popup-ach-icon">${getAchievementIcon(ach.type)}</span>
            <span class="popup-ach-title">${ach.title}</span>
          </div>
        `).join('')}
      </div>
      <button class="popup-close" onclick="this.parentElement.parentElement.remove()">Đóng</button>
    </div>
  `;

  document.body.appendChild(popup);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (popup.parentElement) popup.remove();
  }, 5000);
}

export function unmount(container) {
  if (container) container.innerHTML = '';
}

