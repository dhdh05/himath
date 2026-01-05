export function mount(container) {
    if (!container) return;

    // Load CSS
    if (!document.querySelector('link[data-panel="hung-tao"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './panels/hung-tao/style.css';
        link.setAttribute('data-panel', 'hung-tao');
        document.head.appendChild(link);
    }

    container.innerHTML = `
    <div class="hungtao-panel">
      <div class="game-wrapper">
        <div class="hud">
            <div class="score-board">Điểm: <span id="score">0</span></div>
            <div id="lives-container" class="lives-wrapper"></div>
        </div>

        <div class="question-board">
            <span id="question-text">Sẵn sàng?</span>
        </div>

        <canvas id="gameCanvas" width="400" height="600"></canvas>

        <div id="start-screen" class="overlay">
            <h1>HỨNG TÁO</h1>
            <p>Dùng mũi tên Trái/Phải để di chuyển giỏ</p>
            <button id="btn-start" class="game-btn">BẮT ĐẦU</button>
        </div>

        <div id="game-over-screen" class="overlay hidden">
            <h1>KẾT THÚC!</h1>
            <p>Điểm của bé: <span id="final-score">0</span></p>
            <button id="btn-restart" class="game-btn">CHƠI LẠI</button>
        </div>
      </div>
    </div>
  `;

    // --- 1. START TRACKING: Bat dau tinh gio choi ---
    try {
        if (window.HiMathStats) {
            console.log('📊 Hung-tao: Starting page tracking...');
            window.HiMathStats.startPage('games-hung-tao');
            console.log('✅ Hung-tao: startPage called');
        } else {
            console.warn('⚠️ Hung-tao: HiMathStats not available');
        }
    } catch (e) {
        console.error('❌ Hung-tao: Error calling startPage:', e);
    }

    const qs = sel => container.querySelector(sel);
    const canvas = qs('#gameCanvas');
    const ctx = canvas.getContext('2d');

    // Game Configuration
    const LANE_COUNT = 5;
    const LANE_WIDTH = canvas.width / LANE_COUNT;

    // Game State
    let gameRunning = false;
    let score = 0;
    let lives = 5;
    let animationId;
    let currentResult = 0;
    let consecutiveWrongApples = 0;
    let frameCount = 0;
    let appleSpawnRate = 100;

    const basket = { lane: 2, y: canvas.height - 80, width: 60, height: 40, color: '#795548' };
    let apples = [];

    // --- DRAWING FUNCTIONS ---
    function drawBackground() {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 10]);
        for (let i = 1; i < LANE_COUNT; i++) {
            let x = i * LANE_WIDTH;
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
        }
        ctx.setLineDash([]);
        ctx.fillStyle = '#7CB342';
        ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
    }

    function drawBasket() {
        let x = basket.lane * LANE_WIDTH + (LANE_WIDTH - basket.width) / 2;
        ctx.fillStyle = basket.color;
        ctx.beginPath();
        ctx.moveTo(x, basket.y);
        ctx.lineTo(x + basket.width, basket.y);
        ctx.lineTo(x + basket.width - 5, basket.y + basket.height);
        ctx.lineTo(x + 5, basket.y + basket.height);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#3E2723'; ctx.lineWidth = 2; ctx.stroke();
    }

    function drawApple(apple) {
        let x = apple.lane * LANE_WIDTH + LANE_WIDTH / 2;
        ctx.fillStyle = '#D32F2F';
        ctx.beginPath();
        ctx.arc(x, apple.y, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#33691E';
        ctx.fillRect(x - 2, apple.y - 22, 4, 8);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(apple.value, x, apple.y + 2);
    }

    // --- LOGIC FUNCTIONS ---
    function generateNewQuestion() {
        const isPlus = Math.random() > 0.5;
        let a, b;
        if (isPlus) {
            a = Math.floor(Math.random() * 10);
            b = Math.floor(Math.random() * 10);
            currentResult = a + b;
            qs('#question-text').innerText = `${a} + ${b} = ?`;
        } else {
            a = Math.floor(Math.random() * 10) + 1;
            b = Math.floor(Math.random() * a);
            currentResult = a - b;
            qs('#question-text').innerText = `${a} - ${b} = ?`;
        }
        consecutiveWrongApples = 0;
    }

    function getAvailableLanes() {
        let safeLanes = [];
        for (let l = 0; l < LANE_COUNT; l++) {
            let isSafe = true;
            for (let apple of apples) {
                if (apple.lane === l && apple.y < 150) { isSafe = false; break; }
            }
            if (isSafe) safeLanes.push(l);
        }
        return safeLanes;
    }

    function spawnApple() {
        let safeLanes = getAvailableLanes();
        if (safeLanes.length === 0) return;

        let randomLane = safeLanes[Math.floor(Math.random() * safeLanes.length)];
        const hasCorrectApple = apples.some(a => a.value === currentResult);
        let shouldSpawnCorrect = false;

        if (!hasCorrectApple) {
            let chance = 0.2 + (consecutiveWrongApples * 0.15);
            if (Math.random() < chance) shouldSpawnCorrect = true;
        }

        let value;
        if (shouldSpawnCorrect) {
            value = currentResult;
            consecutiveWrongApples = 0;
        } else {
            consecutiveWrongApples++;
            do {
                if (Math.random() > 0.5) {
                    let offset = Math.floor(Math.random() * 5) - 2;
                    value = currentResult + offset;
                    if (value < 0) value = 0;
                } else {
                    value = Math.floor(Math.random() * 20);
                }
            } while (value === currentResult);
        }

        // Tinh toc do dua tren diem so: moi 10 diem tang toc do
        // 0-10 diem: toc do co ban (1.2 + random*0.4) - da tang tu 0.8 len 1.2
        // 10-20 diem: tang them 0.3
        // 20-30 diem: tang them 0.3 nua
        // Cu tiep tuc nhu vay
        const baseSpeed = 1.2 + Math.random() * 0.4; // Toc do co ban (tang tu 0.8 len 1.2)
        const speedLevel = Math.floor(score / 10); // Moi 10 diem = 1 level
        const speedIncrease = speedLevel * 0.3; // Moi level tang 0.3
        const finalSpeed = baseSpeed + speedIncrease;

        apples.push({
            lane: randomLane,
            y: -40,
            speed: finalSpeed,
            value: value
        });
    }

    function updateApples() {
        for (let i = 0; i < apples.length; i++) {
            let apple = apples[i];
            apple.y += apple.speed;

            // Check collision with basket
            if (apple.lane === basket.lane && apple.y >= basket.y && apple.y <= basket.y + basket.height) {
                checkAnswer(apple.value);
                apples.splice(i, 1);
                i--;
                continue;
            }

            // Check out of bounds
            if (apple.y > canvas.height) {
                apples.splice(i, 1);
                i--;
            }
        }
    }

    function checkAnswer(value) {
        if (value === currentResult) {
            score++;
            qs('#score').innerText = score;
            generateNewQuestion();
            apples = []; // Clear apples on correct answer for clarity
        } else {
            loseLife();
        }
    }

    function loseLife() {
        lives--;
        updateLivesUI();

        // Shake effect
        canvas.style.transform = 'translate(5px, 0)';
        setTimeout(() => canvas.style.transform = 'translate(-5px,0)', 50);
        setTimeout(() => canvas.style.transform = 'translate(0,0)', 100);

        if (lives <= 0) gameOver();
    }

    function updateLivesUI() {
        const container = qs('#lives-container');
        container.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const heart = document.createElement('span');
            heart.innerHTML = '&#10084;';
            heart.className = 'heart';
            if (i < lives) heart.classList.add('active');
            container.appendChild(heart);
        }
    }

    function gameOver() {
        gameRunning = false;
        cancelAnimationFrame(animationId);
        qs('#final-score').innerText = score;
        qs('#game-over-screen').classList.remove('hidden');
    }

    function gameLoop() {
        if (!gameRunning) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();

        frameCount++;
        // Spawn apples
        if (frameCount % appleSpawnRate === 0) spawnApple();

        drawBasket();
        updateApples();
        apples.forEach(drawApple);

        animationId = requestAnimationFrame(gameLoop);
    }

    function keyHandler(e) {
        if (!gameRunning) return;
        if (e.code === 'ArrowLeft') {
            if (basket.lane > 0) basket.lane--;
        }
        if (e.code === 'ArrowRight') {
            if (basket.lane < LANE_COUNT - 1) basket.lane++;
        }
    }

    function initGame() {
        if (animationId) cancelAnimationFrame(animationId);
        gameRunning = true;
        score = 0;
        lives = 5;
        apples = [];
        frameCount = 0;
        basket.lane = 2;
        consecutiveWrongApples = 0;

        qs('#score').innerText = score;
        updateLivesUI();
        qs('#start-screen').classList.add('hidden');
        qs('#game-over-screen').classList.add('hidden');

        generateNewQuestion();
        gameLoop();
    }

    // --- EVENTS ---
    qs('#btn-start').addEventListener('click', initGame);
    qs('#btn-restart').addEventListener('click', initGame);
    document.addEventListener('keydown', keyHandler);

    // Initial UI Setup
    updateLivesUI();

    // --- 2. CLEANUP & END TRACKING ---
    container._hungtaoCleanup = () => {
        try { qs('#btn-start')?.removeEventListener('click', initGame); } catch (e) { }
        try { qs('#btn-restart')?.removeEventListener('click', initGame); } catch (e) { }
        try { document.removeEventListener('keydown', keyHandler); } catch (e) { }
        try { cancelAnimationFrame(animationId); } catch (e) { }

        // Ghi nhan ket thuc phien choi
        try {
            if (window.HiMathStats) {
                console.log('📊 Hung-tao: Ending page tracking...');
                window.HiMathStats.endPage('games-hung-tao');
                console.log('✅ Hung-tao: endPage called');
            } else {
                console.warn('⚠️ Hung-tao: HiMathStats not available for endPage');
            }
        } catch (e) {
            console.error('❌ Hung-tao: Error calling endPage:', e);
        }

        delete container._hungtaoCleanup;
    };
}


export function unmount(container) {
    if (!container) return;
    if (container._hungtaoCleanup) container._hungtaoCleanup();
}

