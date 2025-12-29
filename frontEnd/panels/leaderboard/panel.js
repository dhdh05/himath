export function mount(container) {
  if (!container) return;
  
  // 1. Load CSS
  if (!document.querySelector('link[data-panel="leaderboard"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = './panels/leaderboard/style.css'; 
      link.setAttribute('data-panel', 'leaderboard');
      document.head.appendChild(link);
  }

  // 2. Render HTML Layout (Giữ nguyên giao diện Card đẹp)
  container.innerHTML = `
    <div class="leaderboard-panel">
      <div class="leaderboard-card">
        
        <div class="card-header">
            <span class="header-icon">🏆</span>
            <h2>Bảng Xếp Hạng</h2>
        </div>

        <div id="leaderboardList">
          <div style="padding:40px; text-align:center; color:#888;">
             <div class="spinner"></div> Đang tải dữ liệu...
          </div>
        </div>

      </div>
    </div>
  `;
  
  loadLeaderboard();
}

async function loadLeaderboard() {
  const listEl = document.getElementById('leaderboardList');
  if (!listEl) return;
  
  try {
    // --- KHÔI PHỤC LOGIC KẾT NỐI CHUẨN ---
    // 1. Lấy URL từ config (nếu có) hoặc mặc định
    const apiUrl = window.API_CONFIG?.ENDPOINTS?.LEADERBOARD?.ALL || 'http://localhost:3000/api/leaderboard/all';
    
    // 2. Lấy Headers xác thực (Token) - QUAN TRỌNG
    const headers = window.getAuthHeaders ? window.getAuthHeaders() : { 'Content-Type': 'application/json' };

    const res = await fetch(apiUrl, { headers });
    
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    
    const data = await res.json();
    
    // Kiểm tra dữ liệu
    if (!data.success || !data.rankings || data.rankings.length === 0) {
      listEl.innerHTML = '<div style="padding:40px; text-align:center; color:#888;">Chưa có bảng xếp hạng nào.</div>';
      return;
    }

    // Lấy user hiện tại để highlight
    let currentUserId = null;
    try {
        const u = JSON.parse(localStorage.getItem('hm_user'));
        if(u) currentUserId = u.id || u.user_id;
    } catch(e){}

    // Render Bảng (Giữ nguyên style mới)
    let html = `
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th class="col-rank">#</th>
            <th class="col-name">Học Sinh</th>
            <th class="col-score">Điểm</th>
            <th class="col-stars">Sao</th>
            <th class="col-time">Thời Gian Học</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.rankings.forEach((item, index) => {
        const isMe = (currentUserId && item.user_id == currentUserId);
        const rank = index + 1;
        
        // Huy chương
        let medal = rank;
        if (rank === 1) medal = '🥇';
        if (rank === 2) medal = '🥈';
        if (rank === 3) medal = '🥉';
        
        const rankClass = rank <= 3 ? `rank-${rank}` : '';
        const name = item.full_name || item.username || 'Học sinh';
        const initial = name.charAt(0).toUpperCase();
        
        // Load avatar from localStorage
        const savedAvatar = localStorage.getItem(`avatar_${item.user_id}`);
        const avatarHTML = savedAvatar 
          ? `<img src="${savedAvatar}" alt="${name}" class="avatar-img" />`
          : `<span class="avatar-initial">${initial}</span>`;

        html += `
          <tr class="leaderboard-row ${isMe ? 'current-user' : ''}">
            <td class="col-rank ${rankClass}">
                <div class="rank-badge">${medal}</div>
            </td>
            <td class="col-name">
                <div class="user-info">
                    <div class="avatar">${avatarHTML}</div>
                    <div class="name-tag">${name}</div>
                </div>
            </td>
            <td class="col-score">
                <span class="score-value">${item.total_score}đ</span>
            </td>
            <td class="col-stars">
                <span class="stars-value">${item.total_stars} ⭐</span>
            </td>
            <td class="col-time">
                ${formatTime(item.total_time)}
            </td>
          </tr>
        `;
    });

    html += `</tbody></table>`;
    listEl.innerHTML = html;

  } catch (err) {
    console.error("Leaderboard Error:", err);
    // Hiển thị lỗi rõ ràng hơn
    listEl.innerHTML = `<div class="error">
        <p>⚠️ Không tải được dữ liệu.</p>
        <small style="color:#999">${err.message}</small>
    </div>`;
  }
}

function formatTime(s) {
    if(!s) return '0s';
    const h = Math.floor(s/3600);
    const m = Math.floor((s%3600)/60);
    const sec = s%60;
    if(h>0) return `${h}h ${m}p`;
    if(m>0) return `${m}p ${sec}s`;
    return `${sec}s`;
}

export function unmount(container) {
  if (container) container.innerHTML = '';
}