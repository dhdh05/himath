
// Import Tesseract.js tu CDN
let tesseractWorker = null;

// Tu dien so -> chu tieng Anh
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
    if (!window.Tesseract) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
        script.onload = () => { console.log("🧠 Tesseract Loaded"); };
        document.head.appendChild(script);
    }

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
    const canvasContainer = document.getElementById('canvasContainer');

    // Canvas Config
    ctx.lineWidth = 12; // Do day toi uu cho Tesseract (theo claude algorithm)
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
        // type se la 'add', 'sub', hoac 'mix'

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

        // Neu la 'mix', random ra 'add' hoac 'sub'
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

            // Helper to get voices reliably
            const getVoices = () => {
                let vs = window.speechSynthesis.getVoices();
                return vs.length > 0 ? vs : [];
            };

            const selectBestVoice = () => {
                const voices = getVoices();
                // console.log("Available voices:", voices.map(v => `${v.name} (${v.lang})`)); // Debug

                let selectedVoice = null;
                if (currentLang === 'vi') {
                    // Uu tien giong nu tieng Viet: Google Tieng Viet, Hoai My (Windows), Linh, ...
                    selectedVoice = voices.find(v => v.lang.includes('vi') && v.name.includes('Google')) || // Chrome Female
                        voices.find(v => v.lang.includes('vi') && (v.name.includes('Hoai My') || v.name.includes('Linh'))) || // Windows/Other Female
                        voices.find(v => v.lang.includes('vi') && v.name.toLowerCase().includes('female')) ||
                        voices.find(v => v.lang.includes('vi')); // Fallback
                } else {
                    selectedVoice = voices.find(v => v.lang.includes('en') && v.name.includes('Google') && v.name.includes('Female')) ||
                        voices.find(v => v.lang.includes('en') && v.name.includes('Google')) ||
                        voices.find(v => v.lang.includes('en'));
                }

                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                }
                window.speechSynthesis.speak(utterance);
            };

            // Ensure voices are loaded
            if (window.speechSynthesis.getVoices().length === 0) {
                window.speechSynthesis.onvoiceschanged = selectBestVoice;
            } else {
                selectBestVoice();
            }
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
        canvasContainer.classList.remove('correct-glow', 'wrong-glow');
        debugScore.innerText = "";
    }

    // --- AI ---
    // --- AI (Tesseract) ---
    // Khong can loadModel phuc tap nhu TFJS, Tesseract se auto load worker khi goi recognize
    // Tuy nhien, co the pre-load worker neu muon, nhung o day ta de simple.

    function preprocessImage(originalCanvas) {
        const originalCtx = originalCanvas.getContext('2d');
        const width = originalCanvas.width;
        const height = originalCanvas.height;

        const imgData = originalCtx.getImageData(0, 0, width, height);
        const data = imgData.data;

        // 1. Tim Bounding Box voi nguong thap hon
        let minX = width, minY = height, maxX = 0, maxY = 0;
        let found = false;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                if (data[index] > 30) { // Nguong thap hon de bat duoc nhieu diem anh hon
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                    found = true;
                }
            }
        }

        if (!found) return null;

        // 2. Tao canvas vuong chuan hoa 28x28 (chuan MNIST)
        const cropWidth = maxX - minX + 1;
        const cropHeight = maxY - minY + 1;

        // Padding 20%
        const maxDim = Math.max(cropWidth, cropHeight);
        const padding = Math.floor(maxDim * 0.2);
        const finalSize = 28;

        // Canvas tam de crop
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = maxDim + padding * 2;
        tempCanvas.height = maxDim + padding * 2;

        // Nen den
        tempCtx.fillStyle = 'black';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Ve so vao giua
        const offsetX = (tempCanvas.width - cropWidth) / 2;
        const offsetY = (tempCanvas.height - cropHeight) / 2;
        tempCtx.drawImage(
            originalCanvas,
            minX, minY, cropWidth, cropHeight,
            offsetX, offsetY, cropWidth, cropHeight
        );

        // 3. Scale ve 28x28
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = finalSize;
        finalCanvas.height = finalSize;
        const finalCtx = finalCanvas.getContext('2d');

        // Nen trang (chuan Tesseract)
        finalCtx.fillStyle = 'white';
        finalCtx.fillRect(0, 0, finalSize, finalSize);

        // Ve so (smoothing tat de giu net)
        finalCtx.imageSmoothingEnabled = false;
        finalCtx.drawImage(tempCanvas, 0, 0, finalSize, finalSize);

        // 4. Dao mau va tang do tuong phan
        const finalData = finalCtx.getImageData(0, 0, finalSize, finalSize);
        const d = finalData.data;

        for (let i = 0; i < d.length; i += 4) {
            // Dao mau: nen den -> trang, chu trang -> den
            const brightness = (d[i] + d[i + 1] + d[i + 2]) / 3;

            if (brightness > 80) {
                // Chu (trang) -> Den dam
                d[i] = 0; d[i + 1] = 0; d[i + 2] = 0;
            } else {
                // Nen (den) -> Trang tinh
                d[i] = 255; d[i + 1] = 255; d[i + 2] = 255;
            }
        }

        finalCtx.putImageData(finalData, 0, 0);

        // 5. Scale len 56x56 de Tesseract doc de hon
        const outputCanvas = document.createElement('canvas');
        outputCanvas.width = 56;
        outputCanvas.height = 56;
        const outputCtx = outputCanvas.getContext('2d');

        outputCtx.fillStyle = 'white';
        outputCtx.fillRect(0, 0, 56, 56);
        outputCtx.imageSmoothingEnabled = false;
        outputCtx.drawImage(finalCanvas, 0, 0, 56, 56);

        return outputCanvas.toDataURL('image/png');
    }

    async function predictNumber() {
        if (!window.Tesseract) { alert("Tesseract Loading..."); return; }

        debugScore.innerText = "⏳ Detecting...";

        const processedImage = preprocessImage(canvas);
        if (!processedImage) {
            resultArea.innerText = currentLang === 'en' ? "Please write a number!" : "Bé chưa viết số!";
            debugScore.innerText = "";
            return;
        }

        try {
            const { data: { text, confidence } } = await Tesseract.recognize(
                processedImage,
                'eng',
                {
                    tessedit_char_whitelist: '0123456789',
                    tessedit_pageseg_mode: Tesseract.PSM.SINGLE_CHAR,
                    preserve_interword_spaces: '0'
                }
            );

            let top1 = parseInt(text.trim());
            const conf = parseFloat(confidence);

            // Handle NaN or empty
            if (isNaN(top1)) top1 = -1; // Unknown

            console.log(`Predict: ${top1}, Target: ${correctAnswer}, Conf: ${conf}%`);

            // Use only top1 for now as Tesseract single char mode returns one best guess
            // Mock scores for visual neighbor compatibility
            // We set the score for top1 to confidence/100, others to 0
            const scores = [];
            scores[top1] = conf / 100;
            const top3Classes = [top1]; // Tesseract doesn't easily give top 3 in basic mode

            // ---------------------------------------------------------------------
            // LOGIC CHECK: VISUAL NEIGHBOR MAP (Ban do hang xom)
            // ---------------------------------------------------------------------

            // Dinh nghia cac so co net tuong dong nhau (RELAXED MODE)
            const VISUAL_NEIGHBORS = {
                0: [6, 9, 8, 5],        // Tron, cong kin
                1: [7, 4, 2],           // Net thang
                2: [1, 7, 3, 0],        // Z shape, cong
                3: [5, 8, 9, 2],        // Cong 2 khuc, gan giong 5 hoac 8
                4: [9, 1, 7],           // Thang + Cheo
                5: [3, 6, 9, 0],        // Cong duoi, bung tron
                6: [0, 5, 8],           // Bung tron
                7: [1, 2, 4, 9],        // Gach ngang/cheo
                8: [3, 0, 6, 5, 9],     // Hai vong tron (Chap nhan ca 9)
                9: [4, 7, 3, 5, 0]      // Dau tron duoi dai
            };

            let isRight = false;
            let visualMatch = false;

            // Rule 1: Chuan det
            if (top1 === correctAnswer) isRight = true;

            // Rule 2: Hoi hoi dung (Confidence > 30%) - Giam tu 40 xuong 30
            if (top1 === correctAnswer && conf > 30) isRight = true;

            // Rule 3: Visual Neighbor Check (Chap nhan ho hang)
            const neighbors = VISUAL_NEIGHBORS[correctAnswer] || [];
            if (neighbors.includes(top1)) {
                console.log(`🛡️ Auto-correct: Target ${correctAnswer} ~= Predicted ${top1} (Accepted by Visual Neighbor)`);
                isRight = true;
                visualMatch = true;
            }

            const sndCorrect = new Audio('./assets/sound/sound_correct_answer_bit.mp3');
            const sndWrong = new Audio('./assets/sound/sound_wrong_answer_bit.mp3');

            if (isRight) {
                // Hien thi message ro hon khi auto-correct
                let congrats = currentLang === 'en' ? "EXCELLENT!" : "CHÍNH XÁC!";
                if (visualMatch) {
                    congrats = currentLang === 'en' ? "Close Enough!" : "Gần đúng (Chấp nhận)!";
                }
                resultArea.innerHTML = `🎉 <b>${congrats}</b> ${numA} ${currentOp} ${numB} = ${correctAnswer}`;
                resultArea.style.color = "#00b894";
                resultArea.classList.add('pop-anim');

                // Add Glow Effect
                canvasContainer.classList.remove('wrong-glow');
                canvasContainer.classList.add('correct-glow');

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
                // Neu sai han (AI nhin ra so qua lech pha)
                let txt = currentLang === 'en' ? `AI sees number <b>${top1}</b>.` : `AI chưa nhìn rõ. Bé viết số <b>${correctAnswer}</b> to hơn nhé!`;
                resultArea.innerHTML = `🤔 ${txt}`;
                resultArea.style.color = "#d63031";

                canvasContainer.classList.remove('correct-glow');
                canvasContainer.classList.add('wrong-glow');

                sndWrong.play().catch(() => { });
            }
            debugScore.innerText = `Prediction: ${top1} (${Math.round(conf)}%) ${visualMatch ? '[Auto-Corrected]' : ''}`;
        } catch (error) {
            console.error(error);
            resultArea.innerText = "❌ Lỗi xử lý AI. Bé thử lại nhé!";
        }
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
