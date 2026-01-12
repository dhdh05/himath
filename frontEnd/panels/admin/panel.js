export function mount(container) {
  if (!container) return;

  // Ensuring CSS
  if (!document.querySelector('link[data-panel="admin"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './panels/admin/style.css';
    link.setAttribute('data-panel', 'admin');
    document.head.appendChild(link);
  }

  container.innerHTML = `
        <div class="admin-dashboard">
          <header class="admin-header">
            <h1>🛡️ Trang Quản Trị Hệ Thống</h1>
            <p>Admin Dashboard</p>
          </header>
  
          <!-- TABS -->
          <div class="admin-tabs">
             <button class="admin-tab active" data-tab="dashboard">Tổng Quan & Người Dùng</button>
             <button class="admin-tab" data-tab="logs">Lịch sử đăng nhập</button>
          </div>
  
          <!-- TAB CONTENT: DASHBOARD -->
          <div id="tab-dashboard" class="tab-content active">
              <div class="stats-grid">
                <div class="stat-card">
                  <h3>Tổng Người Dùng</h3>
                  <div class="stat-value" id="admTotalUsers">...</div>
                </div>
                <div class="stat-card">
                  <h3>Lượt Chơi Game</h3>
                  <div class="stat-value" id="admTotalGames">...</div>
                </div>
                <div class="stat-card">
                  <h3>Online Hôm Nay</h3>
                  <div class="stat-value" id="admActiveToday">...</div>
                </div>
              </div>
  
              <div class="users-section">
                <h2>📋 Danh sách người dùng</h2>
                <div class="table-actions">
                  <input type="text" id="userSearch" placeholder="Tìm kiếm user..." class="search-input">
                  <button id="refreshBtn" class="refresh-btn"><i class="fas fa-sync"></i> Làm mới</button>
                </div>
                <div class="table-container">
                  <table class="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Tên hiển thị</th>
                        <th>Email</th>
                        <th>Vai trò</th>
                        <th>Ngày tạo</th>
                        <th>PIN</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody id="userTableBody">
                      <tr><td colspan="9" style="text-align:center">Đang tải dữ liệu...</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
          </div>
  
          <!-- TAB CONTENT: LOGIN LOGS -->
          <div id="tab-logs" class="tab-content" style="display:none;">
             <div class="users-section">
                <h2>🕒 Lịch sử đăng nhập hệ thống</h2>
                <button id="refreshLogsBtn" class="refresh-btn" style="margin-bottom:15px;"><i class="fas fa-sync"></i> Tải lại log</button>
                <div class="table-container">
                  <table class="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Role</th>
                        <th>Thời gian</th>
                        <th>IP</th>
                      </tr>
                    </thead>
                    <tbody id="logsTableBody">
                       <tr><td colspan="5" style="text-align:center">Đang tải logs...</td></tr>
                    </tbody>
                  </table>
                </div>
             </div>
          </div>
  
        </div>
      `;

  // --- APP LOGIC ---
  let allUsers = [];

  // 1. TAB LOGIC
  const tabs = container.querySelectorAll('.admin-tab');
  tabs.forEach(tab => {
    tab.onclick = () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.dataset.tab;
      container.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
      const targetContent = container.querySelector(`#tab-${target}`);
      if (targetContent) targetContent.style.display = 'block';

      if (target === 'logs') fetchLoginLogs();
    };
  });

  // 2. FETCH STATS & USERS
  const fetchStats = async () => {
    try {
      const headers = window.getAuthHeaders ? window.getAuthHeaders() : {};
      const res = await fetch('http://localhost:3000/api/admin/stats', { headers });
      const data = await res.json();

      if (data.success) {
        container.querySelector('#admTotalUsers').textContent = data.stats.totalUsers;
        container.querySelector('#admTotalGames').textContent = data.stats.totalGamesPlayed;
        container.querySelector('#admActiveToday').textContent = data.stats.activeUsersToday;
      }
    } catch (e) {
      console.error("Stats Error", e);
    }
  };

  const fetchUsers = async () => {
    try {
      const headers = window.getAuthHeaders ? window.getAuthHeaders() : {};
      const res = await fetch('http://localhost:3000/api/admin/users', { headers });
      const data = await res.json();

      if (data.success) {
        allUsers = data.users;
        renderTable(allUsers);
      } else {
        alert("Lỗi tải user: " + data.message);
      }
    } catch (e) {
      console.error("Users Error", e);
      container.querySelector('#userTableBody').innerHTML = `<tr><td colspan="9" style="color:red">Lỗi kết nối server</td></tr>`;
    }
  };

  const fetchLoginLogs = async () => {
    const tbody = container.querySelector('#logsTableBody');
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center">Đang tải...</td></tr>`;

    try {
      const headers = window.getAuthHeaders ? window.getAuthHeaders() : {};
      const res = await fetch('http://localhost:3000/api/admin/login-history', { headers });
      const data = await res.json();

      if (data.success) {
        if (data.logs.length === 0) {
          tbody.innerHTML = `<tr><td colspan="5" style="text-align:center">Chưa có lịch sử đăng nhập nào</td></tr>`;
          return;
        }
        tbody.innerHTML = '';
        data.logs.forEach(log => {
          const row = document.createElement('tr');
          row.innerHTML = `
                         <td>${log.id}</td>
                         <td style="font-weight:bold; color:#4a6bff;">${log.username}</td>
                         <td>${log.role}</td>
                         <td>${new Date(log.login_time).toLocaleString('vi-VN')}</td>
                         <td>${log.ip_address || '---'}</td>
                    `;
          tbody.appendChild(row);
        });
      }
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="5" style="color:red">Lỗi tải lịch sử</td></tr>`;
    }
  };

  const renderTable = (users) => {
    const tbody = container.querySelector('#userTableBody');
    tbody.innerHTML = '';

    if (users.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center">Không tìm thấy user nào</td></tr>`;
      return;
    }

    users.forEach(u => {
      const tr = document.createElement('tr');
      const roleBadge = u.role === 'admin' ? '<span class="badge badge-admin">Admin</span>' : '<span class="badge badge-user">User</span>';
      const statusBadge = u.is_blocked ? '<span class="badge badge-blocked">Đã khóa</span>' : '<span class="badge badge-active">Hoạt động</span>';
      const pinDisplay = u.parent_pin || '---';
      const created = new Date(u.created_at).toLocaleDateString('vi-VN');

      tr.innerHTML = `
            <td>${u.user_id}</td>
            <td class="clickable-name" data-id="${u.user_id}" style="cursor:pointer; color:#4a6bff; font-weight:bold;">${u.username}</td>
            <td>${u.full_name || '---'}</td>
            <td>${u.email || '---'}</td>
            <td>${roleBadge}</td>
            <td>${created}</td>
            <td><span class="pin-hidden" title="PIN cũ user dùng cho phụ huynh" style="font-family: monospace; letter-spacing: 2px;">••••</span></td>
            <td>${statusBadge}</td>
            <td>
               ${u.role !== 'admin' ? `
                  <button class="action-btn ${u.is_blocked ? 'btn-unblock' : 'btn-block'}" data-id="${u.user_id}" data-blocked="${u.is_blocked}">
                    ${u.is_blocked ? '<i class="fas fa-unlock"></i> Mở' : '<i class="fas fa-lock"></i> Khóa'}
                  </button>
               ` : '<span style="color:#ccc">---</span>'}
            </td>
          `;
      tbody.appendChild(tr);
    });

    // Bind actions
    tbody.querySelectorAll('.action-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        toggleBlock(btn.dataset.id, btn.dataset.blocked === 'true' || btn.dataset.blocked === '1');
      };
    });

    // Bind name click for details
    tbody.querySelectorAll('.clickable-name').forEach(td => {
      td.onclick = () => viewUserDetails(td.dataset.id);
    });
  };

  const viewUserDetails = async (userId) => {
    // Show simplified loading modal/overlay
    const modal = document.createElement('div');
    modal.className = 'user-detail-modal';
    modal.innerHTML = `<div class="user-detail-content" style="text-align:center; padding:50px;">⏳ Đang tải thông tin...</div>`;
    document.body.appendChild(modal);

    try {
      const headers = window.getAuthHeaders ? window.getAuthHeaders() : {};
      const res = await fetch(`http://localhost:3000/api/admin/users/${userId}`, { headers });
      const data = await res.json();

      if (data.success) {
        renderDetailModal(modal, data);
      } else {
        modal.innerHTML = `<div class="user-detail-content error">❌ Lỗi: ${data.message} <button onclick="this.closest('.user-detail-modal').remove()">Đóng</button></div>`;
      }
    } catch (e) {
      console.error(e);
      modal.remove();
      alert("Lỗi kết nối User Details");
    }
  };

  const renderDetailModal = (modal, data) => {
    const u = data.user;
    const s = data.stats;
    const acts = data.recent_activity;

    modal.innerHTML = `
          <div class="user-detail-content">
              <button class="close-detail-btn">&times;</button>
              
              <!-- Nut GUI BAO CAO -->
              ${u.email ? `
              <button id="btnSendReport" style="position: absolute; top: 20px; right: 70px; background: #f39c12; color: white; border: none; padding: 8px 15px; border-radius: 20px; font-weight: bold; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 5px; box-shadow: 0 4px 10px rgba(243, 156, 18, 0.3); transition: 0.2s;">
                  <i class="fas fa-envelope"></i> Gửi báo cáo tháng
              </button>
              ` : ''}

              <div class="detail-header">
                  <div class="detail-avatar">
                     <i class="fas fa-user-astronaut"></i>
                  </div>
                  <div>
                     <h2>${u.full_name || u.username}</h2>
                     <p>@${u.username} • <span class="badge ${u.is_blocked ? 'badge-blocked' : 'badge-active'}">${u.is_blocked ? 'Đã khóa' : 'Hoạt động'}</span></p>
                  </div>
              </div>
  
              <div class="detail-grid">
                 <div class="detail-card">
                    <h4>Tham gia lúc</h4>
                    <p>${new Date(u.created_at).toLocaleDateString('vi-VN')}</p>
                 </div>
                 <div class="detail-card">
                    <h4>Email</h4>
                    <p>${u.email || 'Chưa cập nhật'}</p>
                 </div>
                 <div class="detail-card">
                    <h4>Ngày sinh</h4>
                    <p>${u.dob ? new Date(u.dob).toLocaleDateString('vi-VN') : '---'}</p>
                 </div>
              </div>
  
              <div class="detail-stats-row">
                 <div class="d-stat">
                    <span class="d-val">${s.total_plays}</span>
                    <span class="d-lbl">Trò chơi đã chơi</span>
                 </div>
                 <div class="d-stat">
                    <span class="d-val">${s.total_score}</span>
                    <span class="d-lbl">Tổng điểm tích lũy</span>
                 </div>
                 <div class="d-stat">
                    <span class="d-val" style="color:#f1c40f;">${s.total_stars || 0} ★</span>
                    <span class="d-lbl">Sao tích lũy</span>
                 </div>
                 <div class="d-stat">
                    <span class="d-val">${s.high_score}</span>
                    <span class="d-lbl">Điểm cao nhất</span>
                 </div>
              </div>
  
              <div class="detail-history">
                 <h3>🕒 Hoạt động gần đây</h3>
                 <div class="history-list">
                    ${acts.length > 0 ? acts.map(a => `
                       <div class="history-item">
                          <span class="h-game">${a.game_name}</span>
                          <span class="h-score">Điểm: ${a.score}</span>
                          ${a.stars ? `<span class="h-stars" style="color:#f1c40f; margin-left:10px;">${a.stars} ★</span>` : ''}
                          <span class="h-date">${new Date(a.played_at).toLocaleString('vi-VN')}</span>
                       </div>
                    `).join('') : '<p style="color:#999; text-align:center;">Chưa có hoạt động nào gần đây.</p>'}
                 </div>
              </div>
          </div>
          `;

    // Bind close
    modal.querySelector('.close-detail-btn').onclick = () => modal.remove();
    // Close on outside click
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };

    // Bind Send Report
    const btnReport = modal.querySelector('#btnSendReport');
    if (btnReport) {
      btnReport.onclick = async () => {
        if (!confirm(`Gửi thống kê tháng ${new Date().getMonth() + 1} tới email ${u.email}?`)) return;

        btnReport.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        btnReport.disabled = true;
        btnReport.style.opacity = 0.7;

        try {
          const headers = window.getAuthHeaders ? window.getAuthHeaders() : {};
          const res = await fetch(`http://localhost:3000/api/admin/users/${u.user_id}/send-report`, {
            method: 'POST',
            headers: headers
          });
          const respData = await res.json();

          if (respData.success) {
            alert("✅ " + respData.message);
            btnReport.innerHTML = '<i class="fas fa-check"></i> Đã gửi';
            btnReport.style.background = '#2ecc71';
          } else {
            alert("❌ Lỗi: " + respData.message);
            btnReport.innerHTML = '<i class="fas fa-envelope"></i> Gửi lại';
            btnReport.disabled = false;
            btnReport.style.opacity = 1;
          }
        } catch (e) {
          console.error(e);
          alert("❌ Lỗi kết nối gửi mail!");
          btnReport.innerHTML = '<i class="fas fa-envelope"></i> Gửi lại';
          btnReport.disabled = false;
          btnReport.style.opacity = 1;
        }
      };
    }
  };

  const toggleBlock = async (userId, isBlocked) => {
    const action = isBlocked ? 'MỞ KHÓA' : 'KHÓA';
    if (!confirm(`Bạn có chắc muốn ${action} tài khoản này không?`)) return;

    try {
      const headers = window.getAuthHeaders ? window.getAuthHeaders() : {};
      const res = await fetch(`http://localhost:3000/api/admin/users/${userId}/block`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({ is_blocked: !isBlocked })
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers(); // Reload table
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert("Lỗi thực hiện");
    }
  };

  // Search
  container.querySelector('#userSearch').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allUsers.filter(u =>
      u.username.toLowerCase().includes(term) ||
      (u.full_name && u.full_name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term))
    );
    renderTable(filtered);
  });

  container.querySelector('#refreshBtn').onclick = () => {
    fetchStats();
    fetchUsers();
  };

  container.querySelector('#refreshLogsBtn').onclick = fetchLoginLogs;

  // Init
  fetchStats();
  fetchUsers();
}

export function unmount(container) {
  if (!container) return;
  container.innerHTML = '';
}

