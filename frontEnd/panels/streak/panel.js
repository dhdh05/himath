

// Export fetch function so main.js can use it for the header button
export async function fetchStreakData() {
  try {
    const apiUrl = 'http://localhost:3000/api/streak';

    // Lấy ID user từ localStorage
    let userId = 1;
    try {
      const u = JSON.parse(localStorage.getItem('hm_user'));
      if (u && (u.id || u.user_id)) userId = u.id || u.user_id;
    } catch (e) { }

    const res = await fetch(`${apiUrl}?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed');
    const data = await res.json();

    if (!data || !data.success) {
      return { streak: 0, total_days: 0 };
    }

    return { streak: data.streak, total_days: data.total_days };
  } catch (error) {
    console.error('Lỗi streak:', error);
    return { streak: 0, total_days: 0 };
  }
}

export async function mount(container) {
  if (!container) return;

  // 1. Load CSS
  if (!document.querySelector('link[data-panel="streak"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './panels/streak/style.css';
    link.setAttribute('data-panel', 'streak');
    document.head.appendChild(link);
  }

  // 2. Initial HTML state
  // 2. TẠO HTML (Horizontal Layout)
  container.innerHTML = `
    <div class="streak-widget">
      <!-- Cột Trái: Icon + Số Ngày -->
      <div class="streak-left">
         <div class="streak-days-container">
            <div class="streak-number" id="streakNumber">--</div>
            <div class="streak-label">ngày liên tiếp</div>
         </div>
      </div>

      <!-- Cột Phải: Thông tin chi tiết -->
      <div class="streak-right">
        <div class="streak-header">
           <h3>🔥 Chuỗi Ngày Học</h3>
        </div>
        
        <div class="streak-stats">
           <div class="streak-total" id="streakTotal">Đang tải...</div>
        </div>

        <div class="streak-message" id="streakMessage">Đang kiểm tra...</div>
      </div>
    </div>
  `;

  // 3. Load data and replace
  const updateWidget = async () => {
    const data = await fetchStreakData();
    updateUI(data.streak, data.total_days, container);
  };

  await updateWidget();

  // Reload periodically if container still exists
  container._streakInterval = setInterval(updateWidget, 5 * 60 * 1000);
}

// Helper (no longer needs to be async or fetch itself)
// Removed loadStreak generic function in favor of fetchStreakData + updateUI


function updateUI(streak, total) {
  const numEl = document.getElementById('streakNumber');
  const totalEl = document.getElementById('streakTotal');
  const msgEl = document.getElementById('streakMessage');

  if (numEl) numEl.textContent = streak;
  if (totalEl) totalEl.textContent = `Tổng cộng: ${total || 0} ngày`;

  if (msgEl) {
    if (streak === 0) {
      msgEl.textContent = '💪 Bắt đầu học ngay hôm nay nhé!';
      msgEl.style.color = '#777';
    } else if (streak < 3) {
      msgEl.textContent = '🌟 Khởi đầu tuyệt vời!';
      msgEl.style.color = '#4CAF50';
    } else if (streak < 7) {
      msgEl.textContent = '🔥 Bé đang rất chăm chỉ!';
      msgEl.style.color = '#FF9800';
    } else {
      msgEl.textContent = '🏆 Bé là Siêu Sao Học Tập!';
      msgEl.style.color = '#E91E63';
    }
  }
}

export function unmount(container) {
  if (container) {
    if (container._streakInterval) clearInterval(container._streakInterval);
    container.innerHTML = '';
  }
}