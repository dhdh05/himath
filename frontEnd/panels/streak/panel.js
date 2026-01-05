
// Export fetch function so main.js can use it for the header button
export async function fetchStreakData() {
  try {
    const headers = window.getAuthHeaders ? window.getAuthHeaders() : {};
    // Doi sang API check-in moi de dam bao tinh toan thoi gian thuc
    const apiUrl = 'http://localhost:3000/api/auth/check-in';

    const res = await fetch(apiUrl, {
      method: 'POST', // Check-in la POST
      headers: headers
    });

    if (!res.ok) throw new Error('API Error');
    const data = await res.json();

    // API check-in tra ve { success: true, streak: N }
    // Ta map vao cau truc ma panel nay mong doi
    return { streak: data.streak || 0, total_days: data.streak || 0 };
  } catch (error) {
    console.error('Loi streak:', error);
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
  // 2. TAO HTML (Horizontal Layout)
  container.innerHTML = `
    <div class="streak-widget">
      <!-- Cot Trai: Icon + So Ngay -->
      <div class="streak-left">
         <div class="streak-days-container">
            <div class="streak-number" id="streakNumber">--</div>
            <div class="streak-label">ngày liên tiếp</div>
         </div>
      </div>

      <!-- Cot Phai: Thong tin chi tiet -->
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