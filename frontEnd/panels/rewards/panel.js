export function mount(container) {
  if (!container) return;
  
  container.innerHTML = `
    <div class="rewards-panel">
      <div class="rewards-header">
        <h2>🎁 Phần Thưởng</h2>
      </div>
      <div class="rewards-grid" id="rewardsGrid">
        <div class="loading">Đang tải...</div>
      </div>
    </div>
  `;
  
  loadRewards();
}

async function loadRewards() {
  const gridEl = document.getElementById('rewardsGrid');
  
  if (!gridEl) return;
  
  try {
    const apiUrl = window.API_CONFIG?.ENDPOINTS?.REWARDS?.GET || 'http://localhost:3000/api/rewards';
    const headers = window.getAuthHeaders ? window.getAuthHeaders() : { 'Content-Type': 'application/json' };
    
    const res = await fetch(apiUrl, { headers: headers });
    if (!res.ok) throw new Error('Failed to fetch rewards');
    
    const data = await res.json();
    if (!data.success) {
      gridEl.innerHTML = '<div class="error">Không có dữ liệu</div>';
      return;
    }
    
    // Render rewards
    if (data.rewards && data.rewards.length > 0) {
      gridEl.innerHTML = data.rewards.map(reward => {
        const date = new Date(reward.date_awarded).toLocaleDateString('vi-VN');
        
        return `
          <div class="reward-card">
            <div class="reward-icon">${reward.reward_title.split(' ')[0]}</div>
            <div class="reward-info">
              <div class="reward-title">${reward.reward_title}</div>
              <div class="reward-reason">${reward.reason || ''}</div>
              <div class="reward-date">${date}</div>
            </div>
          </div>
        `;
      }).join('');
    } else {
      gridEl.innerHTML = '<div class="empty">Chưa có phần thưởng nào. Hãy học tập chăm chỉ để nhận phần thưởng nhé! 🎯</div>';
    }
    
  } catch (error) {
    console.error('Lỗi load rewards:', error);
    gridEl.innerHTML = '<div class="error">Lỗi tải dữ liệu</div>';
  }
}

// Function để hiển thị popup khi có reward mới
export function showRewardPopup(rewards) {
  if (!rewards || rewards.length === 0) return;
  
  const popup = document.createElement('div');
  popup.className = 'reward-popup';
  popup.innerHTML = `
    <div class="popup-content">
      <div class="popup-icon">🎉</div>
      <div class="popup-title">Phần Thưởng Mới!</div>
      <div class="popup-rewards">
        ${rewards.map(reward => `
          <div class="popup-reward-item">
            <span class="popup-reward-icon">${reward.title.split(' ')[0]}</span>
            <div>
              <div class="popup-reward-title">${reward.title}</div>
              <div class="popup-reward-reason">${reward.reason}</div>
            </div>
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

