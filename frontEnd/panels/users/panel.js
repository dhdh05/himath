
export function mount(container) {
  if (!container) return;

  // --- 1. LAY THONG TIN USER ---
  let currentUser = null;
  try { currentUser = JSON.parse(localStorage.getItem('hm_user')); } catch (e) { }
  const studentId = currentUser ? (currentUser.id || currentUser.user_id) : 1;
  const showName = currentUser ? (currentUser.name || currentUser.full_name || currentUser.username) : "Khách";
  const showUsername = currentUser ? currentUser.username : "hocsinh";

  const showDob = currentUser && currentUser.dob
    ? new Date(currentUser.dob).toLocaleDateString('vi-VN')
    : "Chưa cập nhật";

  // --- 2. LOAD EXTERNAL CSS ---
  if (!document.querySelector('link[href="./panels/users/style.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './panels/users/style.css';
    document.head.appendChild(link);
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
        <div style="margin-top:8px;">
            <a href="#" id="forgotPinLink" style="font-size:13px; color:#007bff; text-decoration:none;">Quên PIN?</a>
        </div>
        <div id="pinError" class="pin-error">Mã PIN không đúng!</div>

        <!-- Reset PIN UI -->
        <div id="resetPinArea" style="display:none; margin-top:15px; border-top:1px dashed #ccc; padding-top:15px;">
             <!-- Step 1 -->
             <div id="resetPinStep1">
                 <p style="font-size:14px; margin-bottom:8px;">Gửi mã xác thực về email của bạn?</p>
                 <button id="sendPinOtpBtn" class="small-btn" style="background:#007bff; color:#fff;">Gửi mã</button>
                 <button id="cancelPinReset" class="small-btn" style="background:#ccc;">Hủy</button>
             </div>
             <!-- Step 2 -->
             <div id="resetPinStep2" style="display:none; display:flex; flex-direction:column; gap:8px; align-items:center;">
                 <input type="text" id="pinOtpInput" placeholder="Nhập mã OTP" class="pin-input" style="font-size:16px; width:140px; height:36px;" />
                 <input type="text" id="newPinInput" placeholder="PIN Mới (4 số)" class="pin-input" maxlength="4" style="font-size:16px; width:140px; height:36px;" />
                 <button id="submitPinResetBtn" class="pin-btn" style="width:140px; background:#28a745; font-size:14px;">Đổi PIN</button>
             </div>
             <div id="resetPinMsg" style="font-size:12px; margin-top:5px;"></div>
        </div>
      </div>

      <div id="changePinModal" class="modal-backdrop" style="display:none;">
        <div class="modal-pretty" role="dialog">
             <!-- Decorative Butterfly -->
             <div class="butterfly-deco butterfly-bottom">🦋</div>

             <button class="modal__close-btn" id="closeChangeChangePinModal">
                <i class="fas fa-times"></i>
             </button>
             
             <div class="modal-header">
                <h3>Đổi Mã PIN</h3>
                <p>Nhập mã PIN hiện tại và OTP để thiết lập PIN mới.</p>
             </div>
             
             <!-- FORM -->
             <div class="form-group" style="position:relative;">
                <label>PIN Cũ</label>
                <input type="password" id="cp_oldPin" class="pretty-input" maxlength="4" placeholder="• • • •" />
             </div>

             <div class="form-group" style="margin-top:15px;">
                <label>PIN Mới</label>
                <input type="password" id="cp_newPin" class="pretty-input" maxlength="4" placeholder="• • • •" />
             </div>

             <div class="form-group" style="margin-top:15px;">
                <label>Xác nhận PIN Mới</label>
                <input type="password" id="cp_confirmPin" class="pretty-input" maxlength="4" placeholder="• • • •" />
             </div>

             <div class="form-group" style="margin-top:20px; padding-top:15px; border-top: 1px dashed #eee;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <label style="margin:0;">Mã OTP (Email)</label>
                    <button id="cp_sendOtpBtn" class="btn-small-pretty">Lấy mã OTP</button>
                </div>
                <input type="text" id="cp_otp" class="pretty-input" placeholder="Nhập 6 số OTP" style="letter-spacing: 2px; text-align:center; font-weight:bold;" />
             </div>

             <div id="cp_msg" style="font-size:13px; margin: 15px 0; min-height:18px; text-align:center; font-weight:600;"></div>

             <button id="cp_submitBtn" class="btn-primary-pretty">Lưu Thay Đổi</button>
        </div>
      </div>
      
      <div id="dashboard" class="dashboard" style="display: none;">
        
        <div class="user-card">
          <div class="avatar-circle" id="userAvatar"><i class="fas fa-user-graduate"></i></div>
          <div class="user-details">
            <h2 id="userNameDisplay">${showName}</h2>
            <p>Tài khoản: <span id="userUsernameDisplay">${showUsername}</span></p>
            <p>
                Ngày sinh: <span id="userDobDisplay" style="font-weight:600; color:#444;">${showDob}</span>
                <a href="#" id="editDobBtn" title="Cập nhật ngày sinh" style="font-size:12px; margin-left:5px; color:#666;"><i class="fas fa-edit"></i></a>
            </p>
            <div id="editDobArea" style="display:none; margin-left:0px; margin-bottom:10px;">
                <input type="date" id="newDobInput" style="border:1px solid #ccc; border-radius:4px; padding:4px;" />
                <button id="saveDobBtn" style="cursor:pointer; color:green; border:1px solid green; background:#e8f5e9; border-radius:4px; padding:2px 8px; margin-left:5px;">Lưu</button>
                <button id="cancelDobBtn" style="cursor:pointer; color:red; border:1px solid red; background:#ffebee; border-radius:4px; padding:2px 8px; margin-left:5px;">Hủy</button>
            </div>
          </div>
          <button id="changePinBtn" style="margin-left: auto; margin-right: 10px; border:none; background:none; color:#007bff; cursor:pointer;" title="Đổi mã PIN">
            <i class="fas fa-key"></i> Đổi PIN
          </button>
          <button id="logoutParentBtn" style="border:none; background:none; color:#999; cursor:pointer;" title="Thoát chế độ phụ huynh">
            <i class="fas fa-sign-out-alt"></i> Thoát
          </button>
        </div>

        <script>
            // Inline checks for avatar - this might be safer done in the logic section below
        </script>

        <!-- Tab Navigation -->
        <div class="tabs">
          <button class="tab-btn active" data-tab="dashboard-tab">Tổng quan</button>
          <button class="tab-btn" data-tab="notifications-tab">Thông báo <span id="notifBadge" class="badge">0</span></button>
          <button class="tab-btn" data-tab="goals-tab">Mục tiêu</button>
        </div>

        <!-- Tab Content: Dashboard (Existing) -->
        <div id="dashboard-tab" class="tab-content active">
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

        <!-- Tab Content: Notifications -->
        <div id="notifications-tab" class="tab-content" style="display:none;">
           <div class="card-section">
             <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3>🔔 Thông báo mới nhất</h3>
                <button id="refreshNotifBtn" class="small-btn"><i class="fas fa-sync"></i></button>
             </div>
             <div id="notificationsList" class="notifications-list">
                <!-- Items will be injected here -->
                <div style="text-align:center; color:#888;">Đang tải...</div>
             </div>
           </div>
        </div>

        <!-- Tab Content: Goals -->
        <div id="goals-tab" class="tab-content" style="display:none;">
           <div class="card-section">
             <h3>🎯 Mục tiêu học tập</h3>
             
             <!-- Add Goal Form -->
             <div class="add-goal-form">
               <input type="text" id="goalTarget" placeholder="Nhập mục tiêu (VD: 50)" style="width: 100px; padding: 5px;">
               <select id="goalType" style="padding: 5px;">
                 <option value="stars">Sao</option>
                 <option value="time">Phút</option>
                 <option value="score">Điểm</option>
               </select>
               <button id="addGoalBtn" class="action-btn">Thêm</button>
             </div>

             <div id="goalsList" class="goals-list">
                <!-- Items will be injected here -->
             </div>
           </div>
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
  const userAvatar = qs('#userAvatar');

  // LOAD AVATAR
  if (userAvatar && studentId) {
    const savedAvatar = localStorage.getItem(`avatar_${studentId}`);
    if (savedAvatar) {
      userAvatar.innerHTML = '';
      userAvatar.style.backgroundImage = `url(${savedAvatar})`;
      userAvatar.style.backgroundSize = 'cover';
      userAvatar.style.backgroundPosition = 'center';
      userAvatar.style.backgroundColor = 'transparent';
    }
  }

  // A. XỬ LÝ MÃ PIN
  pinInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') verifyBtn.click();
  });

  verifyBtn.addEventListener('click', async () => {
    const pin = pinInput.value;
    if (pin.length < 4) return;

    try {
      // Goi API Verify PIN
      const apiUrl = window.API_CONFIG?.ENDPOINTS?.PARENTS?.VERIFY_PIN || '/api/parents/verify-pin';
      const headers = window.getAuthHeaders ? window.getAuthHeaders() : { 'Content-Type': 'application/json' };
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
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
      // Fallback offline (chi dung khi mat mang)
      if (pin === '1234') showDashboard();
      else showError('Lỗi kết nối hoặc sai PIN');
    }
  });

  // A2. XU LY QUEN PIN
  const forgotLink = qs('#forgotPinLink');
  const resetArea = qs('#resetPinArea');
  const step1 = qs('#resetPinStep1');
  const step2 = qs('#resetPinStep2');
  const msgDiv = qs('#resetPinMsg');

  forgotLink.addEventListener('click', (e) => {
    e.preventDefault();
    resetArea.style.display = 'block';
    step1.style.display = 'block';
    step2.style.display = 'none';
    msgDiv.textContent = '';
  });

  qs('#cancelPinReset').addEventListener('click', () => {
    resetArea.style.display = 'none';
  });

  qs('#sendPinOtpBtn').addEventListener('click', async () => {
    msgDiv.textContent = 'Đang gửi...';
    try {
      const apiUrl = window.API_CONFIG?.ENDPOINTS?.AUTH?.FORGOT_PIN || '/api/auth/forgot-pin';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: studentId })
      });
      const data = await res.json();
      if (data.success) {
        msgDiv.textContent = '✅ Đã gửi OTP. Kiểm tra email!';
        msgDiv.style.color = 'green';
        step1.style.display = 'none';
        step2.style.display = 'flex';
      } else {
        msgDiv.textContent = '❌ ' + data.message;
        msgDiv.style.color = 'red';
      }
    } catch (e) {
      msgDiv.textContent = '❌ Lỗi kết nối';
    }
  });

  qs('#submitPinResetBtn').addEventListener('click', async () => {
    const otp = qs('#pinOtpInput').value;
    const newPin = qs('#newPinInput').value;
    if (!otp || newPin.length < 4) {
      msgDiv.textContent = 'Vui lòng nhập đủ thông tin';
      return;
    }

    msgDiv.textContent = 'Đang xử lý...';
    try {
      const apiUrl = window.API_CONFIG?.ENDPOINTS?.AUTH?.RESET_PIN_OTP || '/api/auth/reset-pin-otp';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: studentId, otp, new_pin: newPin })
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ Đổi PIN thành công! Vui lòng nhập PIN mới để truy cập.');
        resetArea.style.display = 'none';
        // Reset form
        qs('#pinOtpInput').value = '';
        qs('#newPinInput').value = '';
      } else {
        msgDiv.textContent = '❌ ' + data.message;
        msgDiv.style.color = 'red';
      }
    } catch (e) {
      msgDiv.textContent = '❌ Lỗi kết nối';
    }
  });

  // A3. XU LY CAP NHAT NGAY SINH
  const editDobBtn = qs('#editDobBtn');
  const editDobArea = qs('#editDobArea');
  const newDobInput = qs('#newDobInput');

  if (editDobBtn) {
    editDobBtn.addEventListener('click', (e) => {
      e.preventDefault();
      editDobArea.style.display = 'inline-block';
      // Pre-fill current date if valid
      if (currentUser && currentUser.dob) {
        try {
          newDobInput.value = new Date(currentUser.dob).toISOString().split('T')[0];
        } catch (e) { }
      }
    });
  }

  const cancelDobBtn = qs('#cancelDobBtn');
  if (cancelDobBtn) {
    cancelDobBtn.addEventListener('click', () => {
      editDobArea.style.display = 'none';
    });
  }

  const saveDobBtn = qs('#saveDobBtn');
  if (saveDobBtn) {
    saveDobBtn.addEventListener('click', async () => {
      const newDob = newDobInput.value;
      if (!newDob) return alert("Vui lòng chọn ngày sinh!");

      try {
        const apiUrl = window.API_CONFIG?.ENDPOINTS?.AUTH?.UPDATE_INFO || '/api/auth/update-info';
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: studentId, dob: newDob })
        });
        const data = await res.json();
        if (data.success) {
          alert("✅ Cập nhật ngày sinh thành công!");

          // Update UI
          qs('#userDobDisplay').textContent = new Date(newDob).toLocaleDateString('vi-VN');
          editDobArea.style.display = 'none';

          // Update LocalStorage
          if (currentUser) {
            currentUser.dob = newDob;
            localStorage.setItem('hm_user', JSON.stringify(currentUser));
          }
        } else {
          alert("❌ " + data.message);
        }
      } catch (e) {
        alert("❌ Lỗi kết nối server");
      }
    });
  }

  function showError(msg) {
    pinError.textContent = msg;
    pinError.style.display = 'block';
    pinInput.value = '';
    pinInput.focus();
  }

  // B. HIEN THI DASHBOARD
  function showDashboard() {
    pinScreen.style.display = 'none';
    dashboard.style.display = 'block';
    loadStats();

    // NEW FOR PHASE 3:
    setupTabs();
    loadNotifications();
    loadGoals();
  }

  // --- NEW LOGIC FOR PHASE 3 ---

  // 1. TABS LOGIC
  function setupTabs() {
    const tabBtns = container.querySelectorAll('.tab-btn');
    const tabContents = container.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
      btn.onclick = () => {
        // Remove active classes
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => {
          c.style.display = 'none';
          c.classList.remove('active');
        });

        // Add active class
        btn.classList.add('active');
        const target = qs(`#${btn.dataset.tab}`);
        if (target) {
          target.style.display = 'block';
          target.classList.add('active');
        }
      };
    });
  }

  // 2. NOTIFICATIONS LOGIC
  async function loadNotifications() {
    const list = qs('#notificationsList');
    const badge = qs('#notifBadge');

    try {
      const headers = window.getAuthHeaders ? window.getAuthHeaders() : {};
      const res = await fetch('http://localhost:3000/api/notifications', { headers });
      const json = await res.json();

      if (json.success && json.notifications) {
        const notifs = json.notifications;

        // Count unread
        const unreadCount = notifs.filter(n => !n.is_read).length;
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';

        // Render list
        if (notifs.length === 0) {
          list.innerHTML = '<div style="text-align:center; padding:20px; color:#888">Chưa có thông báo nào</div>';
          return;
        }

        list.innerHTML = notifs.map(n => `
                <div class="notif-item ${n.is_read ? '' : 'unread'}" onclick="markRead(${n.notification_id}, this)">
                    <div class="notif-icon">
                        <i class="fas ${getIconForType(n.type)}"></i>
                    </div>
                    <div class="notif-content">
                        <h4>${getTitleForType(n.type)}</h4>
                        <p>${n.message}</p>
                        <div class="notif-time">${new Date(n.created_at).toLocaleString('vi-VN')}</div>
                    </div>
                </div>
            `).join('');
      }
    } catch (e) {
      console.error('Load notifs error:', e);
      list.innerHTML = '<div style="color:red; text-align:center">Lỗi tải thông báo</div>';
    }
  }

  function getIconForType(type) {
    if (type === 'progress') return 'fa-chart-line';
    if (type === 'test_result') return 'fa-clipboard-check';
    if (type === 'reminder') return 'fa-bell';
    return 'fa-info-circle';
  }

  function getTitleForType(type) {
    if (type === 'progress') return 'Tiến độ học tập';
    if (type === 'test_result') return 'Kết quả kiểm tra';
    if (type === 'reminder') return 'Nhắc nhở';
    return 'Thông báo hệ thống';
  }

  qs('#refreshNotifBtn').onclick = loadNotifications;

  // 3. GOALS LOGIC
  async function loadGoals() {
    const list = qs('#goalsList');
    try {
      const headers = window.getAuthHeaders ? window.getAuthHeaders() : {};
      // Pass studentId to get specific student goals
      const res = await fetch(`http://localhost:3000/api/goals/${studentId}`, { headers });
      const json = await res.json();

      if (json.success && json.goals) {
        if (json.goals.length === 0) {
          list.innerHTML = '<div style="text-align:center; padding:20px; color:#888">Chưa có mục tiêu nào. Hãy tạo một cái nhé!</div>';
          return;
        }

        list.innerHTML = json.goals.map(g => `
                <div class="goal-item">
                    <div>
                        <div style="font-weight:bold">${formatGoalType(g.goal_type)}: ${g.target_value}</div>
                        <div style="font-size:12px; color:#666">Ngày tạo: ${new Date(g.created_at).toLocaleDateString()}</div>
                    </div>
                    <div style="text-align:right">
                         <span class="badge" style="background:${g.status === 'completed' ? '#4CAF50' : '#FF9800'}">
                            ${g.status === 'completed' ? 'Hoàn thành' : 'Đang thực hiện'}
                         </span>
                    </div>
                </div>
            `).join('');
      }
    } catch (e) {
      console.error('Load goals error:', e);
    }
  }

  function formatGoalType(type) {
    if (type === 'stars') return '⭐ Thu thập Sao';
    if (type === 'time') return '⏱️ Thời gian học (phút)';
    return '🏆 Điểm số';
  }

  qs('#addGoalBtn').onclick = async () => {
    const type = qs('#goalType').value;
    const target = qs('#goalTarget').value;

    if (!target) return alert('Vui lòng nhập mục tiêu!');

    try {
      const headers = window.getAuthHeaders ? window.getAuthHeaders() : { 'Content-Type': 'application/json' };
      if (!headers['Content-Type']) headers['Content-Type'] = 'application/json';

      const res = await fetch('http://localhost:3000/api/goals', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          goal_type: type,
          target_value: target,
          student_id: studentId
        })
      });

      const json = await res.json();
      if (json.success) {
        alert('Thêm mục tiêu thành công!');
        qs('#goalTarget').value = '';
        loadGoals(); // Reload list
      } else {
        alert('Lỗi: ' + json.message);
      }
    } catch (e) {
      alert('Lỗi kết nối!');
      console.error(e);
    }
  };


  qs('#logoutParentBtn').addEventListener('click', () => {
    dashboard.style.display = 'none';
    pinScreen.style.display = 'block';
    pinInput.value = '';
    pinError.style.display = 'none';
  });

  // CHANGE PIN MODAL LOGIC
  const changePinModal = qs('#changePinModal');
  const closeChangePinBtn = qs('#closeChangeChangePinModal');
  const changePinBtn = qs('#changePinBtn');

  // Input Fields
  const cp_oldPin = qs('#cp_oldPin');
  const cp_newPin = qs('#cp_newPin');
  const cp_confirmPin = qs('#cp_confirmPin');
  const cp_otp = qs('#cp_otp');
  const cp_msg = qs('#cp_msg');
  const cp_sendOtpBtn = qs('#cp_sendOtpBtn');
  const cp_submitBtn = qs('#cp_submitBtn');

  if (changePinBtn) {
    changePinBtn.addEventListener('click', () => {
      // Show Modal
      changePinModal.style.display = 'flex'; // Flex to center

      // Reset Fields
      cp_oldPin.value = '';
      cp_newPin.value = '';
      cp_confirmPin.value = '';
      cp_otp.value = '';
      cp_msg.textContent = '';
      cp_msg.style.color = '#333';
    });
  }

  if (closeChangePinBtn) {
    closeChangePinBtn.addEventListener('click', () => {
      changePinModal.style.display = 'none';
    });
  }

  // SEND OTP for Change PIN
  if (cp_sendOtpBtn) {
    cp_sendOtpBtn.addEventListener('click', async () => {
      cp_msg.textContent = 'Đang gửi OTP (chờ xíu)...';
      cp_msg.style.color = 'blue';

      // Timeout Controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 giay timeout

      try {
        const apiUrl = window.API_CONFIG?.ENDPOINTS?.AUTH?.FORGOT_PIN || '/api/auth/forgot-pin';
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: studentId }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        const data = await res.json();
        if (data.success) {
          cp_msg.textContent = '✅ Đã gửi OTP về email.';
          cp_msg.style.color = 'green';
        } else {
          cp_msg.textContent = '❌ ' + data.message;
          cp_msg.style.color = 'red';
        }
      } catch (e) {
        if (e.name === 'AbortError') {
          cp_msg.textContent = '⚠️ Server phản hồi lâu. Hãy thử lại!';
        } else {
          cp_msg.textContent = '❌ Lỗi kết nối server';
        }
        cp_msg.style.color = 'red';
      }
    });
  }

  // SUBMIT CHANGE PIN
  if (cp_submitBtn) {
    cp_submitBtn.addEventListener('click', async () => {
      const oldPin = cp_oldPin.value;
      const newPin = cp_newPin.value;
      const confirmPin = cp_confirmPin.value;
      const otp = cp_otp.value;

      if (newPin.length < 4 || confirmPin.length < 4) {
        cp_msg.textContent = 'PIN mới phải có 4 số';
        cp_msg.style.color = 'red';
        return;
      }
      if (newPin !== confirmPin) {
        cp_msg.textContent = 'Xác nhận PIN không khớp';
        cp_msg.style.color = 'red';
        return;
      }
      if (!otp) {
        cp_msg.textContent = 'Vui lòng nhập OTP';
        cp_msg.style.color = 'red';
        return;
      }

      cp_msg.textContent = 'Đang xử lý...';

      // 1. Verify OLD PIN First (Optional but requested "Nhap PIN cu")
      // Since we don't have a combined API, we call verify-pin first
      try {
        if (oldPin) {
          const apiUrl = window.API_CONFIG?.ENDPOINTS?.PARENTS?.VERIFY_PIN || '/api/parents/verify-pin';
          const vRes = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_id: studentId, pin: oldPin })
          });
          const vData = await vRes.json();
          if (!vData.success) {
            cp_msg.textContent = '❌ PIN cũ không đúng!';
            cp_msg.style.color = 'red';
            return;
          }
        } else {
          cp_msg.textContent = 'Vui lòng nhập PIN cũ';
          cp_msg.style.color = 'red';
          return;
        }

        // 2. If Old PIN OK, Call Reset PIN with OTP
        const apiUrl = window.API_CONFIG?.ENDPOINTS?.AUTH?.RESET_PIN_OTP || '/api/auth/reset-pin-otp';
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: studentId, otp, new_pin: newPin })
        });

        const data = await res.json();
        if (data.success) {
          alert('✅ Đổi PIN thành công!');
          changePinModal.style.display = 'none';
          // Logout to force re-login with new PIN
          qs('#logoutParentBtn').click();
        } else {
          cp_msg.textContent = '❌ ' + data.message; // Likely wrong OTP
          cp_msg.style.color = 'red';
        }

      } catch (e) {
        console.error(e);
        cp_msg.textContent = '❌ Lỗi hệ thống';
        cp_msg.style.color = 'red';
      }
    });
  }

  async function loadStats() {
    try {
      const apiUrl = window.API_CONFIG?.ENDPOINTS?.PARENTS?.STATS?.(studentId) || `/api/parents/stats/${studentId}`;
      const headers = window.getAuthHeaders ? window.getAuthHeaders() : { 'Content-Type': 'application/json' };

      console.log('📊 Loading stats for student:', studentId);
      console.log('📊 API URL:', apiUrl);

      const res = await fetch(apiUrl, {
        headers: headers
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();
      console.log('📊 Stats response:', json);

      if (json.success && json.data) {
        console.log('📊 Data received:', json.data);
        renderHistory(json.data);
        calculateTodayProgress(json.data);
      } else {
        console.warn('📊 No data or success=false:', json);
        qs('#historyBody').innerHTML = '<tr><td colspan="4" style="text-align:center">Bé chưa chơi game nào.</td></tr>';
        qs('#todayTime').textContent = '0 phút';
        qs('#progressBar').style.width = '0%';
        qs('#statusMessage').textContent = '🚀 Bé cần luyện tập thêm một chút nữa nhé!';
        qs('#statusMessage').style.color = '#FF9800';
      }
    } catch (err) {
      console.error("❌ Loi tai thong ke:", err);
      qs('#historyBody').innerHTML = '<tr><td colspan="4" style="text-align:center; color:red;">Không thể kết nối Server. Vui lòng kiểm tra lại.</td></tr>';
      qs('#todayTime').textContent = '0 phút';
      qs('#progressBar').style.width = '0%';
      qs('#statusMessage').textContent = '⚠️ Không thể tải dữ liệu';
      qs('#statusMessage').style.color = '#F44336';
    }
  }

  // C. RENDER BANG LICH SU
  function renderHistory(data) {
    const tbody = qs('#historyBody');
    tbody.innerHTML = '';

    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">Bé chưa chơi game nào.</td></tr>';
      return;
    }

    // Gioi han 50 dong (tang len de user de thay)
    data.slice(0, 50).forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.play_date}</td>
        <td><span class="tag tag-game">${formatGameName(row.game_type)}</span></td>
        <td style="font-weight:bold; color:${row.total_score >= 80 ? 'green' : 'orange'}">${row.total_score}đ</td>
        <td>${formatTimeSmart(row.total_time)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function formatTimeSmart(seconds) {
    const sVal = parseInt(seconds) || 0;
    if (sVal === 0) return '0s';

    const h = Math.floor(sVal / 3600);
    const m = Math.floor((sVal % 3600) / 60);
    const s = sVal % 60;

    const parts = [];
    if (h > 0) parts.push(`${h}g`);
    if (m > 0) parts.push(`${m}p`);
    if (s > 0 || parts.length === 0) parts.push(`${s}s`);

    return parts.join(' ');
  }

  // D. TINH TOAN THANH TRANG THAI
  function calculateTodayProgress(data) {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log('📊 No data to calculate progress');
      qs('#todayTime').textContent = '0 phút';
      qs('#progressBar').style.width = '0%';
      qs('#progressBar').className = 'progress-fill color-low';
      qs('#statusMessage').textContent = '🚀 Bé cần luyện tập thêm một chút nữa nhé!';
      qs('#statusMessage').style.color = '#FF9800';
      return;
    }

    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear();
    const todayStr = `${d}/${m}/${y}`;

    const todayStats = data.filter(item => {
      const playDate = item.play_date ? String(item.play_date).trim() : '';
      return playDate === todayStr;
    });

    const totalSeconds = todayStats.reduce((sum, item) => {
      const time = parseInt(item.total_time) || 0;
      return sum + time;
    }, 0);
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
      'practice-nhan-ngon': 'Nhận Ngón',
      'learning': 'Xem Video',
      'practice-viet-so': 'Tập Viết Số',
      'viet-so': 'Tập Viết Số',
      'hoc-chu-so': 'Học Chữ Số',
      'hoc-so': 'Học Chữ Số',
      'keo-co': 'Kéo Co',
      'practice-keo-co': 'Kéo Co',
      'hung-tao': 'Hứng Táo',
      'games': 'Trò Chơi',
      'about-us': 'About Us'
    };
    return map[type] || type;
  }
}

export function unmount(container) {
  // Cleanup if needed
}