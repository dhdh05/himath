(function () {
  const sidebar = document.querySelector('[data-sidebar]');
  const backdrop = document.querySelector('[data-backdrop]');
  const toggleBtn = document.querySelector('[data-action="toggle-sidebar"]');
  const authBackdrop = document.querySelector('[data-auth-backdrop]');
  const authOpenBtn = document.querySelector('[data-action="open-auth"]');
  const authCloseBtn = document.querySelector('[data-auth-close]');
  const authOverlayEl = document.getElementById('auth-overlay');


  const AUTH_KEY = 'hm_is_authed';
  const USERS_KEY = 'hm_users';
  const CURRENT_USER_KEY = 'hm_user';

  const locks = {
    sidebar: false,
    auth: false,
  };

  function isAuthed() {
    return localStorage.getItem(AUTH_KEY) === '1' && Boolean(localStorage.getItem(CURRENT_USER_KEY));
  }

  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch (e) { return []; }
  }

  function saveUsers(list) {
    try { localStorage.setItem(USERS_KEY, JSON.stringify(list)); } catch (e) { }
  }

  function seedDemoUser() {
    const users = getUsers();
    const exists = users.some(u => u.username === 'abc');
    if (!exists) {
      users.push({ childName: 'ABC', username: 'abc', password: 'abc' });
      saveUsers(users);
    }
  }

  function getCurrentUser() {
    try { return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null'); } catch (e) { return null; }
  }

  function setCurrentUser(user) {
    try { localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user)); } catch (e) { }
  }

  function clearCurrentUser() {
    try { localStorage.removeItem(CURRENT_USER_KEY); localStorage.removeItem(AUTH_KEY); localStorage.removeItem('user_token'); } catch (e) { }
  }

  // Helper function de lay Authorization headers cho API calls
  function getAuthHeaders() {
    const token = localStorage.getItem('user_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // Export helper function de cac panel files co the dung
  window.getAuthHeaders = getAuthHeaders;

  // Cap nhat HiMathUserId khi page load (neu user da dang nhap)
  function initHiMathUserId() {
    const currentUser = getCurrentUser();
    if (currentUser && (currentUser.id || currentUser.user_id)) {
      const userId = currentUser.id || currentUser.user_id;
      window.HiMathUserId = userId;
      // Cap nhat trong stats gateway neu da load
      if (window.updateHiMathUserId) {
        window.updateHiMathUserId();
      }
    }
  }

  // Goi ngay khi script load
  initHiMathUserId();



  // seed demo user immediately
  seedDemoUser();
  updateAuthUI();

  // ===== Notification Bell - Hien thi thoi gian hoc hom nay =====
  function formatStudyTime(seconds) {
    if (!seconds || seconds === 0) return '0s';

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    let parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    if (s > 0 || parts.length === 0) parts.push(`${s}s`);

    return parts.join(' ');
  }

  async function updateNotificationBell() {
    const bellBtn = document.getElementById('notificationBell');
    if (!bellBtn) return;

    const currentUser = getCurrentUser();
    if (!currentUser || (!currentUser.id && !currentUser.user_id)) {
      bellBtn.title = 'Hôm nay bé đã học: 0s';
      return;
    }

    try {
      // Goi API moi de lay tong thoi gian truy cap website trong ngay hom nay
      const apiUrl = window.API_CONFIG?.ENDPOINTS?.PARENTS?.TODAY_TIME || 'http://localhost:3000/api/parents/today-time';
      const headers = window.getAuthHeaders ? window.getAuthHeaders() : { 'Content-Type': 'application/json' };

      const res = await fetch(apiUrl, { headers: headers });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const json = await res.json();
      if (!json.success) {
        bellBtn.title = 'Hôm nay bé đã học: 0s';
        return;
      }

      const totalSeconds = parseInt(json.total_seconds || 0);
      const formattedTime = formatStudyTime(totalSeconds);
      bellBtn.title = `Hôm nay bé đã học: ${formattedTime}`;
    } catch (err) {
      console.error("❌ Lỗi tải thời gian học:", err);
      bellBtn.title = 'Hôm nay bé đã học: 0s';
    }
  }

  // Cap nhat khi user dang nhap va dinh ky moi 30 giay
  setInterval(updateNotificationBell, 30000);
  updateNotificationBell();

  // Them event listener cho bell button
  let notificationPopup = null;

  function initNotificationBell() {
    const bellBtn = document.getElementById('notificationBell');
    if (!bellBtn) {
      // Retry sau mot chut neu button chua co
      setTimeout(initNotificationBell, 100);
      return;
    }

    // Xoa listener cu neu co (tranh duplicate)
    const newBellBtn = bellBtn.cloneNode(true);
    bellBtn.parentNode.replaceChild(newBellBtn, bellBtn);

    newBellBtn.addEventListener('click', async (e) => {
      e.stopPropagation();

      // Xoa popup cu neu co
      if (notificationPopup) {
        notificationPopup.remove();
        notificationPopup = null;
        return;
      }

      // Lay thong tin thoi gian hoc tu title hoac goi API de lay thoi gian moi nhat
      let studyTime = newBellBtn.title.replace('Hôm nay bé đã học: ', '') || '0s';

      // Goi API de lay thoi gian moi nhat khi mo popup
      try {
        const apiUrl = window.API_CONFIG?.ENDPOINTS?.PARENTS?.TODAY_TIME || 'http://localhost:3000/api/parents/today-time';
        const headers = window.getAuthHeaders ? window.getAuthHeaders() : { 'Content-Type': 'application/json' };
        const res = await fetch(apiUrl, { headers: headers });
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            const totalSeconds = parseInt(json.total_seconds || 0);
            studyTime = formatStudyTime(totalSeconds);
            // Cap nhat title luon
            newBellBtn.title = `Hôm nay bé đã học: ${studyTime}`;
          }
        }
      } catch (e) {
        console.error('Lỗi lấy thời gian khi mở popup:', e);
      }

      // Tao popup
      notificationPopup = document.createElement('div');
      notificationPopup.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        z-index: 10000;
        min-width: 280px;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
      `;

      notificationPopup.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #56ccf2, #2f80ed); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">
            📚
          </div>
          <div>
            <h3 style="margin: 0; font-size: 16px; color: #333; font-weight: 700;">Thời gian học hôm nay</h3>
            <p style="margin: 4px 0 0; font-size: 14px; color: #666;">Bé đã học tập rất chăm chỉ!</p>
          </div>
        </div>
        <div style="background: linear-gradient(135deg, #f8f9ff, #eef1ff); padding: 16px; border-radius: 8px; text-align: center;">
          <div style="font-size: 32px; font-weight: 900; color: #4a6bff; margin-bottom: 4px;">${studyTime}</div>
          <div style="font-size: 12px; color: #888;">Tổng thời gian học</div>
        </div>
        <button id="closeNotificationBtn" style="margin-top: 12px; width: 100%; padding: 8px; background: #4a6bff; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Đóng</button>
      `;

      // Them animation CSS neu chua co
      if (!document.getElementById('notificationPopupStyle')) {
        const style = document.createElement('style');
        style.id = 'notificationPopupStyle';
        style.textContent = `
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `;
        document.head.appendChild(style);
      }

      document.body.appendChild(notificationPopup);

      // Dong khi click nut dong
      const closeBtn = notificationPopup.querySelector('#closeNotificationBtn');
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          notificationPopup.remove();
          notificationPopup = null;
        });
      }

      // Dong khi click ben ngoai
      setTimeout(() => {
        const closeOnOutsideClick = (e) => {
          if (notificationPopup && !notificationPopup.contains(e.target) && e.target !== newBellBtn && !newBellBtn.contains(e.target)) {
            notificationPopup.remove();
            notificationPopup = null;
            document.removeEventListener('click', closeOnOutsideClick);
          }
        };
        document.addEventListener('click', closeOnOutsideClick);
      }, 100);
    });
  }

  // Khoi tao ngay khi script chay (vi script duoc load o cuoi body)
  initNotificationBell();

  function syncScrollLock() {
    const shouldLock = Boolean(locks.sidebar || locks.auth);
    document.body.style.overflow = shouldLock ? 'hidden' : '';
  }

  function isMobileLayout() {
    return window.matchMedia('(max-width: 900px)').matches;
  }

  function openSidebar() {
    if (!sidebar || !backdrop) return;
    sidebar.classList.add('is-open');
    backdrop.hidden = false;
    locks.sidebar = true;
    syncScrollLock();
  }

  function closeSidebar() {
    if (!sidebar || !backdrop) return;
    sidebar.classList.remove('is-open');
    backdrop.hidden = true;
    locks.sidebar = false;
    syncScrollLock();
  }

  function openAuth() {
    if (!authBackdrop) return;
    authBackdrop.hidden = false;
    locks.auth = true;
    syncScrollLock();
    setTimeout(() => authEmail?.focus(), 0);
  }

  function closeAuth() {
    if (!authBackdrop) return;
    authBackdrop.hidden = true;
    locks.auth = false;
    syncScrollLock();
  }

  function toggleSidebar() {
    if (!sidebar || !backdrop) return;
    const isOpen = sidebar.classList.contains('is-open');
    if (isOpen) closeSidebar();
    else openSidebar();
  }

  toggleBtn?.addEventListener('click', () => {
    if (isMobileLayout()) {
      toggleSidebar();
    } else {
      toggleCollapseSidebar();
    }
  });

  // hide / show sidebar completely (expand content to full width)
  const hideBtn = document.querySelector('[data-action="hide-sidebar"]');
  hideBtn?.addEventListener('click', () => {
    const app = document.querySelector('.app');
    if (!app) return;
    app.classList.toggle('sidebar-hidden');
    // when hiding, also remove collapsed state and close submenus
    if (app.classList.contains('sidebar-hidden')) {
      app.classList.remove('sidebar-collapsed');
      document.querySelectorAll('[data-dropdown]').forEach(btn => {
        const k = btn.getAttribute('data-dropdown');
        const panel = k ? document.querySelector(`[data-submenu="${k}"]`) : null;
        btn.setAttribute('aria-expanded', 'false');
        panel?.classList.remove('is-open');
      });
    }
    // keep snow container in sync with sidebar visibility
    try {
      if (app.classList.contains('sidebar-hidden')) removeIceContainer('ice-sidebar');
      else ensureIceContainer(document.querySelector('.sidebar'), 'ice-sidebar');
    } catch (e) { }
  });

  function collapseSidebar() {
    const app = document.querySelector('.app');
    if (!app) return;
    app.classList.add('sidebar-collapsed');
  }

  function expandSidebar() {
    const app = document.querySelector('.app');
    if (!app) return;
    app.classList.remove('sidebar-collapsed');
  }

  function toggleCollapseSidebar() {
    const app = document.querySelector('.app');
    if (!app) return;
    app.classList.toggle('sidebar-collapsed');
  }

  backdrop?.addEventListener('click', closeSidebar);

  authOpenBtn?.addEventListener('click', () => {
    openAuth();
  });

  authCloseBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    closeAuth();
  });

  document.addEventListener('click', (e) => {
    const el = e.target;
    if (!(el instanceof HTMLElement)) return;

    const closeEl = el.closest('[data-auth-close]');
    if (closeEl) {
      e.preventDefault();
      closeAuth();
    }
  });

  authBackdrop?.addEventListener('click', (e) => {
    if (e.target === authBackdrop) closeAuth();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (locks.auth) closeAuth();
    else closeSidebar();
  });

  window.addEventListener('resize', () => {
    if (!isMobileLayout()) {
      if (backdrop) backdrop.hidden = true;
      if (sidebar) sidebar.classList.remove('is-open');
      locks.sidebar = false;
      syncScrollLock();
    }
  });

  // dropdown behavior
  const dropdownBtns = document.querySelectorAll('[data-dropdown]');
  dropdownBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-dropdown');
      if (!key) return;

      // Close other open dropdowns first (only one open at a time)
      dropdownBtns.forEach((other) => {
        if (other === btn) return;
        const otherKey = other.getAttribute('data-dropdown');
        if (!otherKey) return;
        const otherPanel = document.querySelector(`[data-submenu="${otherKey}"]`);
        other.setAttribute('aria-expanded', 'false');
        otherPanel?.classList.remove('is-open');
        const otherChev = other.querySelector('.nav__chev');
        if (otherChev) otherChev.style.transform = 'rotate(0deg)';
      });

      const panel = document.querySelector(`[data-submenu="${key}"]`);
      const expanded = btn.getAttribute('aria-expanded') === 'true';

      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      panel?.classList.toggle('is-open', !expanded);

      const chev = btn.querySelector('.nav__chev');
      if (chev) {
        chev.style.transform = expanded ? 'rotate(0deg)' : 'rotate(180deg)';
      }
    });
  });

  // active state for top-level items
  const navItems = document.querySelectorAll('[data-nav]');
  navItems.forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();

      const key = a.getAttribute('data-nav');
      if (key === 'users' && !isAuthed()) {
        openAuth();
        return;
      }

      navItems.forEach((x) => x.classList.remove('is-active'));
      a.classList.add('is-active');

      if (isMobileLayout()) closeSidebar();
    });
  });

  // close sidebar after clicking any link inside it (mobile)
  sidebar?.addEventListener('click', (e) => {
    const el = e.target;
    if (!(el instanceof HTMLElement)) return;

    const isLink = el.closest('a');
    if (isLink && isMobileLayout()) closeSidebar();
  });

  // Tab switching
  document.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('[data-auth-tab]');
    if (tabBtn) {
      const target = tabBtn.getAttribute('data-auth-tab');
      document.querySelectorAll('[data-auth-tab]').forEach(t => t.classList.remove('is-active'));
      document.querySelectorAll('[data-auth-form]').forEach(f => f.hidden = true);
      tabBtn.classList.add('is-active');
      const form = document.querySelector(`[data-auth-form="${target}"]`);
      if (form) {
        form.hidden = false;
        const firstInput = form.querySelector('input');
        if (firstInput) firstInput.focus();
      }
    }

    const switchBtn = e.target.closest('[data-switch-to]');
    if (switchBtn) {
      const target = switchBtn.getAttribute('data-switch-to');
      document.querySelectorAll('[data-auth-tab]').forEach(t => t.classList.remove('is-active'));
      document.querySelectorAll('[data-auth-form]').forEach(f => f.hidden = true);
      const tab = document.querySelector(`[data-auth-tab="${target}"]`);
      const form = document.querySelector(`[data-auth-form="${target}"]`);
      if (tab) tab.classList.add('is-active');
      if (form) {
        form.hidden = false;
        const firstInput = form.querySelector('input');
        if (firstInput) firstInput.focus();
      }
    }
  });

  // connect any open-auth buttons (hero / overlay) to modal
  document.addEventListener('click', (e) => {
    const open = e.target.closest('[data-action="open-auth"]');
    if (open) {
      e.preventDefault();
      openAuth();
    }

    const overlayLogin = e.target.closest('#auth-overlay');
    if (overlayLogin) {
      e.preventDefault();
      openAuth();
    }
  });

  // simple guard: when user clicks protected nav items or feature links, show overlay if not authed
  function showAuthOverlay() {
    if (!authOverlayEl) return;
    authOverlayEl.hidden = false;
  }

  function hideAuthOverlay() { if (authOverlayEl) authOverlayEl.hidden = true; }

  // protected areas by page key
  const PROTECTED_KEYS = new Set(['digits-hoc-so', 'digits-ghep-so', 'digits-chan-le', 'digits-dem-so', 'compare-so-sanh', 'compare-xep-so', 'practice-tinh-toan', 'practice-nhan-ngon', 'games', 'games-dino']);
  // Handle both forms
  // handle login and register with localStorage (demo only)
  // --- CODE MOI: XU LY DANG NHAP THAT ---

  // 1. Xu ly Form Dang Nhap
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Chan reload trang

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      try {
        // Goi API Backend
        const apiUrl = window.API_CONFIG?.ENDPOINTS?.AUTH?.LOGIN || 'http://localhost:3000/api/auth/login';
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (data.success) {
          // A. Luu thong tin quan trong vao bo nho
          localStorage.setItem('user_token', data.token); // The bai de choi game
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user)); // Thong tin user
          localStorage.setItem(AUTH_KEY, '1'); // De giu logic giao dien cu cua ban

          // A1. Cap nhat HiMathUserId de stats va games dung dung user
          if (window.updateHiMathUserId) {
            window.updateHiMathUserId();
          } else {
            // Fallback: Set truc tiep neu function chua load
            const userId = data.user.id || data.user.user_id;
            if (userId) {
              window.HiMathUserId = userId;
            }
          }

          // B. Thong bao & Dong popup
          // C. Kiem tra Email va DOB
          if (!data.user.email || !data.user.dob) {
            alert('⚠️ Vui lòng cập nhật thông tin còn thiếu (Email/Ngày sinh) để tiếp tục!');
            closeAuth();
            const upModal = document.getElementById('update-email-modal');
            if (upModal) {
              upModal.hidden = false;
              // Dien san thong tin da co (neu co)
              if (data.user.email) document.getElementById('update_email_input').value = data.user.email;
              // Format DOB yyyy-MM-dd
              if (data.user.dob) {
                const d = new Date(data.user.dob);
                const iso = d.toISOString().split('T')[0];
                document.getElementById('update_dob_input').value = iso;
              }
            }
            // KHONG RELOAD, cho update xong moi reload
          } else {
            alert('✅ Xin chào ' + data.user.name + '! Đăng nhập thành công.');
            closeAuth();
            window.location.reload();
          }
        } else {
          alert('❌ Lỗi: ' + data.message);
        }
      } catch (err) {
        console.error('❌ Lỗi kết nối:', err);
        const errorMsg = `⚠️ Không kết nối được Server!\n\n` +
          `Vui lòng kiểm tra:\n` +
          `1. Backend đã chạy chưa? (cd backEnd && npm start)\n` +
          `2. Backend đang chạy tại: http://localhost:3000\n` +
          `3. Frontend đang mở bằng http:// (không phải file://)\n` +
          `4. Kiểm tra Console (F12) để xem lỗi chi tiết`;
        alert(errorMsg);
      }
    });
  }

  // 2. Xu ly Form Dang Ky (Da hoan thien)
  const registerForm = document.querySelector('[data-auth-form="register"]');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Lay gia tri tu cac o input (Dam bao HTML da dat dung ID nay)
      const fullName = document.getElementById('reg_fullname')?.value;
      const dob = document.getElementById('reg_dob')?.value;
      const email = document.getElementById('reg_email')?.value;
      const username = document.getElementById('reg_username')?.value;
      const parentPin = document.getElementById('reg_pin')?.value;
      const password = document.getElementById('reg_password')?.value;
      const confirmPass = document.getElementById('reg_confirm')?.value;

      // Kiem tra co ban
      if (!fullName || !username || !password) {
        alert('Vui lòng điền đầy đủ thông tin của bé!');
        return;
      }

      if (password !== confirmPass) {
        alert('Mật khẩu xác nhận không khớp!');
        return;
      }

      // Gui du lieu sang Server
      try {
        const apiUrl = window.API_CONFIG?.ENDPOINTS?.AUTH?.REGISTER || 'http://localhost:3000/api/auth/register';
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: fullName,
            username: username,
            password: password,
            parent_pin: parentPin, // Gui ma PIN phu huynh
            role: 'student',
            email: email,
            dob: dob
          })
        });

        const data = await res.json();

        if (data.success) {
          alert('🎉 ' + data.message);
          // Chuyen sang tab dang nhap sau khi dang ky xong
          const loginTabBtn = document.querySelector('[data-auth-tab="login"]');
          if (loginTabBtn) loginTabBtn.click();

          // Dien san username cho tien
          const loginUserInp = document.getElementById('username');
          if (loginUserInp) loginUserInp.value = username;
        } else {
          alert('❌ Đăng ký thất bại: ' + data.message);
        }
      } catch (err) {
        console.error(err);
        alert('⚠️ Lỗi kết nối Server!');
      }
    });
  }

  // preserve initial main content so we can restore it when clicking 'home'
  const contentElement = document.querySelector('.content');
  const initialContentHTML = contentElement ? contentElement.innerHTML : '';

  // === RESTORE PAGE LOGIC ===
  setTimeout(() => {
    const lastPage = localStorage.getItem('HM_LAST_PAGE');
    const lastTitle = localStorage.getItem('HM_LAST_TITLE');
    if (lastPage && lastPage !== 'home') {
      renderPanel(lastPage, lastTitle || '');

      // Restore active menu state
      const activeEl = document.querySelector(`[data-page="${lastPage}"]`);
      if (activeEl) {
        document.querySelectorAll('.nav__item, .nav__subitem').forEach(el => el.classList.remove('is-active'));
        if (activeEl.classList.contains('nav__subitem')) activeEl.classList.add('is-active');
        const parent = activeEl.closest('.nav__item');
        if (parent) parent.classList.add('is-active');
        const feature = activeEl.closest('.feature');
        if (feature) feature.classList.add('is-open');
      }
    }
  }, 100);

  // update hero and top UI based on auth state
  function updateAuthUI() {
    const hero = document.querySelector('.hero__copy');
    const heroActions = document.querySelector('.hero__actions');
    const avatarBtn = document.querySelector('.avatar');
    const current = getCurrentUser();

    if (current) {
      // 1. Xac dinh ten hien thi
      // Server tra ve 'name' (full_name), 'username'. Fallback sang childName neu la du lieu cu.
      const displayName = current.name || current.full_name || current.childName || current.username;

      // 2. Hien thi Loi chao + Nut Dang xuat
      if (heroActions) {
        // Style inline de can chinh hang ngang dep mat ngay lap tuc
        heroActions.style.display = 'flex';
        heroActions.style.alignItems = 'center';
        heroActions.style.gap = '10px';

        heroActions.innerHTML = `
            <div class="hero__greeting" style="font-weight: bold; color: #fff; font-size: 1.1em; margin: 0;">
                Xin chào bé ${escapeHtml(displayName)}
            </div>
            <button id="quickLogoutBtn" class="btn" style="background: rgba(255,255,255,0.25); border: 1px solid rgba(255,255,255,0.5); color: white; padding: 6px 15px; border-radius: 20px; font-size: 0.9em; cursor: pointer; transition: 0.2s;">
                <i class="fas fa-sign-out-alt"></i> Thoát
            </button>
        `;

        // 3. Gan su kien click cho nut Dang xuat vua tao
        const btnLogout = document.getElementById('quickLogoutBtn');
        if (btnLogout) {
          btnLogout.addEventListener('click', () => {
            if (confirm('Bé có muốn đăng xuất không?')) {
              clearCurrentUser(); // Ham xoa localStorage co san o tren
              window.location.reload(); // Tai lai trang ve trang thai chua dang nhap
            }
          });
          // Hieu ung hover nhe
          btnLogout.addEventListener('mouseenter', () => btnLogout.style.background = 'rgba(255,255,255,0.4)');
          btnLogout.addEventListener('mouseleave', () => btnLogout.style.background = 'rgba(255,255,255,0.25)');
        }
      }

      if (avatarBtn) {
        avatarBtn.title = `Đăng nhập: ${current.username}`;
        // Bind avatar upload/delete functionality
        initAvatarButton(avatarBtn);
      }

      // Cap nhat thoi gian hoc hom nay trong notification bell
      updateNotificationBell();

      // Load streak widget neu user da dang nhap
      // Load streak widget neu user da dang nhap
      initStreakWidget();
      const streakBtn = document.getElementById('streakBtn');
      if (streakBtn) streakBtn.style.display = 'inline-flex';
    } else {
      // Trang thai CHUA dang nhap
      if (heroActions) {
        heroActions.style.display = 'block'; // Reset ve mac dinh
        heroActions.innerHTML = `<button class="btn btn--primary" data-action="open-auth">Đăng nhập / Đăng ký</button>`;
      }
      if (avatarBtn) {
        avatarBtn.title = 'Tài khoản';
        // Remove avatar functionality when logged out
        resetAvatarDisplay(avatarBtn);
        const newBtn = avatarBtn.cloneNode(true);
        avatarBtn.parentNode.replaceChild(newBtn, avatarBtn);
      }

      // Reset notification bell
      const bellBtn = document.getElementById('notificationBell');
      if (bellBtn) bellBtn.title = 'Hôm nay bé đã học: 0s';

      // Hide streak widget
      const streakSection = document.getElementById('streakSection');
      if (streakSection) streakSection.style.display = 'none';
      const streakBtn = document.getElementById('streakBtn');
      if (streakBtn) streakBtn.style.display = 'none';
    }
  }

  // Header Streak Widget Logic
  async function initStreakWidget() {
    const streakBtn = document.getElementById('streakBtn');
    const streakCountDisplay = document.getElementById('streakCountDisplay');

    // 1. Update Header Button immediately
    try {
      const { fetchStreakData } = await import('./panels/streak/panel.js');
      const data = await fetchStreakData();
      if (streakCountDisplay) {
        streakCountDisplay.textContent = data.streak || 0;
      }
    } catch (e) {
      console.error('Lỗi fetch streak header:', e);
    }

    // 2. Click Handler -> Open Modal
    if (streakBtn) {
      // Remove old listeners
      const newBtn = streakBtn.cloneNode(true);
      streakBtn.parentNode.replaceChild(newBtn, streakBtn);

      newBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        openStreakModal();
      });
    }
  }

  async function openStreakModal() {
    // Create Modal Container if not exists
    let modal = document.getElementById('streakModal');

    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'streakModal';
      modal.style.cssText = `
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.5);
            z-index: 20000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s;
          `;

      modal.innerHTML = `
            <div class="streak-modal-content" style="
                background: white; 
                padding: 0; 
                border-radius: 20px; 
                position: relative; 
                width: 600px;
                max-width: 90vw;
                transform: scale(0.9);
                transition: transform 0.3s;
                overflow: hidden;
            ">
                <button id="closeStreakModal" style="
                    position: absolute;
                    top: 15px; right: 15px;
                    background: rgba(0,0,0,0.05); border: none; width: 32px; height: 32px; border-radius: 50%; 
                    font-size: 20px; cursor: pointer; color: #555;
                    display: flex; align-items: center; justify-content: center;
                    z-index: 10;
                ">&times;</button>
                <div id="streakModalBody"></div>
            </div>
          `;
      document.body.appendChild(modal);

      // Force reflow
      modal.offsetHeight;

      modal.querySelector('#closeStreakModal').addEventListener('click', () => {
        closeStreakModal();
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeStreakModal();
      });
    }

    // Load Content
    const body = modal.querySelector('#streakModalBody');
    const { mount } = await import('./panels/streak/panel.js');

    // Clear previous content just in case
    body.innerHTML = '';
    await mount(body);

    // Show
    modal.style.opacity = '1';
    modal.querySelector('.streak-modal-content').style.transform = 'scale(1)';
    modal.hidden = false;
  }

  function closeStreakModal() {
    const modal = document.getElementById('streakModal');
    if (!modal) return;

    modal.style.opacity = '0';
    modal.querySelector('.streak-modal-content').style.transform = 'scale(0.9)';

    setTimeout(() => {
      if (modal.parentNode) modal.parentNode.removeChild(modal);
    }, 300);

    // Unmount logic if necessary (clean up intervals)
    import('./panels/streak/panel.js').then(({ unmount }) => {
      unmount(document.getElementById('streakModalBody'));
    });
  }

  // Avatar upload/delete functionality
  function initAvatarButton(avatarBtn) {
    if (!avatarBtn) return;

    // Remove old listeners by cloning
    const newBtn = avatarBtn.cloneNode(true);
    avatarBtn.parentNode.replaceChild(newBtn, avatarBtn);

    // Load saved avatar if exists
    const currentUser = getCurrentUser();
    if (currentUser) {
      const userId = currentUser.id || currentUser.user_id;
      const savedAvatar = localStorage.getItem(`avatar_${userId}`);
      if (savedAvatar) {
        updateAvatarDisplay(newBtn, savedAvatar);
      }
    }

    // Add click handler
    newBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showAvatarMenu(newBtn);
    });
  }

  function showAvatarMenu(avatarBtn) {
    // Remove existing menu if any
    const existingMenu = document.getElementById('avatarMenu');
    if (existingMenu) {
      existingMenu.remove();
      return;
    }

    // Create menu
    const menu = document.createElement('div');
    menu.id = 'avatarMenu';
    menu.style.cssText = `
      position: absolute;
      top: 60px;
      right: 10px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      padding: 8px;
      z-index: 10000;
      min-width: 180px;
      font-family: 'Lato', 'Nunito', sans-serif;
    `;

    menu.innerHTML = `
      <button class="avatar-menu-item" data-action="upload" style="
        width: 100%;
        padding: 12px 16px;
        border: none;
        background: transparent;
        text-align: left;
        cursor: pointer;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        color: #333;
        display: flex;
        align-items: center;
        gap: 10px;
        transition: background 0.2s;
        font-family: 'Lato', 'Nunito', sans-serif;
      ">
        <i class="fas fa-upload" style="color: #667eea;"></i>
        <span>Tải avatar lên</span>
      </button>
      <button class="avatar-menu-item" data-action="delete" style="
        width: 100%;
        padding: 12px 16px;
        border: none;
        background: transparent;
        text-align: left;
        cursor: pointer;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        color: #e74c3c;
        display: flex;
        align-items: center;
        gap: 10px;
        transition: background 0.2s;
        font-family: 'Lato', 'Nunito', sans-serif;
      ">
        <i class="fas fa-trash" style="color: #e74c3c;"></i>
        <span>Xóa avatar</span>
      </button>
      <div style="height: 1px; background: #eee; margin: 4px 0;"></div>
      <button class="avatar-menu-item" data-action="logout" style="
        width: 100%;
        padding: 12px 16px;
        border: none;
        background: transparent;
        text-align: left;
        cursor: pointer;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        color: #666;
        display: flex;
        align-items: center;
        gap: 10px;
        transition: background 0.2s;
        font-family: 'Lato', 'Nunito', sans-serif;
      ">
        <i class="fas fa-sign-out-alt" style="color: #666;"></i>
        <span>Thoát</span>
      </button>
    `;

    // Add hover effects
    menu.querySelectorAll('.avatar-menu-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.style.background = '#f5f5f5';
      });
      item.addEventListener('mouseleave', () => {
        item.style.background = 'transparent';
      });
    });

    // Handle menu actions
    menu.querySelector('[data-action="upload"]').addEventListener('click', (e) => {
      e.stopPropagation();
      menu.remove();
      triggerAvatarUpload(avatarBtn);
    });

    menu.querySelector('[data-action="delete"]').addEventListener('click', (e) => {
      e.stopPropagation();
      menu.remove();
      deleteAvatar(avatarBtn);
    });

    menu.querySelector('[data-action="logout"]').addEventListener('click', (e) => {
      e.stopPropagation();
      menu.remove();
      if (confirm('Bé có muốn đăng xuất không?')) {
        clearCurrentUser();
        window.location.reload();
      }
    });

    // Close menu when clicking outside
    setTimeout(() => {
      document.addEventListener('click', function closeMenu(e) {
        if (!menu.contains(e.target) && e.target !== avatarBtn) {
          menu.remove();
          document.removeEventListener('click', closeMenu);
        }
      });
    }, 0);

    document.body.appendChild(menu);
  }

  function triggerAvatarUpload(avatarBtn) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File quá lớn! Vui lòng chọn file nhỏ hơn 2MB.');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh!');
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        saveAvatar(avatarBtn, base64);
      };
      reader.readAsDataURL(file);
    });

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  }

  function saveAvatar(avatarBtn, base64Data) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const userId = currentUser.id || currentUser.user_id;
    localStorage.setItem(`avatar_${userId}`, base64Data);

    updateAvatarDisplay(avatarBtn, base64Data);

    // Show success message
    const msg = document.createElement('div');
    msg.textContent = '✅ Đã tải avatar thành công!';
    msg.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10001;
      font-size: 14px;
      font-weight: 600;
    `;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
  }

  function deleteAvatar(avatarBtn) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    if (!confirm('Bạn có chắc muốn xóa avatar và quay về avatar mặc định?')) {
      return;
    }

    const userId = currentUser.id || currentUser.user_id;
    localStorage.removeItem(`avatar_${userId}`);

    // Reset to default
    resetAvatarDisplay(avatarBtn);

    // Show success message
    const msg = document.createElement('div');
    msg.textContent = '✅ Đã xóa avatar!';
    msg.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10001;
      font-size: 14px;
      font-weight: 600;
    `;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
  }

  function updateAvatarDisplay(avatarBtn, base64Data) {
    if (!avatarBtn) return;

    // Remove icon if exists (completely remove, not just hide)
    const icon = avatarBtn.querySelector('i');
    if (icon) icon.remove();

    // Remove existing img if any
    const existingImg = avatarBtn.querySelector('img');
    if (existingImg) existingImg.remove();

    // Create new img element
    const img = document.createElement('img');
    img.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 16px;
      pointer-events: none;
    `;
    img.src = base64Data;
    img.alt = 'Avatar';

    avatarBtn.appendChild(img);
  }

  function resetAvatarDisplay(avatarBtn) {
    if (!avatarBtn) return;

    // Remove img if exists
    const img = avatarBtn.querySelector('img');
    if (img) img.remove();

    // Restore default icon if not exists
    if (!avatarBtn.querySelector('i')) {
      const icon = document.createElement('i');
      icon.className = 'fa-solid fa-user-astronaut';
      avatarBtn.appendChild(icon);
    }
  }

  // function updateAuthUI() {
  //   const hero = document.querySelector('.hero__copy');
  //   const heroActions = document.querySelector('.hero__actions');
  //   const avatarBtn = document.querySelector('.avatar');
  //   const current = getCurrentUser();
  //   //const displayName = current.name || current.full_name || current.childName || current.username;
  //   if (current) {
  //     // show greeting in hero
  //     if (heroActions) heroActions.innerHTML = `<div class="hero__greeting">Xin chào bé ${escapeHtml(current.full_name || current.username)}</div>`;
  //     if (avatarBtn) avatarBtn.title = `Dang nhap: ${current.username}`;
  //   } else {
  //     if (heroActions) heroActions.innerHTML = `<button class="btn btn--primary" data-action="open-auth">Đăng nhập / Đăng ký</button>`;
  //     if (avatarBtn) avatarBtn.title = 'Tài khoản';
  //   }
  // }

  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" }[m]; }); }

  // bind interactions that live inside the main content area (re-run after restoring)
  function initDynamicBindings() {
    const FEATURE_CHILDREN = {
      'digits': [
        { label: 'Học số', page: 'digits-hoc-so' },
        { label: 'Ghép số', page: 'digits-ghep-so' },
        { label: 'Chẵn lẻ', page: 'digits-chan-le' },
        { label: 'Đếm hình', page: 'digits-dem-so' }
      ],
      'compare': [
        { label: 'So sánh số', page: 'compare-so-sanh' },
        { label: 'Xếp số', page: 'compare-xep-so' }
      ],
      'calc': [
        { label: 'Tính toán', page: 'practice-tinh-toan' },
        { label: 'Tính bằng Ngón Tay', page: 'practice-nhan-ngon' }
      ],
      'games': [
        { label: 'Hứng táo Newton', page: 'games' },
        { label: 'Khủng long Toán', page: 'games-dino' }
      ]
    };

    // remove old handlers by cloning
    const features = document.querySelectorAll('[data-feature]');
    features.forEach((f) => f.replaceWith(f.cloneNode(true)));

    // bind expand/collapse behavior
    document.querySelectorAll('[data-feature]').forEach((f) => {
      f.addEventListener('click', (e) => {
        e.preventDefault();
        const key = f.getAttribute('data-feature');
        if (!key) return;

        const currentlyOpen = f.classList.contains('is-open');

        // close other open features
        document.querySelectorAll('.feature.is-open').forEach((other) => {
          if (other === f) return;
          other.classList.remove('is-open');
          const oc = other.querySelector('.feature-children');
          if (oc) oc.remove();
        });

        if (currentlyOpen) {
          // close this one
          f.classList.remove('is-open');
          const oc = f.querySelector('.feature-children');
          if (oc) oc.remove();
          return;
        }

        // Check if this is a direct panel (no children)
        const directPanels = ['leaderboard', 'achievements', 'rewards'];
        if (directPanels.includes(key)) {
          // Load panel directly
          const contentElement = document.querySelector('.content');
          if (contentElement) {
            const title = PAGE_TITLES[key] || key;
            renderPanel(key, title);
          }
          return;
        }

        // open this feature and inject children links
        f.classList.add('is-open');
        const children = FEATURE_CHILDREN[key] || [];
        const container = document.createElement('div');
        container.className = 'feature-children';
        children.forEach((item) => {
          const a = document.createElement('a');
          a.href = '#';
          a.className = 'feature-child';
          a.setAttribute('data-page', item.page);
          a.textContent = item.label;
          container.appendChild(a);
        });
        f.appendChild(container);
      });
    });
    // initialize fun-zone (snowball) if present
    try { initFunZone(); } catch (e) { /* ignore */ }
  }

  // Fun-zone (snowball) behavior: keeps the user's original algorithm and timings
  function initFunZone() {
    const funQuotes = [
      "Sai thì sửa, sợ gì! Thử lại nào siêu nhân!",
      "Toán học dễ như ăn kẹo ấy nhỉ!",
      "Não bộ đang tập thể dục đó, cố lên!",
      "Sắp thành 'Trùm Cuối' môn Toán rồi!",
      "1 + 1 = 2, Sự nỗ lực của bạn = Vô Giá!",
      "Cứ bình tĩnh, hít thở sâu và tính tiếp!",
      "Tuyệt vời ông mặt trời!"
    ];

    const snowballScaler = document.getElementById('snowballScaler');
    const snowballMover = document.getElementById('snowballMover');
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (!snowballScaler) return;

    // avoid double-binding; still ensure auto-move starts when entering home
    if (snowballScaler._funBound) {
      try { startAutoMove(snowballMover); } catch (e) { }
      return;
    }
    snowballScaler._funBound = true;

    // Duration and distances
    const MOVE_DURATION = 5600; // ms for a half-cycle (left->right or right->left)
    const DIST = 110; // px travel distance

    let isAnimating = false;

    // JS-driven oscillation helpers
    // Use CSS-driven oscillation: toggle `.auto` class on the mover to start/stop continuous movement.
    function startAutoMove(el) {
      if (!el) return;
      try { if (el._autoTimer) { clearTimeout(el._autoTimer); el._autoTimer = null; } } catch (e) { }
      el.classList.add('auto');
      el.classList.remove('paused');
    }

    function stopAutoMove(el) {
      if (!el) return;
      try { if (el._autoTimer) { clearTimeout(el._autoTimer); el._autoTimer = null; } } catch (e) { }
      el.classList.remove('auto');
      el.classList.add('paused');
    }

    // ensure auto-roll on home
    try { startAutoMove(snowballMover); } catch (e) { }

    // click handling: hide ball (no crack), show quote, then reappear while moving and growing
    snowballScaler.addEventListener('click', function () {
      if (isAnimating) return;
      isAnimating = true;

      // stop auto movement
      try { stopAutoMove(snowballMover); } catch (e) { }

      // hide ball and shadow immediately
      snowballScaler.classList.add('poof');
      if (quoteDisplay) {
        const idx = Math.floor(Math.random() * funQuotes.length);
        quoteDisplay.textContent = funQuotes[idx];
        quoteDisplay.classList.add('show-quote');
      }

      const quoteMs = 5600;

      setTimeout(() => {
        // hide quote
        if (quoteDisplay) quoteDisplay.classList.remove('show-quote');

        // small wait for hide animation
        setTimeout(() => {
          // prepare reappear: position mover at left and scaler very small
          try {
            // remove poof (so inner will re-show when we set scale)
            snowballScaler.classList.remove('poof');

            // set initial small scale instantly
            snowballScaler.style.transition = 'none';
            snowballScaler.style.transform = 'scale(0.02)';

            // position mover at left off-screen position
            snowballMover.style.transition = 'none';
            snowballMover.style.transform = `translateX(-${DIST}px)`;

            // force reflow
            void snowballMover.offsetWidth;

            // animate mover to right while scaling up
            snowballMover.style.transition = `transform ${MOVE_DURATION}ms ease-in-out`;
            snowballScaler.style.transition = `transform ${MOVE_DURATION}ms ease-in-out`;

            // set target transforms
            snowballMover.style.transform = `translateX(${DIST}px)`;
            snowballScaler.style.transform = 'scale(1)';

            const onEnd = (ev) => {
              if (ev.propertyName === 'transform') {
                // when mover finished crossing, resume auto oscillation smoothly
                // align CSS animation phase so it continues without a jump
                try { snowballMover.style.animationDelay = `-${MOVE_DURATION}ms`; startAutoMove(snowballMover); } catch (e) { }
                snowballMover.removeEventListener('transitionend', onEnd);
                // cleanup inline transitions after small delay
                setTimeout(() => {
                  try { snowballMover.style.transition = ''; snowballMover.style.transform = ''; snowballScaler.style.transition = ''; snowballScaler.style.transform = ''; } catch (e) { }
                  isAnimating = false;
                }, 80);
              }
            };
            snowballMover.addEventListener('transitionend', onEnd);
          } catch (e) {
            isAnimating = false;
          }
        }, 300);
      }, quoteMs);
    });
  }

  // initial bind
  initDynamicBindings();

  // ===== Home music control =====
  const topbarMusicBtn = document.querySelector('.topbar__music');
  let homeAudio = null;
  // toggle state (user can mute/unmute) - persisted in localStorage so user preference survives reloads
  const MUSIC_KEY = 'hm_music_enabled';
  let isMusicEnabled = localStorage.getItem(MUSIC_KEY) !== '0';
  let isMusicPlaying = false;
  const HOME_TRACK_COUNT = 5;

  function pickRandomHomeTrack() {
    const i = Math.floor(Math.random() * HOME_TRACK_COUNT) + 1;
    return `./assets/sound/sound_music_home_${i}.mp3`;
  }

  function clearHomeAudio() {
    if (!homeAudio) return;
    try {
      homeAudio.pause();
      homeAudio.currentTime = 0;
      homeAudio.removeEventListener('ended', homeAudio._onEnded);
    } catch (e) { }
    homeAudio = null;
    isMusicPlaying = false;
    topbarMusicBtn?.classList.remove('playing');
  }

  function playHomeMusic() {
    if (!isMusicEnabled) return;
    // avoid creating multiple audio instances
    if (homeAudio) return;
    const src = pickRandomHomeTrack();
    homeAudio = new Audio(src);
    homeAudio.volume = 0.35;
    homeAudio._onEnded = () => {
      // play next random track if still enabled
      if (!isMusicEnabled) return clearHomeAudio();
      playHomeMusic();
    };
    homeAudio.addEventListener('ended', homeAudio._onEnded);
    homeAudio.play().then(() => {
      isMusicPlaying = true;
      topbarMusicBtn?.classList.add('playing');
    }).catch(() => {
      // autoplay might be blocked; keep state tidy
      clearHomeAudio();
    });
  }

  function stopHomeMusic() {
    if (!homeAudio) return;
    try {
      homeAudio.pause();
      homeAudio.currentTime = 0;
      homeAudio.removeEventListener('ended', homeAudio._onEnded);
    } catch (e) { }
    homeAudio = null;
    isMusicPlaying = false;
    topbarMusicBtn?.classList.remove('playing');
  }

  topbarMusicBtn?.addEventListener('click', () => {
    isMusicEnabled = !isMusicEnabled;
    try { localStorage.setItem(MUSIC_KEY, isMusicEnabled ? '1' : '0'); } catch (e) { }
    if (isMusicEnabled) playHomeMusic();
    else stopHomeMusic();
  });

  // Auto-play on initial load only if we're on home content
  const lastPage = localStorage.getItem('HM_LAST_PAGE');
  const initialIsHome = !lastPage || lastPage === 'home'; // page loads with home content by default
  if (initialIsHome) {
    // try to start music (may be blocked by browser)
    setTimeout(() => {
      if (isMusicEnabled) playHomeMusic();
    }, 300);
  }

  // track current page for stats
  let _currentPage = 'home';
  try { if (window.HiMathStats && typeof window.HiMathStats.startPage === 'function') window.HiMathStats.startPage('home'); } catch (e) { }

  // ===== Snow effect (multi-area) =====
  // We'll create small `.ice-container` elements inside topbar / sidebar / content
  // and run a single interval that creates flakes for each visible container.
  let _snowInterval = null;

  function createSnowflakeIn(container) {
    if (!container) return;
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    const snowflakeChars = ['❄', '❅', '❆', '•'];
    snowflake.innerText = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];

    // place within container (percent)
    snowflake.style.left = Math.random() * 100 + '%';

    const size = Math.random() * 15 + 10 + 'px';
    snowflake.style.fontSize = size;

    const fallDuration = Math.random() * 5 + 3 + 's';
    const swayDuration = Math.random() * 2 + 2 + 's';

    snowflake.style.animation = `fall ${fallDuration} linear infinite, sway ${swayDuration} ease-in-out infinite alternate`;

    if (parseFloat(size) < 15) {
      snowflake.style.opacity = Math.random() * 0.4 + 0.3;
      snowflake.style.filter = 'blur(1px)';
    } else {
      snowflake.style.opacity = Math.random() * 0.4 + 0.6;
      snowflake.style.filter = 'blur(0px)';
    }

    container.appendChild(snowflake);
    setTimeout(() => snowflake.remove(), Math.max(3500, parseFloat(fallDuration) * 1000 + 500));
  }

  function ensureIceContainer(parentEl, id) {
    if (!parentEl) return null;
    let c = parentEl.querySelector(`#${id}`);
    if (!c) {
      c = document.createElement('div');
      c.id = id;
      c.className = 'ice-container';
      parentEl.appendChild(c);
    }
    return c;
  }

  function removeIceContainer(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function startSnowMulti({ content = false } = {}) {
    const topbar = document.querySelector('.topbar');
    const sidebar = document.querySelector('.sidebar');
    const app = document.querySelector('.app');

    // always ensure topbar container
    ensureIceContainer(topbar, 'ice-topbar');
    // ensure sidebar only if visible
    if (sidebar && !(app && app.classList.contains('sidebar-hidden'))) ensureIceContainer(sidebar, 'ice-sidebar');
    // content only when requested
    if (content) ensureIceContainer(document.querySelector('.content'), 'ice-content');

    if (_snowInterval) return; // already running
    _snowInterval = setInterval(() => {
      const containers = Array.from(document.querySelectorAll('.ice-container'));
      containers.forEach(c => {
        if (Math.random() < 0.6) createSnowflakeIn(c);
      });
    }, 140);
  }

  function stopSnowAll() {
    if (_snowInterval) {
      clearInterval(_snowInterval);
      _snowInterval = null;
    }
    // remove all ice containers
    ['ice-topbar', 'ice-sidebar', 'ice-content'].forEach(removeIceContainer);
  }

  function removeContentSnow() { removeIceContainer('ice-content'); }

  // ensure topbar/sidebar snow exist immediately; content only if initial home
  startSnowMulti({ content: initialIsHome });
  if (!isMusicEnabled) topbarMusicBtn?.classList.remove('playing');
  // ===== end snow effect =====
  // ===== end home music control =====

  // Simple page render when clicking nav items or subitems
  function renderPanel(key, title) {
    // Luu lai trang hien tai de F5 khong bi mat
    localStorage.setItem('HM_LAST_PAGE', key);
    localStorage.setItem('HM_LAST_TITLE', title || '');
    const content = document.querySelector('.content');
    if (!content) return;

    // control global home music: stop when navigating away
    if (key === 'home') {
      content.style.overflowY = 'hidden';
    } else {
      content.style.overflowY = 'auto';
    }
    if (key !== 'home') {

      try { stopHomeMusic(); } catch (e) { }
      try { removeContentSnow(); } catch (e) { }
    }

    // cleanup any active panel-specific listeners, timers, or mounted modules
    if (content._digitsKeydownHandler) {
      document.removeEventListener('keydown', content._digitsKeydownHandler);
      delete content._digitsKeydownHandler;
    }
    if (content._ghepCleanup) {
      content._ghepCleanup();
      delete content._ghepCleanup;
    }
    if (content._mountedPanel && typeof content._mountedPanel.unmount === 'function') {
      try { content._mountedPanel.unmount(content); } catch (e) { console.warn('Error during panel unmount', e); }
      delete content._mountedPanel;
    }

    // close any open dropdowns when navigating home
    if (key === 'home') {
      document.querySelectorAll('[data-dropdown]').forEach(btn => {
        const k = btn.getAttribute('data-dropdown');
        const panel = k ? document.querySelector(`[data-submenu="${k}"]`) : null;
        btn.setAttribute('aria-expanded', 'false');
        panel?.classList.remove('is-open');
        const chev = btn.querySelector('.nav__chev');
        if (chev) chev.style.transform = 'rotate(0deg)';
      });

      // restore original home content
      content.innerHTML = initialContentHTML;
      initDynamicBindings();
      // Cập nhật lại UI đăng nhập (để bind lại nút thoát)
      updateAuthUI();
      // ensure snow and music are active on home
      try { if (isMusicEnabled) playHomeMusic(); } catch (e) { }
      try { startSnowMulti({ content: true }); } catch (e) { }
      return;
    }

    if (key === 'digits-hoc-so') {
      content.innerHTML = '<div class="loading">Đang tải...</div>';
      import('./panels/hoc-chu-so/panel.js').then(mod => {
        if (content._mountedPanel && typeof content._mountedPanel.unmount === 'function') {
          try { content._mountedPanel.unmount(content); } catch (e) { console.warn('Error during panel unmount', e); }
          delete content._mountedPanel;
        }
        mod.mount(content);
        content._mountedPanel = mod;
      }).catch(err => {
        console.error('Failed to load hoc-chu-so panel', err);
        content.innerHTML = '<div class="panel"><h2>Lỗi khi tải panel</h2></div>';
      });
      return;
    }


    if (key === 'digits-ghep-so') {
      content.innerHTML = '<div class="loading">Đang tải...</div>';
      import('./panels/ghep-so/panel.js').then(mod => {
        if (content._mountedPanel && typeof content._mountedPanel.unmount === 'function') {
          try { content._mountedPanel.unmount(content); } catch (e) { console.warn('Error during panel unmount', e); }
          delete content._mountedPanel;
        }
        mod.mount(content);
        content._mountedPanel = mod;
      }).catch(err => {
        console.error('Failed to load ghep-so panel', err);
        content.innerHTML = '<div class="panel"><h2>Lỗi khi tải panel</h2></div>';
      });
      return;
    }

    if (key === 'digits-chan-le') {
      content.innerHTML = '<div class="loading">Đang tải...</div>';
      import('./panels/chan-le/panel.js').then(mod => {
        if (content._mountedPanel && typeof content._mountedPanel.unmount === 'function') {
          try { content._mountedPanel.unmount(content); } catch (e) { console.warn('Error during panel unmount', e); }
          delete content._mountedPanel;
        }
        mod.mount(content);
        content._mountedPanel = mod;
      }).catch(err => {
        console.error('Failed to load chan-le panel', err);
        content.innerHTML = '<div class="panel"><h2>Lỗi khi tải panel</h2></div>';
      });
      return;
    }

    if (key === 'digits-dem-so') {
      content.innerHTML = '<div class="loading">Đang tải...</div>';
      import('./panels/dem-so/panel.js').then(mod => {
        if (content._mountedPanel && typeof content._mountedPanel.unmount === 'function') {
          try { content._mountedPanel.unmount(content); } catch (e) { console.warn('Error during panel unmount', e); }
          delete content._mountedPanel;
        }
        mod.mount(content);
        content._mountedPanel = mod;
      }).catch(err => {
        console.error('Failed to load dem-so panel', err);
        content.innerHTML = '<div class="panel"><h2>Lỗi khi tải panel</h2></div>';
      });
      return;
    }

    if (key === 'compare-so-sanh') {
      content.innerHTML = '<div class="loading">Đang tải...</div>';
      import('./panels/so-sanh/panel.js').then(mod => {
        if (content._mountedPanel && typeof content._mountedPanel.unmount === 'function') {
          try { content._mountedPanel.unmount(content); } catch (e) { console.warn('Error during panel unmount', e); }
          delete content._mountedPanel;
        }
        mod.mount(content);
        content._mountedPanel = mod;
      }).catch(err => {
        console.error('Failed to load so-sanh panel', err);
        content.innerHTML = '<div class="panel"><h2>Lỗi khi tải panel</h2></div>';
      });
      return;
    }

    if (key === 'compare-xep-so') {
      content.innerHTML = '<div class="loading">Đang tải...</div>';
      import('./panels/xep-so/panel.js').then(mod => {
        if (content._mountedPanel && typeof content._mountedPanel.unmount === 'function') {
          try { content._mountedPanel.unmount(content); } catch (e) { console.warn('Error during panel unmount', e); }
          delete content._mountedPanel;
        }
        mod.mount(content);
        content._mountedPanel = mod;
      }).catch(err => {
        console.error('Failed to load xep-so panel', err);
        content.innerHTML = '<div class="panel"><h2>Lỗi khi tải panel</h2></div>';
      });
      return;
    }

    if (key === 'practice-tinh-toan') {
      content.innerHTML = '<div class="loading">Đang tải...</div>';
      import('./panels/practice-tinh-toan/panel.js').then(mod => {
        if (content._mountedPanel && typeof content._mountedPanel.unmount === 'function') {
          try { content._mountedPanel.unmount(content); } catch (e) { console.warn('Error during panel unmount', e); }
          delete content._mountedPanel;
        }
        mod.mount(content);
        content._mountedPanel = mod;
      }).catch(err => {
        console.error('Failed to load practice-tinh-toan panel', err);
        content.innerHTML = '<div class="panel"><h2>Lỗi khi tải panel</h2></div>';
      });
      return;
    }

    if (key === 'practice-nhan-ngon') {
      content.innerHTML = '<div class="loading">Đang tải...</div>';
      import('./panels/practice-nhan-ngon/panel.js').then(mod => {
        if (content._mountedPanel && typeof content._mountedPanel.unmount === 'function') {
          try { content._mountedPanel.unmount(content); } catch (e) { console.warn('Error during panel unmount', e); }
          delete content._mountedPanel;
        }
        mod.mount(content);
        content._mountedPanel = mod;
      }).catch(err => {
        console.error('Failed to load practice-nhan-ngon panel', err);
        content.innerHTML = '<div class="panel"><h2>Lỗi khi tải panel</h2></div>';
      });
      return;
    }

    if (key === 'practice-viet-so') {
      content.innerHTML = '<div class="loading">Đang tải...</div>';
      import('./panels/practice-viet-so/panel.js').then(mod => {
        if (content._mountedPanel && typeof content._mountedPanel.unmount === 'function') {
          try { content._mountedPanel.unmount(content); } catch (e) { console.warn('Error during panel unmount', e); }
          delete content._mountedPanel;
        }
        mod.mount(content);
        content._mountedPanel = mod;
      }).catch(err => {
        console.error('Failed to load practice-viet-so panel', err);
        content.innerHTML = '<div class="panel"><h2>Lỗi khi tải panel</h2></div>';
      });
      return;
    }

    if (key === 'games-dino') {
      content.innerHTML = '<div class="loading">Đang tải...</div>';
      import('./panels/dino-math/panel.js').then(mod => {
        if (content._mountedPanel && typeof content._mountedPanel.unmount === 'function') {
          try { content._mountedPanel.unmount(content); } catch (e) { console.warn('Error during panel unmount', e); }
          delete content._mountedPanel;
        }
        mod.mount(content);
        content._mountedPanel = mod;
      }).catch(err => {
        console.error('Failed to load dino-math panel', err);
        content.innerHTML = '<div class="panel"><h2>Lỗi khi tải panel</h2></div>';
      });
      return;
    }

    if (key === 'games') {
      // mount the "Hứng táo" overview panel
      content.innerHTML = '<div class="loading">Đang tải...</div>';
      import('./panels/hung-tao/panel.js').then(mod => {
        if (content._mountedPanel && typeof content._mountedPanel.unmount === 'function') {
          try { content._mountedPanel.unmount(content); } catch (e) { console.warn('Error during panel unmount', e); }
          delete content._mountedPanel;
        }
        mod.mount(content);
        content._mountedPanel = mod;
      }).catch(err => {
        console.error('Failed to load hung-tao panel', err);
        content.innerHTML = '<div class="panel"><h2>Lỗi khi tải panel</h2></div>';
      });
      return;
    }

    if (key === 'learning') {
      content.innerHTML = '<div class="loading">Đang tải...</div>';
      import('./panels/learning/panel.js').then(mod => {
        if (content._mountedPanel && typeof content._mountedPanel.unmount === 'function') {
          try { content._mountedPanel.unmount(content); } catch (e) { console.warn('Error during panel unmount', e); }
          delete content._mountedPanel;
        }
        mod.mount(content);
        content._mountedPanel = mod;
      }).catch(err => {
        console.error('Failed to load learning panel', err);
        content.innerHTML = '<div class="panel"><h2>Lỗi khi tải Góc Học Tập</h2></div>';
      });
      return;
    }

    if (key === 'users') {
      content.innerHTML = '<div class="loading">Đang tải...</div>';
      import('./panels/users/panel.js').then(mod => {
        if (content._mountedPanel && typeof content._mountedPanel.unmount === 'function') {
          try { content._mountedPanel.unmount(content); } catch (e) { console.warn('Error during panel unmount', e); }
          delete content._mountedPanel;
        }
        mod.mount(content);
        content._mountedPanel = mod;
      }).catch(err => {
        console.error('Failed to load users panel', err);
        content.innerHTML = '<div class="panel"><h2>Lỗi khi tải mục Phụ huynh</h2></div>';
      });
      return;
    }

    if (key === 'about-us') {
      content.innerHTML = '<div class="loading">Đang tải...</div>';
      import('./panels/about-us/panel.js').then(mod => {
        if (content._mountedPanel && typeof content._mountedPanel.unmount === 'function') {
          try { content._mountedPanel.unmount(content); } catch (e) { console.warn('Error during panel unmount', e); }
          delete content._mountedPanel;
        }
        mod.mount(content);
        content._mountedPanel = mod;
      }).catch(err => {
        console.error('Failed to load about-us panel', err);
        content.innerHTML = '<div class="panel"><h2>Lỗi khi tải trang Về chúng tớ</h2></div>';
      });
      return;
    }

    if (key === 'leaderboard') {
      content.innerHTML = '<div class="loading">Đang tải...</div>';
      import('./panels/leaderboard/panel.js').then(mod => {
        if (content._mountedPanel && typeof content._mountedPanel.unmount === 'function') {
          try { content._mountedPanel.unmount(content); } catch (e) { console.warn('Error during panel unmount', e); }
          delete content._mountedPanel;
        }
        mod.mount(content);
        content._mountedPanel = mod;
      }).catch(err => {
        console.error('Failed to load leaderboard panel', err);
        content.innerHTML = '<div class="panel"><h2>Lỗi khi tải bảng xếp hạng</h2></div>';
      });
      return;
    }

    if (key === 'achievements') {
      content.innerHTML = '<div class="loading">Đang tải...</div>';
      import('./panels/achievements/panel.js').then(mod => {
        if (content._mountedPanel && typeof content._mountedPanel.unmount === 'function') {
          try { content._mountedPanel.unmount(content); } catch (e) { console.warn('Error during panel unmount', e); }
          delete content._mountedPanel;
        }
        mod.mount(content);
        content._mountedPanel = mod;
      }).catch(err => {
        console.error('Failed to load achievements panel', err);
        content.innerHTML = '<div class="panel"><h2>Lỗi khi tải thành tích</h2></div>';
      });
      return;
    }

    if (key === 'rewards') {
      content.innerHTML = '<div class="loading">Đang tải...</div>';
      import('./panels/rewards/panel.js').then(mod => {
        if (content._mountedPanel && typeof content._mountedPanel.unmount === 'function') {
          try { content._mountedPanel.unmount(content); } catch (e) { console.warn('Error during panel unmount', e); }
          delete content._mountedPanel;
        }
        mod.mount(content);
        content._mountedPanel = mod;
      }).catch(err => {
        console.error('Failed to load rewards panel', err);
        content.innerHTML = '<div class="panel"><h2>Lỗi khi tải phần thưởng</h2></div>';
      });
      return;
    }

    // fallback simple panel
    content.innerHTML = `
      <div class="panel">
        <h2>${title}</h2>
        <p>Nội dung sẽ được cập nhật.</p>
      </div>
    `;
  }

  // initDigitsPanel moved to panels/hoc-chu-so/panel.js (module)

  // initGhepSoGame is migrated to panels/ghep-so/panel.js (module)

  // Page title mapping for clearer panel headers
  const PAGE_TITLES = {
    'home': 'Trang chủ',
    'digits-hoc-so': 'Học chữ số — Học số',
    'digits-ghep-so': 'Học chữ số — Ghép số',
    'digits-chan-le': 'Học chữ số — Chẵn lẻ',
    'digits-dem-hinh': 'Học chữ số — Đếm hình',
    'digits-dem-so': 'Học chữ số — Đếm số',
    'compare-so-sanh': 'Phép so sánh — So sánh số',
    'compare-xep-so': 'Phép so sánh — Xếp số',
    'practice-tinh-toan': 'Luyện tập — Tính toán',
    'practice-nhan-ngon': 'Luyện tập — Tính bằng ngón tay',
    'practice-so-sanh': 'Luyện tập — So sánh',
    'games': 'Trò chơi',
    'games-dino': 'Trò chơi — Khủng long giỏi toán',
    'learning': 'Góc Học Tập',
    'users': 'Người dùng',
    'leaderboard': 'Bảng Xếp Hạng',
    'achievements': 'Thành Tích',
    'rewards': 'Phần Thưởng',
    'digits': 'Học chữ số',
    'compare': 'Phép so sánh',
    'practice': 'Luyện tập'
  };

  // Click handler for any element that carries data-page.
  // If the clicked element is a dropdown toggle (has class nav__item--btn or attribute data-dropdown)
  // we DO NOT navigate — only when clicking a subitem or a top-level item without submenu.
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-page]');
    if (!el) return;

    // If this element is a dropdown toggle / nav button with submenu, ignore here
    if (el.classList.contains('nav__item--btn') || el.hasAttribute('data-dropdown')) {
      return;
    }

    e.preventDefault();

    const key = el.getAttribute('data-page');
    const rawText = (el.textContent || key || '').trim();
    const title = PAGE_TITLES[key] || rawText || key;

    // update active state: mark the closest top-level nav__item as active
    document.querySelectorAll('.nav__item').forEach(n => n.classList.remove('is-active'));
    const parentItem = el.closest('.nav__item');
    if (parentItem) parentItem.classList.add('is-active');

    // update subitem active state: clear others and mark this subitem if applicable
    document.querySelectorAll('.nav__subitem').forEach(s => s.classList.remove('is-active'));
    if (el.classList.contains('nav__subitem')) {
      el.classList.add('is-active');
    }

    // close sidebar on mobile
    if (isMobileLayout()) closeSidebar();

    // if protected, ensure auth
    if (PROTECTED_KEYS.has(key) && !isAuthed()) {
      showAuthOverlay();
      // small hint and stop navigation
      return openAuth();
    }

    hideAuthOverlay();
    try {
      if (window.HiMathStats && typeof window.HiMathStats.endPage === 'function') window.HiMathStats.endPage(_currentPage);
    } catch (e) { }
    // render panel with clear title
    renderPanel(key, title);
    try { if (window.HiMathStats && typeof window.HiMathStats.startPage === 'function') window.HiMathStats.startPage(key); } catch (e) { }
    _currentPage = key;
  });



})();

/* === LOGIC QUEN MAT KHAU (DEMO) === */
// Tu dong gan logic khi DOM load xong
(function () {
  function initForgotPassword() {
    const btnForgot = document.getElementById('btnForgotPass');
    const modalForgot = document.getElementById('forgot-password-modal');
    const btnCloseForgot = document.getElementById('btnCloseForgot');
    const formStep1 = document.getElementById('forgot-step-1');
    const formStep2 = document.getElementById('forgot-step-2');

    // Mo modal
    if (btnForgot) {
      // Clone node de tranh duplicate listener neu init nhieu lan
      const newBtn = btnForgot.cloneNode(true);
      btnForgot.parentNode.replaceChild(newBtn, btnForgot);

      newBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Nut nam trong form nen can chan submit
        if (modalForgot) modalForgot.hidden = false;
        // Reset state
        if (formStep1) formStep1.hidden = false;
        if (formStep2) formStep2.hidden = true;
        const i1 = document.getElementById('forgot_username');
        if (i1) i1.value = '';
        const i2 = document.getElementById('forgot_otp');
        if (i2) i2.value = '';
        const i3 = document.getElementById('forgot_new_pass');
        if (i3) i3.value = '';
      });
    }

    // Dong modal
    if (btnCloseForgot) {
      const newClose = btnCloseForgot.cloneNode(true);
      btnCloseForgot.parentNode.replaceChild(newClose, btnCloseForgot);

      newClose.addEventListener('click', () => {
        if (modalForgot) modalForgot.hidden = true;
      });
    }

    // Xu ly Step 1: Lay ma
    if (formStep1) {
      // Clone form de clear listener cu
      const newForm1 = formStep1.cloneNode(true);
      formStep1.parentNode.replaceChild(newForm1, formStep1);

      newForm1.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('forgot_username').value;

        try {
          const apiUrl = window.API_CONFIG?.ENDPOINTS?.AUTH?.FORGOT_PASSWORD || 'http://localhost:3000/api/auth/forgot-password';
          const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
          });
          const data = await res.json();

          if (data.success) {
            // Chuyen sang step 2
            newForm1.hidden = true;

            // Can lay lai reference form 2 vi no co the da bi clone/mat reference
            const f2 = document.getElementById('forgot-step-2');
            if (f2) f2.hidden = false;

            console.log("DEMO OTP:", data.debug_otp);
            alert("Mã xác thực là: " + data.debug_otp + "\n(Trong thực tế mã này sẽ gửi về email/sđt)");
          } else {
            alert(data.message);
          }
        } catch (err) {
          alert('Lỗi kết nối server!');
        }
      });
    }

    // Xu ly Step 2: Doi pass
    if (formStep2) {
      const newForm2 = formStep2.cloneNode(true);
      formStep2.parentNode.replaceChild(newForm2, formStep2);

      newForm2.addEventListener('submit', async (e) => {
        e.preventDefault();
        const otp = document.getElementById('forgot_otp').value;
        const newPass = document.getElementById('forgot_new_pass').value;
        const username = document.getElementById('forgot_username').value;

        try {
          const apiUrl = window.API_CONFIG?.ENDPOINTS?.AUTH?.RESET_PASSWORD || 'http://localhost:3000/api/auth/reset-password';
          const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Fix: Gui OTP kem theo de server verify
            body: JSON.stringify({ username, new_password: newPass, otp: otp })
          });
          const data = await res.json();

          if (data.success) {
            alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
            if (modalForgot) modalForgot.hidden = true;
          } else {
            alert(data.message);
          }
        } catch (err) {
          alert('Lỗi kết nối server!');
        }
      });
    }
  }

  // Init ngay neu DOM da load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForgotPassword);
  } else {
    initForgotPassword();
    // Retry de phong dynamic load
    setTimeout(initForgotPassword, 1000);
  }
  // --- STREAK CHECK-IN LOGIC ---
  async function performDailyCheckIn() {
    if (!isAuthed()) return;
    try {
      const headers = getAuthHeaders();
      const checkInUrl = window.API_CONFIG?.ENDPOINTS?.AUTH?.CHECK_IN || 'http://localhost:3000/api/auth/check-in';
      const res = await fetch(checkInUrl, {
        method: 'POST',
        headers: headers
      });
      const data = await res.json();
      if (data.success) {
        // console.log("Daily Check-in Success", data.streak);
        const btn = document.getElementById('streakBtn');
        const display = document.getElementById('streakCountDisplay');
        if (btn) btn.style.display = 'inline-flex';
        if (display) display.innerText = data.streak || 0;
      }
    } catch (e) {
      console.error("Streak Check-in Failed", e);
    }
  }

  // Goi checking ngay
  performDailyCheckIn();

})();

/* === LOGIC UPDATE EMAIL (FORCE) === */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const updateForm = document.getElementById('updateEmailForm');
    if (updateForm) {
      updateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('update_email_input').value;
        const dob = document.getElementById('update_dob_input').value;

        // Lay user_id tu localStorage
        let userStart = null;
        try {
          userStart = JSON.parse(localStorage.getItem('hm_user'));
        } catch (err) { }

        const userId = userStart ? (userStart.id || userStart.user_id) : null;

        if (!userId) {
          alert("Lỗi: Không tìm thấy phiên đăng nhập.");
          window.location.reload();
          return;
        }

        try {
          const apiUrl = window.API_CONFIG?.ENDPOINTS?.AUTH?.UPDATE_INFO || 'http://localhost:3000/api/auth/update-info';
          const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, email: email, dob: dob })
          });
          const data = await res.json();

          if (data.success) {
            alert('✅ Cập nhật thông tin thành công!');
            window.location.reload();
          } else {
            alert('❌ ' + data.message);
          }
        } catch (err) {
          alert('Lỗi kết nối server!');
        }
      });
    }
  });
})();
