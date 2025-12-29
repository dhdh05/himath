
// Import TensorFlow.js từ CDN
let mnistModel = null;

// Từ điển số -> chữ tiếng Anh
const NUM_WORDS_EN = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];

export function mount(container) {
    if (!container) return;

    // --- 1. Load External CSS ---
    if (!document.querySelector('link[href="./panels/practice-viet-so/style.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './panels/practice-viet-so/style.css';
        document.head.appendChild(link);
    }

    // --- 2. Inject Libs ---
    if (!window.tf) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js';
        script.onload = () => { console.log("🧠 TensorFlow Loaded"); loadModel(); };
        document.head.appendChild(script);
    } else { if (!mnistModel) loadModel(); }

    if (!window.confetti) {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
        document.head.appendChild(s);
    }

    // --- 3. HTML Structure ---
    container.innerHTML = `
        <div class="viet-so-panel">
            <div class="viet-so-header">
                <h1>🧮 Bé Làm Toán & Tập Viết</h1>
                <p id="pageSubtitle">Chọn chế độ để bắt đầu nhé!</p>
            </div>

            <!-- MODE SELECTION MENU -->
            <div class="mode-selection" id="modeSelection">
                <!-- Card 1: Cộng Việt -->
                <div class="mode-card" data-mode="vi_add_10">
                    <div class="mode-icon icon-add-vi"><i class="fas fa-plus"></i></div>
                    <div class="mode-info">
                        <h3>Phép Cộng</h3>
                        <p>Tiếng Việt • Phạm vi 10</p>
                    </div>
                </div>

                <!-- Card 2: Trừ Việt -->
                <div class="mode-card" data-mode="vi_sub_10">
                    <div class="mode-icon icon-sub-vi"><i class="fas fa-minus"></i></div>
                    <div class="mode-info">
                        <h3>Phép Trừ</h3>
                        <p>Tiếng Việt • Phạm vi 10</p>
                    </div>
                </div>

                <!-- Card 3: Cộng Anh -->
                <div class="mode-card" data-mode="en_add_10">
                    <div class="mode-icon icon-add-en"><i class="fas fa-language"></i></div>
                    <div class="mode-info">
                        <h3>Addition</h3>
                        <p>English • To 10</p>
                    </div>
                </div>

                <!-- Card 4: Trừ Anh -->
                <div class="mode-card" data-mode="en_sub_10">
                    <div class="mode-icon icon-sub-en"><i class="fas fa-globe-americas"></i></div>
                    <div class="mode-info">
                        <h3>Subtraction</h3>
                        <p>English • To 10</p>
                    </div>
                </div>

                <!-- Card 5: Mix Việt -->
                <div class="mode-card" data-mode="vi_mix_10">
                    <div class="mode-icon icon-mix-vi"><i class="fas fa-random"></i></div>
                    <div class="mode-info">
                        <h3>Cả Hai</h3>
                        <p>Phép cộng và trừ ngẫu nhiên</p>
                    </div>
                </div>

                <!-- Card 6: Mix Anh -->
                <div class="mode-card" data-mode="en_mix_10">
                    <div class="mode-icon icon-mix-en"><i class="fas fa-random"></i></div>
                    <div class="mode-info">
                        <h3>Mixed</h3>
                        <p>Add & Sub Random</p>
                    </div>
                </div>
            </div>

            <!-- GAME AREA -->
            <div class="game-area" id="gameArea">
                <button id="backBtn" class="btn-back"><i class="fas fa-arrow-left"></i> Chọn lại</button>

                <div class="math-block">
                    <div class="math-question" id="mathDisplay">...</div>
                    <button id="speakBtn" title="Nghe câu hỏi" style="border:none; background:none; font-size:2em; cursor:pointer; color:#0984e3; margin-left:15px; vertical-align: middle;">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>

                <div class="canvas-container" id="canvasContainer">
                    <canvas id="drawingCanvas" width="280" height="280"></canvas>
                </div>

                <div class="controls-area">
                    <button id="clearBtn" class="btn-game btn-clear"><i class="fas fa-eraser"></i> Xóa</button>
                    <button id="checkBtn" class="btn-game btn-check"><i class="fas fa-check-circle"></i> Kiểm tra</button>
                </div>

                <div class="result-area" id="resultArea">Mời bé!</div>
                <div class="prediction-score" id="debugScore"></div>
            </div>
        </div>
    `;

    // --- 4. Logic Variables ---
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const resultArea = document.getElementById('resultArea');
    const debugScore = document.getElementById('debugScore');
    const mathDisplay = document.getElementById('mathDisplay');

    // Areas
    const modeSelection = document.getElementById('modeSelection');
    const gameArea = document.getElementById('gameArea');
    const pageSubtitle = document.getElementById('pageSubtitle');

    // Canvas Config
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'white';

    let isDrawing = false;

    // Game State
    let numA = 0; let numB = 0; let correctAnswer = 0;
    let currentLang = 'vi';
    let currentOp = '+';
    let currentModeRaw = '';

    // --- EVENT LISTENERS ---

    document.querySelectorAll('.mode-card').forEach(card => {
        card.addEventListener('click', () => {
            const mode = card.getAttribute('data-mode');
            startGame(mode);
        });
    });

    document.getElementById('backBtn').addEventListener('click', () => {
        gameArea.classList.remove('active');
        modeSelection.style.display = 'grid'; // Show menu
        pageSubtitle.innerText = "Chọn chế độ để bắt đầu nhé!";
    });

    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseleave', endPosition);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startPosition(e.touches[0]); }, { passive: false });
    canvas.addEventListener('touchend', endPosition);
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e.touches[0]); }, { passive: false });

    document.getElementById('clearBtn').addEventListener('click', clearCanvas);
    document.getElementById('checkBtn').addEventListener('click', predictNumber);
    document.getElementById('speakBtn').addEventListener('click', () => speakQuestion(true));


    // --- FUNCTIONS ---

    function startGame(mode) {
        currentModeRaw = mode;
        const parts = mode.split('_');
        currentLang = parts[0];
        // type sẽ là 'add', 'sub', hoặc 'mix'

        modeSelection.style.display = 'none';
        gameArea.classList.add('active');

        if (currentLang === 'vi') pageSubtitle.innerText = "Bé hãy tính và viết kết quả vào bảng đen nhé!";
        else pageSubtitle.innerText = "Let's calculate and write the answer!";

        generateMathProblem();
        setTimeout(() => clearCanvas(), 50);
    }

    function generateMathProblem() {
        const parts = currentModeRaw.split('_');
        let type = parts[1]; // 'add', 'sub', 'mix'

        // Nếu là 'mix', random ra 'add' hoặc 'sub'
        if (type === 'mix') {
            type = Math.random() < 0.5 ? 'add' : 'sub';
        }

        if (type === 'add') {
            currentOp = '+';
            numA = Math.floor(Math.random() * 9);
            const maxB = 9 - numA;
            numB = Math.floor(Math.random() * (maxB + 1));
            correctAnswer = numA + numB;
        } else {
            currentOp = '-';
            numA = Math.floor(Math.random() * 10);
            numB = Math.floor(Math.random() * (numA + 1));
            correctAnswer = numA - numB;
        }

        // Display
        let displayA = numA;
        let displayB = numB;
        if (currentLang === 'en') {
            displayA = NUM_WORDS_EN[numA];
            displayB = NUM_WORDS_EN[numB];
            mathDisplay.style.fontSize = "2.5em";
        } else {
            mathDisplay.style.fontSize = "4em";
        }

        mathDisplay.innerHTML = `<span style="color:#0984e3">${displayA}</span> ${currentOp} <span style="color:#e84393">${displayB}</span> = <span style="color:#d63031">?</span>`;

        setTimeout(() => speakQuestion(false), 500);
    }

    function speakQuestion(force) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();

            let text = "";
            let lang = "vi-VN";
            let rate = 0.9;

            if (currentLang === 'vi') {
                const opText = currentOp === '+' ? 'cộng' : 'trừ';
                text = `${numA} ${opText} ${numB} bằng mấy?`;
            } else {
                lang = "en-US";
                const opText = currentOp === '+' ? 'plus' : 'minus';
                text = `${numA} ${opText} ${numB} equals?`;
                rate = 0.8;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = rate;
            window.speechSynthesis.speak(utterance);
        }
    }

    // --- CANVAS HELPERS ---
    function startPosition(e) {
        isDrawing = true;
        const { x, y } = getPos(e);
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(x, y, ctx.lineWidth / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
    function endPosition() { isDrawing = false; ctx.beginPath(); }
    function draw(e) {
        if (!isDrawing) return;
        const { x, y } = getPos(e);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }
    function clearCanvas() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        resultArea.innerText = currentLang === 'en' ? "Ready!" : "Sẵn sàng!";
        resultArea.style.color = "#2d3436";
        debugScore.innerText = "";
    }

    // --- AI ---
    async function loadModel() {
        if (mnistModel) return;
        try {
            console.log("⏳ Loading Model...");
            mnistModel = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mnist_transfer_cnn_v1/model.json');
            console.log("✅ Model Loaded!");
        } catch (e) {
            console.error(e);
        }
    }

    function getBoundingBox(ctx) {
        const w = canvas.width; const h = canvas.height;
        const data = ctx.getImageData(0, 0, w, h).data;
        let minX = w, minY = h, maxX = 0, maxY = 0, found = false;
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                if (data[(y * w + x) * 4] > 0) {
                    if (x < minX) minX = x; if (x > maxX) maxX = x;
                    if (y < minY) minY = y; if (y > maxY) maxY = y;
                    found = true;
                }
            }
        }
        return found ? { minX, minY, width: maxX - minX, height: maxY - minY } : null;
    }

    async function predictNumber() {
        if (!mnistModel) { alert("AI Loading..."); return; }
        const bbox = getBoundingBox(ctx);
        if (!bbox || bbox.width === 0) {
            resultArea.innerText = currentLang === 'en' ? "Please write a number!" : "Bé chưa viết số!";
            return;
        }

        const tempC = document.createElement('canvas');
        tempC.width = 28; tempC.height = 28;
        const tCtx = tempC.getContext('2d');
        tCtx.fillStyle = 'black'; tCtx.fillRect(0, 0, 28, 28);

        const maxDim = Math.max(bbox.width, bbox.height);
        const scale = 20 / maxDim;
        const sw = bbox.width * scale; const sh = bbox.height * scale;
        tCtx.drawImage(canvas, bbox.minX, bbox.minY, bbox.width, bbox.height, (28 - sw) / 2, (28 - sh) / 2, sw, sh);

        const tensor = tf.browser.fromPixels(tCtx.getImageData(0, 0, 28, 28), 1)
            .toFloat().div(tf.scalar(255)).expandDims(0);

        const prediction = mnistModel.predict(tensor);
        const scores = prediction.dataSync();

        const indexedScores = Array.from(scores).map((s, i) => ({ score: s, index: i }));
        indexedScores.sort((a, b) => b.score - a.score);
        const top1 = indexedScores[0].index;
        const top3Classes = indexedScores.slice(0, 3).map(x => x.index);

        tensor.dispose(); prediction.dispose();
        console.log(`Predict Top1: ${top1}, Target: ${correctAnswer}. Top3: ${top3Classes.join(',')}`);

        // ---------------------------------------------------------------------
        // LOGIC CHECK: VISUAL NEIGHBOR MAP (Bản đồ hàng xóm)
        // ---------------------------------------------------------------------

        // Định nghĩa các số có nét tương đồng nhau
        const VISUAL_NEIGHBORS = {
            0: [6, 8, 9, 5, 2, 3],       // Cong kín, tròn
            1: [7, 4, 2],                // Nét thẳng
            2: [1, 3, 7, 8, 0],          // Nét ngang/cong
            3: [2, 5, 8, 9],             // Cong 2 khúc
            4: [9, 1, 7],                // Thẳng + Chéo
            5: [3, 6, 0, 8, 9],          // Cong dưới
            6: [0, 5, 8, 2],             // Bụng tròn
            7: [1, 2, 3, 4, 9, 5],       // Gạch ngang/chéo (bao gồm cả 5 vì nhiều bé viết 5 giống 7 ngược)
            8: [0, 3, 6, 9, 2, 5],       // Hai vòng tròn
            9: [4, 3, 8, 5, 0, 7]        // Đầu tròn đuôi dài
        };

        let isRight = false;
        let visualMatch = false;

        // Rule 1: Chuẩn đét (Top 3)
        if (top3Classes.includes(correctAnswer)) isRight = true;

        // Rule 2: Hơi hơi đúng (Confidence > 5%)
        if (scores[correctAnswer] > 0.05) isRight = true;

        // Rule 3: Visual Neighbor Check (Chấp nhận họ hàng)
        const neighbors = VISUAL_NEIGHBORS[correctAnswer] || [];
        if (neighbors.includes(top1)) {
            console.log(`🛡️ Auto-correct: Target ${correctAnswer} ~= Predicted ${top1} (Accepted by Visual Neighbor)`);
            isRight = true;
            visualMatch = true;
        }

        const sndCorrect = new Audio('./assets/sound/sound_correct_answer_bit.mp3');
        const sndWrong = new Audio('./assets/sound/sound_wrong_answer_bit.mp3');

        if (isRight) {
            let congrats = currentLang === 'en' ? "EXCELLENT!" : "CHÍNH XÁC!";
            resultArea.innerHTML = `🎉 <b>${congrats}</b> ${numA} ${currentOp} ${numB} = ${correctAnswer}`;
            resultArea.style.color = "#00b894";
            resultArea.classList.add('pop-anim');
            sndCorrect.play().catch(() => { });
            if (window.confetti) window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

            submitScore(correctAnswer);
            setTimeout(() => {
                resultArea.classList.remove('pop-anim');
                clearCanvas();
                generateMathProblem();
                resultArea.innerText = currentLang === 'en' ? "Next result..." : "Câu tiếp theo nào!";
                resultArea.style.color = "#2d3436";
            }, 3000);
        } else {
            // Nếu sai hẳn (AI nhìn ra số quá lệch pha)
            let txt = currentLang === 'en' ? `AI sees number <b>${top1}</b>.` : `AI chưa nhìn rõ. Bé viết số <b>${correctAnswer}</b> to hơn nhé!`;
            resultArea.innerHTML = `🤔 ${txt}`;
            resultArea.style.color = "#d63031";
            sndWrong.play().catch(() => { });
        }
        debugScore.innerText = `Prediction: ${top1} (${Math.round(scores[top1] * 100)}%) ${visualMatch ? '[Auto-Corrected]' : ''}`;
    }

    async function submitScore(num) {
        try {
            const headers = window.getAuthHeaders ? window.getAuthHeaders() : {};
            if (!headers['Authorization']) { console.warn("Not logged in"); return; }
            const submitUrl = window.API_CONFIG?.ENDPOINTS?.GAMES?.SUBMIT || 'http://localhost:3000/api/games/submit';
            const res = await fetch(submitUrl, {
                method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({ game_type: 'practice-viet-so', score: 10, stars: 1, is_passed: true, time_spent: 10 })
            });
            const data = await res.json();
        } catch (e) { }
    }
}
export function unmount() { }
