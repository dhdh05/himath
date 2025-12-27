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
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch(e) { return []; }
  }

  function saveUsers(list) {
    try { localStorage.setItem(USERS_KEY, JSON.stringify(list)); } catch(e) {}
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
    try { return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null'); } catch(e){ return null; }
  }

  function setCurrentUser(user) {
    try { localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user)); } catch(e){}
  }

  function clearCurrentUser() {
    try { localStorage.removeItem(CURRENT_USER_KEY); localStorage.removeItem(AUTH_KEY); } catch(e){}
  }



  // seed demo user immediately
  seedDemoUser();
  updateAuthUI();

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
    } catch (e) {}
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
  const PROTECTED_KEYS = new Set(['digits-hoc-so','digits-ghep-so','digits-chan-le','digits-dem-so','compare-so-sanh','compare-xep-so','practice-tinh-toan','practice-nhan-ngon','games','games-dino']);
  // Handle both forms
  // handle login and register with localStorage (demo only)
  // --- CODE MỚI: XỬ LÝ ĐĂNG NHẬP THẬT ---

  // 1. Xử lý Form Đăng Nhập
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Chặn reload trang

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      try {
        // Gọi API Backend
        const res = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (data.success) {
          // A. Lưu thông tin quan trọng vào bộ nhớ
          localStorage.setItem('user_token', data.token); // Thẻ bài để chơi game
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user)); // Thông tin user
          localStorage.setItem(AUTH_KEY, '1'); // Để giữ logic giao diện cũ của bạn

          // B. Thông báo & Đóng popup
          alert('✅ Xin chào ' + data.user.name + '! Đăng nhập thành công.');
          closeAuth();

          // C. Tải lại trang để cập nhật giao diện (hiện Avatar thay vì nút login)
          window.location.reload(); 
        } else {
          alert('❌ Lỗi: ' + data.message);
        }
      } catch (err) {
        console.error(err);
        alert('⚠️ Không kết nối được Server! Bạn đã chạy lệnh "node src/server.js" ở backend chưa?');
      }
    });
  }

  // 2. Xử lý Form Đăng Ký (Giữ tạm demo vì Backend chưa làm chức năng này)
  // 2. Xử lý Form Đăng Ký (Đã hoàn thiện)
  const registerForm = document.querySelector('[data-auth-form="register"]');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Lấy giá trị từ các ô input (Đảm bảo HTML đã đặt đúng ID này)
      const fullName = document.getElementById('reg_fullname')?.value;
      const username = document.getElementById('reg_username')?.value;
      const parentPin = document.getElementById('reg_pin')?.value;
      const password = document.getElementById('reg_password')?.value;
      const confirmPass = document.getElementById('reg_confirm')?.value;

      // Kiểm tra cơ bản
      if (!fullName || !username || !password) {
        alert('Vui lòng điền đầy đủ thông tin của bé!');
        return;
      }

      if (password !== confirmPass) {
        alert('Mật khẩu xác nhận không khớp!');
        return;
      }

      // Gửi dữ liệu sang Server
      try {
        const res = await fetch('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: fullName,
            username: username,
            password: password,
            parent_pin: parentPin, // Gửi mã PIN phụ huynh
            role: 'student'
          })
        });

        const data = await res.json();

        if (data.success) {
          alert('🎉 ' + data.message);
          // Chuyển sang tab đăng nhập sau khi đăng ký xong
          const loginTabBtn = document.querySelector('[data-auth-tab="login"]');
          if (loginTabBtn) loginTabBtn.click();
          
          // Điền sẵn username cho tiện
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

  // update hero and top UI based on auth state
  function updateAuthUI() {
    const hero = document.querySelector('.hero__copy');
    const heroActions = document.querySelector('.hero__actions');
    const avatarBtn = document.querySelector('.avatar');
    const current = getCurrentUser();

    if (current) {
      // 1. Xác định tên hiển thị
      // Server trả về 'name' (full_name), 'username'. Fallback sang childName nếu là dữ liệu cũ.
      const displayName = current.name || current.full_name || current.childName || current.username;

      // 2. Hiển thị Lời chào + Nút Đăng xuất
      if (heroActions) {
        // Style inline để căn chỉnh hàng ngang đẹp mắt ngay lập tức
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

        // 3. Gắn sự kiện click cho nút Đăng xuất vừa tạo
        const btnLogout = document.getElementById('quickLogoutBtn');
        if (btnLogout) {
            btnLogout.addEventListener('click', () => {
                if(confirm('Bé có muốn đăng xuất không?')) {
                    clearCurrentUser(); // Hàm xóa localStorage có sẵn ở trên
                    window.location.reload(); // Tải lại trang về trạng thái chưa đăng nhập
                }
            });
            // Hiệu ứng hover nhẹ
            btnLogout.addEventListener('mouseenter', () => btnLogout.style.background = 'rgba(255,255,255,0.4)');
            btnLogout.addEventListener('mouseleave', () => btnLogout.style.background = 'rgba(255,255,255,0.25)');
        }
      }

      if (avatarBtn) avatarBtn.title = `Đăng nhập: ${current.username}`;
    } else {
      // Trạng thái CHƯA đăng nhập
      if (heroActions) {
        heroActions.style.display = 'block'; // Reset về mặc định
        heroActions.innerHTML = `<button class="btn btn--primary" data-action="open-auth">Đăng nhập / Đăng ký</button>`;
      }
      if (avatarBtn) avatarBtn.title = 'Tài khoản';
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
  //     if (avatarBtn) avatarBtn.title = `Đăng nhập: ${current.username}`;
  //   } else {
  //     if (heroActions) heroActions.innerHTML = `<button class="btn btn--primary" data-action="open-auth">Đăng nhập / Đăng ký</button>`;
  //     if (avatarBtn) avatarBtn.title = 'Tài khoản';
  //   }
  // }

  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]; }); }

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
      try { startAutoMove(snowballMover); } catch (e) {}
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
      try { if (el._autoTimer) { clearTimeout(el._autoTimer); el._autoTimer = null; } } catch (e) {}
      el.classList.add('auto');
      el.classList.remove('paused');
    }

    function stopAutoMove(el) {
      if (!el) return;
      try { if (el._autoTimer) { clearTimeout(el._autoTimer); el._autoTimer = null; } } catch (e) {}
      el.classList.remove('auto');
      el.classList.add('paused');
    }

    // ensure auto-roll on home
    try { startAutoMove(snowballMover); } catch (e) {}

    // click handling: hide ball (no crack), show quote, then reappear while moving and growing
    snowballScaler.addEventListener('click', function () {
      if (isAnimating) return;
      isAnimating = true;

      // stop auto movement
      try { stopAutoMove(snowballMover); } catch (e) {}

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
                try { snowballMover.style.animationDelay = `-${MOVE_DURATION}ms`; startAutoMove(snowballMover); } catch (e) {}
                snowballMover.removeEventListener('transitionend', onEnd);
                // cleanup inline transitions after small delay
                setTimeout(() => {
                  try { snowballMover.style.transition = ''; snowballMover.style.transform = ''; snowballScaler.style.transition = ''; snowballScaler.style.transform = ''; } catch(e){}
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
  const HOME_TRACK_COUNT = 4;

  function pickRandomHomeTrack() {
    const i = Math.floor(Math.random() * HOME_TRACK_COUNT) + 1;
    return `/assets/sound/sound_music_home_${i}.mp3`;
  }

  function clearHomeAudio() {
    if (!homeAudio) return;
    try {
      homeAudio.pause();
      homeAudio.currentTime = 0;
      homeAudio.removeEventListener('ended', homeAudio._onEnded);
    } catch (e) {}
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
    } catch (e) {}
    homeAudio = null;
    isMusicPlaying = false;
    topbarMusicBtn?.classList.remove('playing');
  }

  topbarMusicBtn?.addEventListener('click', () => {
    isMusicEnabled = !isMusicEnabled;
    try { localStorage.setItem(MUSIC_KEY, isMusicEnabled ? '1' : '0'); } catch (e) {}
    if (isMusicEnabled) playHomeMusic();
    else stopHomeMusic();
  });

  // Auto-play on initial load only if we're on home content
  const initialIsHome = true; // page loads with home content by default
  if (initialIsHome) {
    // try to start music (may be blocked by browser)
    setTimeout(() => {
      if (isMusicEnabled) playHomeMusic();
    }, 300);
  }

  // track current page for stats
  let _currentPage = 'home';
  try { if (window.HiMathStats && typeof window.HiMathStats.startPage === 'function') window.HiMathStats.startPage('home'); } catch (e) {}
  
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
    ['ice-topbar','ice-sidebar','ice-content'].forEach(removeIceContainer);
  }

  function removeContentSnow() { removeIceContainer('ice-content'); }

  // ensure topbar/sidebar snow exist immediately; content only if initial home
  startSnowMulti({ content: initialIsHome });
  if (!isMusicEnabled) topbarMusicBtn?.classList.remove('playing');
  // ===== end snow effect =====
  // ===== end home music control =====

  // Simple page render when clicking nav items or subitems
  function renderPanel(key, title) {
    const content = document.querySelector('.content');
    if (!content) return;

    // control global home music: stop when navigating away
    if (key !== 'home') {
      try { stopHomeMusic(); } catch(e) {}
      try { removeContentSnow(); } catch(e) {}
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
      try { content._mountedPanel.unmount(content); } catch(e) { console.warn('Error during panel unmount', e); }
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
      // ensure snow and music are active on home
      try { if (isMusicEnabled) playHomeMusic(); } catch(e) {}
      try { startSnowMulti({ content: true }); } catch(e) {}
      return;
    }

    if (key === 'digits-hoc-so') {
      content.innerHTML = '<div class="loading">Đang tải...</div>';
      import('./panels/hoc-chu-so/panel.js').then(mod => {
        if (content._mountedPanel && typeof content._mountedPanel.unmount === 'function') {
          try { content._mountedPanel.unmount(content); } catch(e) { console.warn('Error during panel unmount', e); }
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
          try { content._mountedPanel.unmount(content); } catch(e) { console.warn('Error during panel unmount', e); }
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
          try { content._mountedPanel.unmount(content); } catch(e) { console.warn('Error during panel unmount', e); }
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
          try { content._mountedPanel.unmount(content); } catch(e) { console.warn('Error during panel unmount', e); }
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
          try { content._mountedPanel.unmount(content); } catch(e) { console.warn('Error during panel unmount', e); }
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
          try { content._mountedPanel.unmount(content); } catch(e) { console.warn('Error during panel unmount', e); }
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
          try { content._mountedPanel.unmount(content); } catch(e) { console.warn('Error during panel unmount', e); }
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
          try { content._mountedPanel.unmount(content); } catch(e) { console.warn('Error during panel unmount', e); }
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

    if (key === 'games-dino') {
      content.innerHTML = '<div class="loading">Đang tải...</div>';
      import('./panels/dino-math/panel.js').then(mod => {
        if (content._mountedPanel && typeof content._mountedPanel.unmount === 'function') {
          try { content._mountedPanel.unmount(content); } catch(e) { console.warn('Error during panel unmount', e); }
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
          try { content._mountedPanel.unmount(content); } catch(e) { console.warn('Error during panel unmount', e); }
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

    if (key === 'users') {
      content.innerHTML = '<div class="loading">Đang tải...</div>';
      import('./panels/users/panel.js').then(mod => {
        if (content._mountedPanel && typeof content._mountedPanel.unmount === 'function') {
          try { content._mountedPanel.unmount(content); } catch(e) { console.warn('Error during panel unmount', e); }
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
    'users': 'Người dùng',
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
    } catch (e) {}
    // render panel with clear title
    renderPanel(key, title);
    try { if (window.HiMathStats && typeof window.HiMathStats.startPage === 'function') window.HiMathStats.startPage(key); } catch (e) {}
    _currentPage = key;
  });
})();
