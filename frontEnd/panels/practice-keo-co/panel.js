
export function mount(container) {
    if (!container) return;

    // --- 1. Load External CSS ---
    if (!document.querySelector('link[href="./panels/practice-keo-co/style.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './panels/practice-keo-co/style.css';
        document.head.appendChild(link);
    }

    // Load Font
    if (!document.querySelector('link[href="https://fonts.googleapis.com/css2?family=VT323&display=swap"]')) {
        const fontLink = document.createElement('link');
        fontLink.href = "https://fonts.googleapis.com/css2?family=VT323&display=swap";
        fontLink.rel = "stylesheet";
        document.head.appendChild(fontLink);
    }

    // --- 2. HTML Structure ---
    // Copied from keo_co_chatgpt/index.html (adapted)
    container.innerHTML = `
    <div class="keo-co-wrapper">
        <div class="top-bar">
            <div class="pixel-box">NẤC: <span id="kc-stage">0</span>/5</div>
            <div class="pixel-box timer-box"><span id="kc-timer">10.00</span>s</div>
            <button id="kc-btn-pause" class="pixel-btn sm-btn">TẠM DỪNG</button>
            <button id="kc-btn-quit" class="pixel-btn sm-btn" style="margin-left:auto;border-color:#d32f2f">THOÁT</button>
        </div>

        <div class="game-view">
            <div class="sky-bg">
                <div class="cloud c1"></div>
                <div class="cloud c2"></div>
                <div class="cloud c3"></div>
            </div>

            <div class="battle-ground">
                <div class="line win-line left-limit"></div>
                <div class="line center-line"></div>
                <div class="line win-line right-limit"></div>

                <div id="kc-tug-group" class="tug-group">
                    
                    <div class="char-container monster">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="6" y="7" width="12" height="11" fill="#8BC34A"/>
                            <rect x="5" y="9" width="1" height="7" fill="#8BC34A"/>
                            <rect x="18" y="9" width="1" height="7" fill="#8BC34A"/>
                            <rect x="7" y="18" width="3" height="3" fill="#8BC34A"/>
                            <rect x="14" y="18" width="3" height="3" fill="#8BC34A"/>
                            <path d="M6 5 h2 v3 h-2 z" fill="#F44336"/>
                            <path d="M16 5 h2 v3 h-2 z" fill="#F44336"/>
                            <path d="M7 3 h1 v2 h-1 z" fill="#fff"/>
                            <path d="M16 3 h1 v2 h-1 z" fill="#fff"/>
                            <rect x="9" y="9" width="6" height="6" fill="white"/>
                            <rect x="10" y="10" width="4" height="4" fill="#3F51B5"/>
                            <rect x="11" y="11" width="2" height="2" fill="black"/>
                            <rect x="9" y="16" width="6" height="1" fill="#1b5e20"/>
                            <rect x="6" y="7" width="12" height="11" stroke="black" stroke-width="0.5"/>
                        </svg>
                    </div> 
                    
                    <div class="rope-container">
                        <div class="rope"></div>
                        <div class="knot"></div>
                    </div>
                    
                    <div class="char-container hero">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 10 h6 v10 h-4 l-2 -2 z" fill="#D32F2F"/>
                            <rect x="8" y="4" width="8" height="7" fill="#FFCC80"/>
                            <path d="M8 4 h8 v3 h-1 v-1 h-6 v1 h-1 z" fill="#1a1a1a"/>
                            <rect x="10" y="5" width="2" height="2" fill="#1a1a1a"/>
                            <rect x="10" y="7" width="1" height="1" fill="black"/>
                            <rect x="14" y="7" width="1" height="1" fill="black"/>
                            <rect x="8" y="11" width="8" height="8" fill="#1976D2"/>
                            <rect x="11" y="12" width="2" height="2" fill="yellow"/>
                            <rect x="11.5" y="12.5" width="1" height="1" fill="red"/>
                            <rect x="8" y="17" width="8" height="2" fill="#D32F2F"/>
                            <rect x="8" y="16" width="8" height="1" fill="#FFEB3B"/>
                            <rect x="8" y="19" width="3" height="3" fill="#1976D2"/>
                            <rect x="13" y="19" width="3" height="3" fill="#1976D2"/>
                            <rect x="8" y="22" width="3" height="2" fill="#D32F2F"/>
                            <rect x="13" y="22" width="3" height="2" fill="#D32F2F"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="ground-layer">
                <div class="grass"></div>
                <div class="dirt"></div>
            </div>
        </div>

        <div class="interaction-zone">
            
            <div id="kc-quiz-panel" class="panel active">
                <div class="question-header">SẴN SÀNG?</div>
                <div class="game-console-screen">
                    <div id="kc-question" class="console-text">LOADING...</div>
                </div>
                <div id="kc-answers" class="keypad-grid"></div>
            </div>

            <div id="kc-arrow-panel" class="panel hidden">
                <h2 class="blink-text">BẤM MŨI TÊN THEO THỨ TỰ!</h2>
                <div id="kc-arrow-container" class="arrow-display-row"></div>
                <div class="hint-text">(Sử dụng phím mũi tên trên bàn phím)</div>
            </div>
        </div>

        <div id="kc-overlay" class="overlay">
            <div class="pixel-modal">
                <h1 id="kc-modal-title" class="title-text">MATH TUG</h1>
                <div id="kc-countdown" class="countdown"></div>
                <button id="kc-btn-start" class="pixel-btn big-btn">BẮT ĐẦU</button>
            </div>
        </div>

        <div id="kc-pause-overlay" class="overlay hidden">
            <div class="pixel-modal">
                <h1>ĐÃ TẠM DỪNG</h1>
                <button id="kc-btn-resume" class="pixel-btn big-btn">TIẾP TỤC</button>
            </div>
        </div>
    </div>
    `;

    // --- 3. LOGIC ---
    // Copy logic from script.js, namespaced to avoid global pollution

    const WIN_OFFSET = 5;
    const STEP_PIXELS = 45;
    const ARROW_COUNT = 5;

    // --- QUESTION BANK ---
    let ORIGINAL_QUESTIONS = [];

    // --- Touch Vars ---
    let touchStartX = 0;
    let touchStartY = 0;

    const KEY_MAP = { "ArrowUp": "⬆️", "ArrowDown": "⬇️", "ArrowLeft": "⬅️", "ArrowRight": "➡️" };
    const ARROW_KEYS = Object.keys(KEY_MAP);

    let currentPosition = 0;
    let gameActive = false;
    let isPaused = false;
    let isFirstQuestion = true;
    let timerInterval = null;
    let timeLeft = 0;
    let gameQuestions = [];
    let currentArrowSequence = [];
    let arrowIndex = 0;

    // DOM Elements
    const uiTugGroup = container.querySelector('#kc-tug-group');
    const uiStage = container.querySelector('#kc-stage');
    const uiTimer = container.querySelector('#kc-timer');
    const uiQuizPanel = container.querySelector('#kc-quiz-panel');
    const uiArrowPanel = container.querySelector('#kc-arrow-panel');
    const uiArrowContainer = container.querySelector('#kc-arrow-container');
    const uiQuestion = container.querySelector('#kc-question');
    const uiAnswers = container.querySelector('#kc-answers');

    const overlay = container.querySelector('#kc-overlay');
    const pauseOverlay = container.querySelector('#kc-pause-overlay');
    const countdownEl = container.querySelector('#kc-countdown');
    const modalTitle = container.querySelector('#kc-modal-title');
    const btnStart = container.querySelector('#kc-btn-start');
    const btnPause = container.querySelector('#kc-btn-pause');
    const btnResume = container.querySelector('#kc-btn-resume');
    const btnQuit = container.querySelector('#kc-btn-quit');

    async function initGame() {
        currentPosition = 0;
        isPaused = false;
        isFirstQuestion = true;

        await loadQuestions();
        if (ORIGINAL_QUESTIONS.length === 0) {
            alert("Lỗi tải câu hỏi từ Server!");
            return;
        }

        gameQuestions = [...ORIGINAL_QUESTIONS];
        resetVisuals();
        startCountdown();
    }

    async function loadQuestions() {
        try {
            const url = window.API_CONFIG?.ENDPOINTS?.GAMES?.QUESTIONS?.replace(':gameType', 'practice-keo-co')
                || '/api/games/questions/practice-keo-co';
            const res = await fetch(url);
            const data = await res.json();
            if (data.success && data.data.length > 0) {
                ORIGINAL_QUESTIONS = data.data;
            } else {
                throw new Error("No data");
            }
        } catch (e) {
            console.error("Load Questions Error", e);
        }
    }

    function resetVisuals() {
        uiTugGroup.style.transform = `translateX(-50%)`;
        uiStage.innerText = "0";
    }

    function startCountdown() {
        btnStart.style.display = 'none';
        modalTitle.innerText = "CHUẨN BỊ";
        let count = 3;
        countdownEl.innerText = count;

        let cdTimer = setInterval(() => {
            count--;
            if (count > 0) {
                countdownEl.innerText = count;
            } else {
                clearInterval(cdTimer);
                overlay.classList.add('hidden');
                startRound();
            }
        }, 1000);
    }

    function startRound() {
        if (Math.abs(currentPosition) >= WIN_OFFSET) {
            endGame();
            return;
        }

        gameActive = true;
        timeLeft = 10;

        uiQuizPanel.classList.remove('hidden');
        uiArrowPanel.classList.add('hidden');
        uiTimer.innerText = timeLeft.toFixed(2);
        uiTimer.style.color = "#00ff00";

        generateUniqueQuestion();

        // Delay voice 1.5s
        // Delay voice: 1.5s for first question, 0s for others
        let delay = isFirstQuestion ? 1500 : 0;
        isFirstQuestion = false;

        setTimeout(() => {
            if (gameActive && !isPaused) {
                let txt = uiQuestion.innerText;
                // Make text more natural for kids
                txt = txt.replace(/(\d+)\s*\+\s*(\d+)\s*=\s*\?/g, "$1 cộng $2 bằng bao nhiêu?");
                txt = txt.replace(/(\d+)\s*\-\s*(\d+)\s*=\s*\?/g, "$1 trừ $2 bằng bao nhiêu?");
                // Fix: Read comparison nicely ("5 ... 5" -> "Số 5 so với số 5 như thế nào?")
                txt = txt.replace(/(\d+)\s*\.\.\.\s*(\d+)/g, "Số $1 so với số $2 như thế nào?");

                // Only replace "Number ... ?" patterns that are asking for a number
                // "Số liền sau..." -> keep "là số nào"
                if (txt.match(/^Số (liền|bé|lớn)/i)) {
                    txt = txt.replace(/^Số (.*) số (\d+)\?$/i, "Số $1 số $2 là số nào?");
                }

                // "1, 2, 3, ..." -> "1, 2, 3... Số tiếp theo là số nào?"
                txt = txt.replace(/(\d+),\s*(\d+),\s*(\d+),\s*\.\.\./g, "$1, $2, $3... Số tiếp theo là số nào?");

                speakText(txt);
            }
        }, delay);

        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (isPaused || !gameActive) return;

            timeLeft -= 0.05;
            uiTimer.innerText = Math.max(0, timeLeft).toFixed(2);

            if (timeLeft < 3) uiTimer.style.color = "#f44336";

            if (timeLeft <= 0) {
                handleRoundEnd(false);
            }
        }, 50);
    }

    function speakText(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'vi-VN';
            utterance.rate = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    }

    function generateUniqueQuestion() {
        if (gameQuestions.length === 0) gameQuestions = [...ORIGINAL_QUESTIONS];
        const idx = Math.floor(Math.random() * gameQuestions.length);
        const q = gameQuestions[idx];
        gameQuestions.splice(idx, 1);

        uiQuestion.innerText = q.q;
        uiQuestion.innerText = q.q;
        // speakText moved to startRound (delayed)
        uiAnswers.innerHTML = '';

        q.a.forEach((ans, idx) => {
            const btn = document.createElement('button');
            btn.className = 'ans-btn';
            btn.innerText = ans;
            btn.onclick = () => handleAnswer(idx === q.c, btn, q.c);
            uiAnswers.appendChild(btn);
        });
    }

    function handleAnswer(isCorrect, btn, correctIndex) {
        if (!gameActive || isPaused) return;

        if (isCorrect) {
            btn.classList.add('correct');
            setTimeout(() => switchToArrowPhase(), 200);
        } else {
            btn.classList.add('wrong');
            const allBtns = uiAnswers.children;
            if (allBtns[correctIndex]) allBtns[correctIndex].classList.add('correct-hint');
            setTimeout(() => handleRoundEnd(false), 1500);
        }
    }

    function switchToArrowPhase() {
        // Detect touch device roughly (iPad/Mobile)
        const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

        if (isTouch) {
            // On iPad/Tablets: Skip arrow/swipe phase entirely as requested
            uiQuizPanel.classList.add('hidden');
            handleRoundEnd(true); // Auto-win the pulling phase
            return;
        }

        uiQuizPanel.classList.add('hidden');
        uiArrowPanel.classList.remove('hidden');

        generateArrowSequence();
        arrowIndex = 0;

        // Remove old listener before adding new to avoid duplicates
        document.removeEventListener('keydown', handleArrowKey);
        document.addEventListener('keydown', handleArrowKey);

        container.querySelector('.hint-text').innerText = "(Sử dụng phím mũi tên trên bàn phím)";
    }

    function generateArrowSequence() {
        currentArrowSequence = [];
        uiArrowContainer.innerHTML = '';
        uiArrowContainer.className = 'arrow-display-row';

        for (let i = 0; i < ARROW_COUNT; i++) {
            const randomKey = ARROW_KEYS[Math.floor(Math.random() * ARROW_KEYS.length)];
            currentArrowSequence.push(randomKey);

            const div = document.createElement('div');
            div.className = 'arrow-box';
            div.innerText = KEY_MAP[randomKey];
            div.id = `arrow-${i}`;
            uiArrowContainer.appendChild(div);
        }
    }

    function handleArrowKey(e) {
        if (!gameActive || isPaused) return;

        if (!ARROW_KEYS.includes(e.code)) return;
        e.preventDefault();

        const expectedKey = currentArrowSequence[arrowIndex];

        if (e.code === expectedKey) {
            // Correct
            const arrowBox = uiArrowContainer.children[arrowIndex];
            arrowBox.classList.add('active');
            arrowIndex++;

            let shake = (arrowIndex % 2 === 0) ? 5 : -5;
            let pixelOffset = currentPosition * STEP_PIXELS;
            uiTugGroup.style.transform = `translateX(calc(-50% + ${pixelOffset}px + ${shake}px))`;

            if (arrowIndex >= ARROW_COUNT) {
                document.removeEventListener('keydown', handleArrowKey);
                handleRoundEnd(true);
            }
        } else {
            // Wrong
            document.removeEventListener('keydown', handleArrowKey);
            uiArrowContainer.classList.add('shake-red');
            setTimeout(() => {
                uiArrowContainer.classList.remove('shake-red');
                handleRoundEnd(false);
            }, 500);
        }
    }

    function handleRoundEnd(playerWon) {
        gameActive = false;
        clearInterval(timerInterval);
        document.removeEventListener('keydown', handleArrowKey);

        if (playerWon) {
            currentPosition++;
        } else {
            currentPosition--;
        }

        updateVisuals();

        setTimeout(() => {
            startRound();
        }, 1500);
    }

    function updateVisuals() {
        let pixelOffset = currentPosition * STEP_PIXELS;
        uiTugGroup.style.transform = `translateX(calc(-50% + ${pixelOffset}px))`;
        uiStage.innerText = Math.abs(currentPosition);
    }

    function endGame() {
        overlay.classList.remove('hidden');
        let isVictory = currentPosition >= WIN_OFFSET;

        modalTitle.innerText = isVictory ? "CHIẾN THẮNG!" : "THUA CUỘC";
        modalTitle.style.color = isVictory ? "#4CAF50" : "#F44336";

        btnStart.style.display = 'inline-block';
        btnStart.innerText = "CHƠI LẠI";

        if (isVictory) submitScore();
    }

    async function submitScore() {
        try {
            const headers = window.getAuthHeaders ? window.getAuthHeaders() : {};
            if (!headers['Authorization']) return;
            const submitUrl = window.API_CONFIG?.ENDPOINTS?.GAMES?.SUBMIT || 'http://localhost:3000/api/games/submit';
            await fetch(submitUrl, {
                method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({ game_type: 'practice-keo-co', score: 100, stars: 3, is_passed: true, time_spent: 30 })
            });
        } catch (e) { }
    }

    // --- Events ---
    btnStart.onclick = initGame;
    btnPause.onclick = () => { if (gameActive && !isPaused) { isPaused = true; pauseOverlay.classList.remove('hidden'); } };
    btnResume.onclick = () => { if (gameActive && isPaused) { isPaused = false; pauseOverlay.classList.add('hidden'); } };
    btnQuit.onclick = () => {
        // Just reload page or hide panel
        location.reload();
    };

    function handleTouchStart(e) {
        if (!e.changedTouches || e.changedTouches.length === 0) return;
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }

    function handleTouchEnd(e) {
        if (!e.changedTouches || e.changedTouches.length === 0) return;
        let touchEndX = e.changedTouches[0].screenX;
        let touchEndY = e.changedTouches[0].screenY;
        handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
    }

    function handleSwipe(sx, sy, ex, ey) {
        if (!gameActive || isPaused) return;

        let dx = ex - sx;
        let dy = ey - sy;
        let code = null;

        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal
            if (Math.abs(dx) > 30) { // Threshold
                code = dx > 0 ? 'ArrowRight' : 'ArrowLeft';
            }
        } else {
            // Vertical
            if (Math.abs(dy) > 30) {
                code = dy > 0 ? 'ArrowDown' : 'ArrowUp';
            }
        }

        if (code) {
            handleArrowKey({ code: code, preventDefault: () => { } });
        }
    }

    // Store cleanup ref
    container.cleanup = () => {
        document.removeEventListener('keydown', handleArrowKey); // Ensure cleanup

        clearInterval(timerInterval);
        document.removeEventListener('keydown', handleArrowKey);
    };
}

export function unmount(container) {
    if (container && container.cleanup) {
        container.cleanup();
    }
}
