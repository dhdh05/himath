
export function mount(container) {
    if (!container) return;

    // Load External CSS
    if (!document.querySelector('link[href="./panels/practice-viet-so/style.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './panels/practice-viet-so/style.css';
        document.head.appendChild(link);
    }
    // Load Confetti
    if (!window.confetti) {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
        document.head.appendChild(s);
    }
    // Load Tesseract for Level 2
    if (!window.Tesseract) {
        const s2 = document.createElement('script');
        s2.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
        document.head.appendChild(s2);
    }

    // MAIN CONTAINER State
    container.innerHTML = `
        <div class="viet-so-container">
            <!-- MENU SELECTION -->
            <div id="levelSelection" class="selection-screen">
                <h1 style="color:#d84315; margin-bottom: 30px; text-transform: uppercase;">Bé Tập Viết Số</h1>
                <div style="display: flex; gap: 20px; justify-content: center;">
                    <div class="level-card" id="btnLevel1">
                        <div class="level-icon">✏️</div>
                        <h3>Mức độ 1</h3>
                        <p>Tập tô số theo nét mẫu</p>
                    </div>
                    <div class="level-card" id="btnLevel2">
                        <div class="level-icon">🧮</div>
                        <h3>Mức độ 2</h3>
                        <p>Giải toán và viết kết quả</p>
                    </div>
                </div>
            </div>

            <!-- LEVEL 1: TRACING (Existing) -->
            <div id="level1Container" class="drawing-container hidden-level">
                <div class="level-header">
                     <button class="back-btn" id="l1BackBtn"><i class="fas fa-arrow-left"></i></button>
                     <h2>Bé hãy tô theo số mẫu</h2>
                </div>
                
                <div class="canvas-wrapper">
                    <canvas id="bgCanvas" width="300" height="300"></canvas>
                    <canvas id="drawCanvas" width="300" height="300"></canvas>
                </div>

                <div class="controls">
                    <div class="number-selector">
                        <button class="btn-nav-num" id="prevNumBtn"><i class="fas fa-chevron-left"></i></button>
                        <span id="currentNumDisplay">0</span>
                        <button class="btn-nav-num" id="nextNumBtn"><i class="fas fa-chevron-right"></i></button>
                    </div>
                    
                    <div class="btn-row">
                        <button class="btn-action btn-clear" id="clearBtn"><i class="fas fa-eraser"></i> Xóa</button>
                        <button class="btn-action btn-check" id="checkBtn"><i class="fas fa-check"></i> Kiểm tra</button>
                    </div>
                </div>

                <div id="message" class="message"></div>
            </div>

            <!-- LEVEL 2: MATH + TESSERACT (Re-implemented) -->
            <div id="level2Container" class="drawing-container hidden-level">
                <div class="level-header">
                     <button class="back-btn" id="l2BackBtn"><i class="fas fa-arrow-left"></i></button>
                     <h2>Giải toán và viết kết quả</h2>
                </div>

                <div class="math-question" id="mathQuestionDisplay">
                    1 + 1 = ?
                </div>

                <div class="canvas-wrapper" style="border-color: #2196F3;">
                    <!-- Single canvas for writing -->
                    <canvas id="writeCanvas" width="300" height="300" style="background:#fff;"></canvas>
                </div>

                <div class="controls">
                    <div class="btn-row">
                        <button class="btn-action btn-clear" id="l2ClearBtn"><i class="fas fa-eraser"></i> Xóa</button>
                        <button class="btn-action btn-check" id="l2CheckBtn" style="background-color:#2196F3"><i class="fas fa-check"></i> Chấm điểm</button>
                    </div>
                </div>

                <div id="l2Message" class="message"></div>
                <div id="l2Loading" style="display:none; color:#666; font-size:14px; margin-top:5px;">
                    <i class="fas fa-spinner fa-spin"></i> AI đang ngắm chữ của bé...
                </div>
            </div>
        </div>
    `;

    // TTS Helper
    function speak(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop previous
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'vi-VN';
            window.speechSynthesis.speak(utterance);
        }
    }

    // --- SHARED VARS ---
    const selectionScreen = container.querySelector('#levelSelection');
    const level1Container = container.querySelector('#level1Container');
    const level2Container = container.querySelector('#level2Container');

    // BACK HANDLERS
    container.querySelector('#l1BackBtn').onclick = () => showScreen('menu');
    container.querySelector('#l2BackBtn').onclick = () => showScreen('menu');

    container.querySelector('#btnLevel1').onclick = () => {
        showScreen('level1');
        initLevel1();
    };
    container.querySelector('#btnLevel2').onclick = () => {
        showScreen('level2');
        initLevel2();
    };

    function showScreen(name) {
        selectionScreen.style.display = 'none';
        level1Container.style.display = 'none';
        level2Container.style.display = 'none';

        if (name === 'menu') selectionScreen.style.display = 'flex'; // It's flex in CSS actually but we handle it
        if (name === 'level1') level1Container.style.display = 'block';
        if (name === 'level2') level2Container.style.display = 'block';
    }


    // ==========================================
    // LEVEL 1 LOGIC (TRACING)
    // ==========================================
    let l1_inited = false;
    let l1_currentNumber = 0;

    function initLevel1() {
        if (l1_inited) return;
        l1_inited = true;

        const CONFIG = {
            font: "bold 220px Arial, sans-serif",
            guideColor: "#e0e0e0",
            drawColor: "#333333",
            lineWidth: 25,
            minAccuracy: 0.65,
            minCoverage: 0.80
        };

        const bgCanvas = container.querySelector('#bgCanvas');
        const bgCtx = bgCanvas.getContext('2d', { willReadFrequently: true });
        const drawCanvas = container.querySelector('#drawCanvas');
        const ctx = drawCanvas.getContext('2d', { willReadFrequently: true });

        // UI
        const prevBtn = container.querySelector('#prevNumBtn');
        const nextBtn = container.querySelector('#nextNumBtn');
        const numDisp = container.querySelector('#currentNumDisplay');
        const clearBtn = container.querySelector('#clearBtn');
        const checkBtn = container.querySelector('#checkBtn');
        const msgEl = container.querySelector('#message');

        let isDrawing = false;

        function drawTemplate(num) {
            bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
            bgCtx.font = CONFIG.font;
            bgCtx.fillStyle = CONFIG.guideColor;
            bgCtx.textAlign = "center";
            bgCtx.textBaseline = "middle";
            bgCtx.fillText(num, bgCanvas.width / 2, bgCanvas.height / 2 + 20);

            clearL1();
            numDisp.innerText = num;

            // Voice
            speak(`Bé hãy tập viết số ${num} nhé`);
        }

        function clearL1() {
            ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
            msgEl.innerText = "";
        }

        function changeL1Num(d) {
            l1_currentNumber += d;
            if (l1_currentNumber > 9) l1_currentNumber = 0;
            if (l1_currentNumber < 0) l1_currentNumber = 9;
            drawTemplate(l1_currentNumber);
        }

        // Draw handlers
        function getPos(e) {
            const rect = drawCanvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: (clientX - rect.left) * (drawCanvas.width / rect.width),
                y: (clientY - rect.top) * (drawCanvas.height / rect.height)
            };
        }
        function start(e) {
            isDrawing = true;
            ctx.beginPath();
            ctx.lineWidth = CONFIG.lineWidth;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.strokeStyle = CONFIG.drawColor;
            const p = getPos(e);
            ctx.moveTo(p.x, p.y);
        }
        function move(e) {
            if (!isDrawing) return;
            const p = getPos(e);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
        }
        function stop() { isDrawing = false; ctx.closePath(); }

        drawCanvas.addEventListener('mousedown', start);
        drawCanvas.addEventListener('mousemove', move);
        drawCanvas.addEventListener('mouseup', stop);
        drawCanvas.addEventListener('mouseout', stop);
        drawCanvas.addEventListener('touchstart', (e) => { e.preventDefault(); start(e); }, { passive: false });
        drawCanvas.addEventListener('touchmove', (e) => { e.preventDefault(); move(e); }, { passive: false });
        drawCanvas.addEventListener('touchend', stop);

        prevBtn.onclick = () => changeL1Num(-1);
        nextBtn.onclick = () => changeL1Num(1);
        clearBtn.onclick = clearL1;

        checkBtn.onclick = () => {
            const width = bgCanvas.width;
            const height = bgCanvas.height;
            const bgData = bgCtx.getImageData(0, 0, width, height).data;
            const drawData = ctx.getImageData(0, 0, width, height).data;

            let guide = 0, user = 0, overlap = 0;
            for (let i = 0; i < bgData.length; i += 4) {
                const isG = bgData[i + 3] > 20;
                const isD = drawData[i + 3] > 20;
                if (isG) guide++;
                if (isD) {
                    user++;
                    if (isG) overlap++;
                }
            }

            if (user === 0) { msgEl.innerText = "Bé chưa vẽ gì cả!"; msgEl.style.color = "gray"; return; }
            const acc = user > 0 ? overlap / user : 0;
            const cov = guide > 0 ? overlap / guide : 0;

            if (acc < CONFIG.minAccuracy) {
                msgEl.innerText = "Hơi lem rồi! Bé vẽ gọn lại nhé."; msgEl.style.color = "#e74c3c";
                playAudioL1(false);
            } else if (cov < CONFIG.minCoverage) {
                msgEl.innerText = `Chưa kín số (mới ${(cov * 100).toFixed(0)}%).`; msgEl.style.color = "#e67e22";
            } else {
                msgEl.innerText = "Tuyệt vời! Chính xác."; msgEl.style.color = "#27ae60";
                playAudioL1(true);
                if (window.confetti) window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            }
        };

        // Init view
        drawTemplate(l1_currentNumber);
    }

    function playAudioL1(isCorrect) {
        const snd = new Audio(isCorrect ? './assets/sound/sound_correct_answer_bit.mp3' : './assets/sound/sound_wrong_answer_bit.mp3');
        snd.play().catch(e => { });
    }


    // ==========================================
    // LEVEL 2 LOGIC (MATH + TESSERACT)
    // ==========================================
    let l2_inited = false;
    let l2_currentAnswer = 0;

    function initLevel2() {
        if (l2_inited) {
            newMathQuestion(); // Refresh question on re-enter
            return;
        }
        l2_inited = true;

        const writeCanvas = container.querySelector('#writeCanvas');
        const ctx2 = writeCanvas.getContext('2d', { willReadFrequently: true });

        // Settings
        const LINE_WIDTH = 25; // Bolder for better OCR
        const STROKE_COLOR = 'black';

        // Draw Logic L2
        let drawing2 = false;
        function getPos2(e) {
            const rect = writeCanvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: (clientX - rect.left) * (writeCanvas.width / rect.width),
                y: (clientY - rect.top) * (writeCanvas.height / rect.height)
            };
        }
        function start2(e) {
            drawing2 = true;
            ctx2.beginPath();
            ctx2.lineWidth = LINE_WIDTH;
            ctx2.lineCap = "round";
            ctx2.lineJoin = "round";
            ctx2.strokeStyle = STROKE_COLOR;
            const p = getPos2(e);
            ctx2.moveTo(p.x, p.y);
        }
        function move2(e) {
            if (!drawing2) return;
            const p = getPos2(e);
            ctx2.lineTo(p.x, p.y);
            ctx2.stroke();
        }
        function stop2() { drawing2 = false; ctx2.closePath(); }

        writeCanvas.addEventListener('mousedown', start2);
        writeCanvas.addEventListener('mousemove', move2);
        writeCanvas.addEventListener('mouseup', stop2);
        writeCanvas.addEventListener('mouseout', stop2);
        writeCanvas.addEventListener('touchstart', (e) => { e.preventDefault(); start2(e); }, { passive: false });
        writeCanvas.addEventListener('touchmove', (e) => { e.preventDefault(); move2(e); }, { passive: false });
        writeCanvas.addEventListener('touchend', stop2);

        // Buttons
        container.querySelector('#l2ClearBtn').onclick = () => {
            ctx2.clearRect(0, 0, writeCanvas.width, writeCanvas.height);
            // set white bg again because tesseract likes white bg better than transparent usually, 
            // but transparent png is also handled. Let's keep transparent for simplicity or fill white if issues.
            // Actually Tesseract works better with black text on white background.
            ctx2.fillStyle = "white";
            ctx2.fillRect(0, 0, writeCanvas.width, writeCanvas.height);

            container.querySelector('#l2Message').innerText = "";
        };

        // Initialize white bg first time
        ctx2.fillStyle = "white";
        ctx2.fillRect(0, 0, writeCanvas.width, writeCanvas.height);

        container.querySelector('#l2CheckBtn').onclick = async () => {
            if (!window.Tesseract) {
                alert("Đang tải AI, bé đợi 1 lát nhé...");
                return;
            }

            const loading = container.querySelector('#l2Loading');
            const msg = container.querySelector('#l2Message');

            loading.style.display = 'block';
            msg.innerText = "";

            try {
                // Pre-process: Maybe not needed for simple digits
                const result = await Tesseract.recognize(
                    writeCanvas,
                    'eng', // English model works fine for digits 0-9
                    {
                        logger: m => console.log(m),
                        tessedit_char_whitelist: '0123456789',
                        tessedit_pageseg_mode: '6' // Assume single uniform block of text
                    }
                );

                loading.style.display = 'none';

                const text = result.data.text.trim();
                console.log("AI Read:", text);

                if (!text) {
                    msg.innerText = "Bé chưa viết số nào cả!";
                    msg.style.color = "orange";
                    return;
                }

                // Compare
                // Use regex to find number in text
                const match = text.match(/\d+/);
                const numberRecognized = match ? parseInt(match[0]) : null;

                if (numberRecognized === l2_currentAnswer) {
                    msg.innerText = `Chính xác! Bé viết số ${numberRecognized} rất đúng.`;
                    msg.style.color = "green";
                    if (window.confetti) window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                    playAudioL1(true);
                    setTimeout(newMathQuestion, 2000); // Next question logic
                } else {
                    msg.innerText = `Sai rồi. AI đọc là số ${numberRecognized || '?'}. Kết quả là ${l2_currentAnswer} cơ.`;
                    msg.style.color = "red";
                    playAudioL1(false);
                }

            } catch (e) {
                loading.style.display = 'none';
                msg.innerText = "Lỗi AI: " + e.message;
                msg.style.color = "red";
            }
        };

        newMathQuestion();
    }

    function newMathQuestion() {
        const qEl = container.querySelector('#mathQuestionDisplay');
        // Simple Add/Sub
        const a = Math.floor(Math.random() * 5); // 0-4
        const b = Math.floor(Math.random() * 5); // 0-4
        l2_currentAnswer = a + b;
        qEl.innerText = `${a} + ${b} = ?`;

        // Clear canvas
        container.querySelector('#l2ClearBtn').click();

        // Voice
        speak(`${a} cộng ${b} bằng bao nhiêu?`);
    }

    // Default start
    // showScreen('menu'); // Already set by HTML structure logic but CSS handles visual
    // Just ensure
    showScreen('menu');
}

export function unmount() {
}
