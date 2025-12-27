// // users panel removed per frontend-only instrumentation request.
// export function mount(container) { if (!container) return; container.innerHTML = '<div class="panel"><h2>Phụ huynh (tạm ẩn)</h2><p>Chức năng phụ huynh được đặt tạm thời ở chế độ frontend-only; backend sẽ cung cấp sau.</p></div>'; }
// export function unmount(container) { /* no-op */ }


export function mount(container) {
  if (!container) return;

  // --- 1. LẤY THÔNG TIN USER (Đưa lên đầu để dùng cho HTML) ---
  let currentUser = null;
  try { currentUser = JSON.parse(localStorage.getItem('hm_user')); } catch(e){}
  const studentId = currentUser ? (currentUser.id || currentUser.user_id) : 1;
  // Lấy tên hiển thị: ưu tiên name > full_name > username
  const showName = currentUser ? (currentUser.name || currentUser.full_name || currentUser.username) : "Khách";
  const showUsername = currentUser ? currentUser.username : "hocsinh";

  // --- 2. CSS STYLES ---
  if (!document.querySelector('style[data-panel="users"]')) {
    const style = document.createElement('style');
    style.setAttribute('data-panel', 'users');
    style.textContent = `
      .users-panel { padding: 20px; max-width: 800px; margin: 0 auto; color: #333; }
      
      /* PIN SCREEN */
      .pin-screen { text-align: center; padding-top: 50px; }
      .pin-input { 
        font-size: 30px; letter-spacing: 10px; width: 200px; text-align: center; 
        padding: 10px; border: 2px solid #ddd; border-radius: 10px; margin: 20px 0;
      }
      .pin-btn {
        background: #2196F3; color: white; border: none; padding: 10px 30px;
        font-size: 18px; border-radius: 20px; cursor: pointer;
      }
      .pin-error { color: red; margin-top: 10px; display: none; }

      /* DASHBOARD */
      .dashboard { animation: fadeIn 0.5s; }
      
      /* CARD: INFO */
      .user-card {
        display: flex; align-items: center; background: white; padding: 20px;
        border-radius: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); margin-bottom: 20px;
      }
      .avatar-circle {
        width: 60px; height: 60px; background: #FFC107; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 30px; color: white; margin-right: 20px;
      }
      .user-details h2 { margin: 0; font-size: 24px; color: #333; }
      .user-details p { margin: 5px 0 0; color: #666; }

      /* CARD: TIME STATUS BAR */
      .status-card {
        background: white; padding: 20px; border-radius: 15px; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.1); margin-bottom: 20px;
      }
      .status-title { font-weight: bold; margin-bottom: 10px; display: flex; justify-content: space-between; }
      .progress-bg { height: 20px; background: #eee; border-radius: 10px; overflow: hidden; position: relative; }
      .progress-fill { height: 100%; width: 0%; transition: width 1s ease, background 0.5s; }
      .status-message { margin-top: 10px; font-weight: bold; text-align: center; }
      
      /* Colors */
      .color-low { background: #FF9800; }
      .color-good { background: #4CAF50; }
      .color-high { background: #F44336; }

      /* TABLE: HISTORY */
      .history-card {
        background: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      }
      .history-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      .history-table th { text-align: left; color: #888; padding: 10px; border-bottom: 2px solid #eee; }
      .history-table td { padding: 10px; border-bottom: 1px solid #eee; }
      .tag { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
      .tag-game { background: #E3F2FD; color: #2196F3; }
      
      @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    `;
    document.head.appendChild(style);
  }

  // --- 3. HTML STRUCTURE ---
  container.innerHTML = `
    <div class="users-panel">
      <div id="pinScreen" class="pin-screen">
        <div style="font-size: 50px; margin-bottom: 10px;">🔒</div>
        <h2>Khu vực Phụ Huynh</h2>
        
        <p style="color:#666; margin-bottom:20px;">
           Vui lòng nhập mã PIN của bé <strong>${showName}</strong>
        </p>

        <input type="password" id="pinInput" class="pin-input" maxlength="4" placeholder="****" />
        <br>
        <button id="verifyBtn" class="pin-btn">Truy cập</button>
        <div id="pinError" class="pin-error">Mã PIN không đúng!</div>
      </div>

      <div id="dashboard" class="dashboard" style="display: none;">
        
        <div class="user-card">
          <div class="avatar-circle"><i class="fas fa-user-graduate"></i></div>
          <div class="user-details">
            <h2 id="userNameDisplay">${showName}</h2>
            <p>Tài khoản: <span id="userUsernameDisplay">${showUsername}</span></p>
          </div>
          <button id="logoutParentBtn" style="margin-left: auto; border:none; background:none; color:#999; cursor:pointer;">
            <i class="fas fa-sign-out-alt"></i> Thoát
          </button>
        </div>

        <div class="status-card">
          <div class="status-title">
            <span>Thời gian học hôm nay</span>
            <span id="todayTime">0 phút</span>
          </div>
          <div class="progress-bg">
            <div id="progressBar" class="progress-fill" style="width: 0%"></div>
          </div>
          <div id="statusMessage" class="status-message">Đang tải...</div>
          <div style="margin-top:5px; font-size:12px; color:#888; display:flex; justify-content:space-between;">
             <span>0p</span><span>15p (Đạt)</span><span>45p (Nhiều)</span>
          </div>
        </div>

        <div class="history-card">
          <h3>📊 Lịch sử hoạt động</h3>
          <table class="history-table">
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Môn học</th>
                <th>Điểm</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody id="historyBody">
              <tr><td colspan="4" style="text-align:center">Đang tải dữ liệu...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // --- 4. LOGIC XỬ LÝ (Events & API) ---
  const qs = sel => container.querySelector(sel);
  const pinScreen = qs('#pinScreen');
  const dashboard = qs('#dashboard');
  const pinInput = qs('#pinInput');
  const verifyBtn = qs('#verifyBtn');
  const pinError = qs('#pinError');
  
  // A. XỬ LÝ MÃ PIN
  verifyBtn.addEventListener('click', async () => {
    const pin = pinInput.value;
    if (pin.length < 4) return;

    try {
      // Gọi API Verify PIN
      const res = await fetch('http://localhost:3000/api/parents/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, pin: pin })
      });
      const data = await res.json();

      if (data.success) {
        showDashboard();
      } else {
        showError('Mã PIN không đúng!');
      }
    } catch (err) {
      console.error(err);
      // Fallback offline (chỉ dùng khi mất mạng)
      if (pin === '1234') showDashboard(); 
      else showError('Lỗi kết nối hoặc sai PIN');
    }
  });

  function showError(msg) {
    pinError.textContent = msg;
    pinError.style.display = 'block';
    pinInput.value = '';
    pinInput.focus();
  }

  // B. HIỂN THỊ DASHBOARD
  function showDashboard() {
    pinScreen.style.display = 'none';
    dashboard.style.display = 'block';
    loadStats();
  }

  qs('#logoutParentBtn').addEventListener('click', () => {
    dashboard.style.display = 'none';
    pinScreen.style.display = 'block';
    pinInput.value = '';
    pinError.style.display = 'none';
  });

  async function loadStats() {
    try {
      const res = await fetch(`http://localhost:3000/api/parents/stats/${studentId}`);
      const json = await res.json();
      
      if (json.success) {
        renderHistory(json.data);
        calculateTodayProgress(json.data);
      }
    } catch (err) {
      console.error("Lỗi tải thống kê:", err);
      qs('#historyBody').innerHTML = '<tr><td colspan="4">Không thể kết nối Server.</td></tr>';
    }
  }

  // C. RENDER BẢNG LỊCH SỬ
  function renderHistory(data) {
    const tbody = qs('#historyBody');
    tbody.innerHTML = '';

    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">Bé chưa chơi game nào.</td></tr>';
      return;
    }

    // Giới hạn 10 dòng
    data.slice(0, 10).forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.play_date}</td>
        <td><span class="tag tag-game">${formatGameName(row.game_type)}</span></td>
        <td style="font-weight:bold; color:${row.total_score >= 80 ? 'green' : 'orange'}">${row.total_score}đ</td>
        <td>${row.total_time}s</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // D. TÍNH TOÁN THANH TRẠNG THÁI
  function calculateTodayProgress(data) {
    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear();
    const todayStr = `${d}/${m}/${y}`;

    const todayStats = data.filter(item => item.play_date === todayStr);
    
    const totalSeconds = todayStats.reduce((sum, item) => sum + parseInt(item.total_time), 0);
    const totalMinutes = Math.floor(totalSeconds / 60);

    qs('#todayTime').textContent = `${totalMinutes} phút`;
    
    const bar = qs('#progressBar');
    const msg = qs('#statusMessage');

    let percent = Math.min((totalMinutes / 60) * 100, 100);
    if (totalMinutes === 0 && totalSeconds > 0) percent = 5;

    bar.style.width = `${percent}%`;

    if (totalMinutes < 15) {
        bar.className = 'progress-fill color-low';
        msg.textContent = "🚀 Bé cần luyện tập thêm một chút nữa nhé!";
        msg.style.color = "#FF9800";
    } else if (totalMinutes <= 45) {
        bar.className = 'progress-fill color-good';
        msg.textContent = "✅ Tuyệt vời! Bé đã học tập rất chăm chỉ.";
        msg.style.color = "#4CAF50";
    } else {
        bar.className = 'progress-fill color-high';
        msg.textContent = "⚠️ Chú ý: Nên cho mắt nghỉ ngơi thôi!";
        msg.style.color = "#F44336";
    }
  }

  function formatGameName(type) {
    const map = {
        'dino-math': 'Khủng Long',
        'dem-so': 'Đếm Hình',
        'ghep-so': 'Ghép Số',
        'chan-le': 'Chẵn Lẻ',
        'so-sanh': 'So Sánh',
        'xep-so': 'Xếp Số',
        'tinh-toan': 'Tính Toán',
        'practice-nhan-ngon': 'Nhận Ngón'
    };
    return map[type] || type;
  }
}

export function unmount(container) {
  // Cleanup if needed
}