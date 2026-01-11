document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup Theme Logic
    const themeBtn = document.getElementById('themeToggleBtn');

    let activeInterval = null;
    let butterflyInterval = null;

    // Helper to start effects based on theme name
    const startTheme = (themeName) => {
        clearAll(); // Stop existing

        if (themeName === 'winter') {
            document.body.classList.add('theme-winter');
            activeInterval = setInterval(() => createFallingObject(snowIcons, 'snow'), 50);
        } else if (themeName === 'spring') {
            document.body.classList.add('theme-spring');
            activeInterval = setInterval(() => createFallingObject(springIcons, 'flower'), 100);
            butterflyInterval = setInterval(() => createButterfly(), 1500);
            if (window.innerWidth > 600) {
                const numberOfPlants = Math.floor(window.innerWidth / 60);
                for (let i = 0; i < numberOfPlants; i++) plantFlower();
            }
        } else if (themeName === 'autumn') {
            document.body.classList.add('theme-autumn');
            activeInterval = setInterval(() => createFallingObject(autumnIcons, 'leaf'), 80);
        }

        // Thay đổi text instruction theo theme
        const instructionText = document.querySelector('.instruction-text');
        if (instructionText) {
            if (themeName === 'autumn') {
                instructionText.textContent = 'Đừng đập vỡ Bí Ngô';
            } else if (themeName === 'winter') {
                instructionText.textContent = 'Đừng đập vỡ Snow Ball';
            } else if (themeName === 'spring') {
                instructionText.textContent = 'Đừng xé rách bao Lì Xì';
            } else {
                instructionText.textContent = 'Đừng đập vỡ Snow Ball';
            }
        }

        // Save to storage
        if (themeName) localStorage.setItem('hm_theme', themeName);
        else localStorage.removeItem('hm_theme');
    };

    // Create Menu if not exists
    if (!document.getElementById('theme-menu')) {
        const menu = document.createElement('div');
        menu.id = 'theme-menu';
        menu.className = 'theme-menu';
        menu.innerHTML = `
            <button id="winter-btn" class="theme-option"><span>❄️</span> Bright Winter</button>
            <button id="spring-btn" class="theme-option"><span>🦋</span> Red Spring</button>
            <button id="autumn-btn" class="theme-option"><span>🍁</span> Golden Autumn</button>
            <button id="stop-btn" class="theme-option" style="color: #ff6b6b;"><span>🚫</span> Mặc định</button>
        `;
        document.body.appendChild(menu);

        if (themeBtn) {
            themeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                menu.classList.toggle('show');
            });
        }

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && e.target !== themeBtn && (!themeBtn || !themeBtn.contains(e.target))) {
                menu.classList.remove('show');
            }
        });
    }

    if (!document.getElementById('bottom-garden')) {
        const garden = document.createElement('div');
        garden.id = 'bottom-garden';
        document.body.appendChild(garden);
    }

    // 2. Load logic from thamkhaoindex (but wiring to our menu buttons)
    const winterBtn = document.getElementById('winter-btn');
    const springBtn = document.getElementById('spring-btn');
    const stopBtn = document.getElementById('stop-btn');
    const menu = document.getElementById('theme-menu');
    const bottomGarden = document.getElementById('bottom-garden');

    // Bind events - using the helper
    const autumnBtn = document.getElementById('autumn-btn');
    if (winterBtn) winterBtn.onclick = () => startTheme('winter');
    if (springBtn) springBtn.onclick = () => startTheme('spring');
    if (autumnBtn) autumnBtn.onclick = () => startTheme('autumn');
    if (stopBtn) stopBtn.onclick = () => startTheme(null);

    // 3. Restore Theme from LocalStorage on first load
    // 3. Restore Theme from LocalStorage on first load (Default: winter)
    let savedTheme = localStorage.getItem('hm_theme');
    if (!savedTheme) {
        savedTheme = 'winter'; // Default
        localStorage.setItem('hm_theme', 'winter');
    }
    startTheme(savedTheme);

    // Mảng icon
    // Tuyết: Chỉ dùng hình trắng hoặc text, ta sẽ force màu trắng bằng CSS
    const snowIcons = ['❄️', '❅', '❆', '•', '●'];
    // Hoa rơi: Bỏ bướm ra khỏi đây
    const springIcons = ['🌸', '🌺', '🌹', '🌷', '🏵️'];
    // Lá mùa thu: Lá phong và lá vàng
    const autumnIcons = ['🍁', '🍂', '🍃'];
    // Đầu bông hoa dưới đất
    const flowerHeads = ['🌻', '🌹', '🌷', '🌼', '🌺'];

    function randomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // --- RESET ---
    function clearAll() {
        if (activeInterval) clearInterval(activeInterval);
        if (butterflyInterval) clearInterval(butterflyInterval);

        document.body.classList.remove('theme-winter', 'theme-spring', 'theme-autumn');

        // Xóa vật thể rơi
        document.querySelectorAll('.falling-obj').forEach(el => el.remove());
        // Xóa bướm
        document.querySelectorAll('.butterfly').forEach(el => el.remove());
        // Xóa quả dẻ
        document.querySelectorAll('.acorn').forEach(el => el.remove());
        // Xóa vườn hoa
        bottomGarden.innerHTML = '';
    }

    // --- TẠO VẬT THỂ RƠI (Tuyết / Hoa) ---
    function createFallingObject(iconsArray, type) {
        const obj = document.createElement('div');
        obj.classList.add('falling-obj');

        // Nếu là tuyết, thêm class snow để CSS xử lý màu trắng + xóa bóng
        if (type === 'snow') obj.classList.add('snow');

        // Ensure emoji rendering
        obj.innerHTML = randomItem(iconsArray);

        const size = Math.random() * 20 + 10;
        obj.style.fontSize = `${size}px`;
        obj.style.left = `${Math.random() * 100}vw`;

        const duration = Math.random() * 5 + 3;
        obj.style.animation = `fallAndSpin ${duration}s linear infinite`;
        obj.style.opacity = Math.random() * 0.5 + 0.5;

        document.body.appendChild(obj);
        setTimeout(() => { obj.remove(); }, duration * 1000);
    }

    // --- TẠO CON BƯỚM BAY (Logic riêng) ---
    function createButterfly() {
        const butterfly = document.createElement('div');
        butterfly.classList.add('butterfly');
        butterfly.textContent = '🦋';

        // Random vị trí bắt đầu theo chiều dọc (để bướm bay ở nhiều độ cao khác nhau)
        const startY = Math.random() * 80 + 10; // Từ 10% đến 90% chiều cao màn hình
        butterfly.style.top = `${startY}vh`;

        // Random kích thước
        const size = Math.random() * 1.5 + 1; // 1rem đến 2.5rem
        butterfly.style.fontSize = `${size}rem`;

        // Thời gian bay ngang màn hình
        const duration = Math.random() * 5 + 8; // 8s đến 13s
        butterfly.style.animation = `flyAcross ${duration}s linear forwards`;

        document.body.appendChild(butterfly);

        // Xóa sau khi bay xong
        setTimeout(() => { butterfly.remove(); }, duration * 1000);
    }

    // --- TẠO QUẢ DẺ/BÁNH TRUNG THU RƠI ---
    function createAcorn() {
        const acorn = document.createElement('div');
        acorn.classList.add('acorn');

        // Random chọn icon: bánh trung thu hoặc hạt dẻ
        const icons = ['🍂', '�']; // Lá úa và lá phong
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];

        acorn.innerHTML = `
            <div class="acorn-icon">${randomIcon}</div>
            <div class="acorn-text">Đừng đập vỡ Lá Úa nhé</div>
        `;

        // Random kích thước
        const size = Math.random() * 30 + 60; // 60px đến 90px (to hơn để chứa text)
        acorn.style.width = `${size}px`;
        acorn.style.height = `${size}px`;

        // Random vị trí bắt đầu
        acorn.style.left = `${Math.random() * 100}vw`;

        // Thời gian rơi
        const duration = Math.random() * 2 + 3; // 3s đến 5s
        acorn.style.animation = `rollDown ${duration}s ease-in forwards`;

        // *** THÊM CLICK EVENT ĐỂ ĐẬP VỠ ***
        acorn.style.pointerEvents = 'auto'; // Cho phép click
        acorn.style.cursor = 'pointer';

        acorn.addEventListener('click', () => {
            // Hiện text
            const textEl = acorn.querySelector('.acorn-text');
            if (textEl) {
                textEl.style.display = 'block';
                textEl.classList.add('pop-text');
            }

            // Hiệu ứng vỡ
            acorn.classList.add('broken');

            // Xóa sau 2 giây
            setTimeout(() => {
                acorn.style.opacity = '0';
                setTimeout(() => acorn.remove(), 300);
            }, 2000);
        });

        document.body.appendChild(acorn);

        // Xóa sau khi rơi xong (nếu không bị đập)
        setTimeout(() => {
            if (acorn.parentNode) acorn.remove();
        }, duration * 1000);
    }

    // --- TRỒNG CÂY (Logic lặp 10s) ---
    function plantFlower() {
        const plant = document.createElement('div');
        plant.classList.add('plant-container');

        plant.style.left = `${Math.random() * 95}%`;
        const height = Math.random() * 80 + 50;

        const head = document.createElement('div');
        head.classList.add('flower-head');
        head.textContent = randomItem(flowerHeads);

        const stem = document.createElement('div');
        stem.classList.add('stem');
        stem.style.height = `${height}px`;

        const leaf1 = document.createElement('div');
        leaf1.classList.add('leaf', 'left');
        const leaf2 = document.createElement('div');
        leaf2.classList.add('leaf', 'right');

        stem.appendChild(leaf1);
        stem.appendChild(leaf2);
        plant.appendChild(head);
        plant.appendChild(stem);

        // Random delay một chút để các cây không mọc/lặn cùng lúc chính xác từng miligiây
        // Nhưng vẫn đảm bảo chu kỳ 10s
        plant.style.animationDelay = `-${Math.random() * 10}s`; // Trick: Bắt đầu ở thời điểm ngẫu nhiên trong chu kỳ

        bottomGarden.appendChild(plant);
    }

    // --- SỰ KIỆN ---

    // Expose API for main.js to control
    // Expose API for main.js to control
    window.ThemeEffects = {
        updateState: (isHome) => {
            const currentTheme = localStorage.getItem('hm_theme');

            // 1. FALLING OBJECTS (Snow/Flower/Leaf) - ALWAYS RUNNING
            // If activeInterval is missing but we have a theme, restart it
            if (!activeInterval && currentTheme) {
                // Determine interval based on theme
                if (currentTheme === 'winter') {
                    activeInterval = setInterval(() => createFallingObject(snowIcons, 'snow'), 50);
                } else if (currentTheme === 'spring') {
                    activeInterval = setInterval(() => createFallingObject(springIcons, 'flower'), 100);
                } else if (currentTheme === 'autumn') {
                    activeInterval = setInterval(() => createFallingObject(autumnIcons, 'leaf'), 80);
                }
            }

            // 2. HORIZONTAL OBJECTS (Butterflies) - HOME ONLY
            if (isHome) {
                // If home and spring, start butterflies if not running
                if (currentTheme === 'spring' && !butterflyInterval) {
                    butterflyInterval = setInterval(() => createButterfly(), 1500);
                }
            } else {
                // If not home, clear butterflies immediately
                if (butterflyInterval) {
                    clearInterval(butterflyInterval);
                    butterflyInterval = null;
                }
                document.querySelectorAll('.butterfly').forEach(el => el.remove());
            }
        }
    };

    // Initial Check
    const path = window.location.pathname;
    const isHome = path === '/' || path === '/index.html' || path === '/home';
    // Start theme normally first (which starts everything)
    // Then refine based on page
    if (localStorage.getItem('hm_theme')) {
        startTheme(localStorage.getItem('hm_theme'));
        window.ThemeEffects.updateState(isHome);
    }
});
