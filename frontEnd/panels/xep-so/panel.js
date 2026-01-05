export function mount(container) {
  if (!container) return;

  // --- CAU HINH ---
  const GAME_CONFIG = {
    totalQuestions: 10,
    levelId: 79, // ID trong db.sql cho bai Xep so (1-20)
    passScore: 50
  };

  // ensure css is loaded
  if (!document.querySelector('link[data-panel="xep-so"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './panels/xep-so/style.css';
    link.setAttribute('data-panel', 'xep-so');
    document.head.appendChild(link);
  }

  container.innerHTML = `
    <div class="xepso-container">
      <div class="game-container" id="gameScreen">
        <div class="game-header">
            <h1><i class="fas fa-sort-numeric-up"></i> Sắp Xếp Số</h1>
        </div>

        <div class="game-stats">
            <div class="stat">
                <div class="stat-label">Câu</div>
                <div class="stat-value"><span id="xepso-questionNumber">1</span>/${GAME_CONFIG.totalQuestions}</div>
            </div>
            <div class="stat">
                <div class="stat-label">Đúng</div>
                <div class="stat-value correct" id="xepso-correctCount">0</div>
            </div>
            <div class="stat">
                <div class="stat-label">Sai</div>
                <div class="stat-value wrong" id="xepso-wrongCount">0</div>
            </div>
        </div>

        <div class="sequence-section">
            <h3>Kéo số vào vị trí đúng:</h3>
            <div class="number-sequence" id="xepso-numberSequence"></div>
        </div>

        <div class="answers-section">
            <h3>Chọn số để kéo:</h3>
            <div class="draggable-numbers" id="xepso-draggableNumbers"></div>
        </div>

        <div class="controls">
            <button id="xepso-nextBtn" class="control-btn next-btn" style="display:none">
                <i class="fas fa-forward"></i> Tiếp theo
            </button>
            <button id="xepso-restartBtn" class="control-btn restart-btn">
                <i class="fas fa-redo"></i> Làm lại
            </button>
        </div>
      </div>

      <div class="result-screen" id="endScreen" style="display: none; text-align: center; padding: 40px; color: #333;">
            <h2 id="endTitle" style="font-size: 32px; margin-bottom: 20px;">Kết quả</h2>
            <div id="endStars" style="font-size: 50px; color: #FFC107; margin-bottom: 20px;"></div>
            <p id="endScore" style="font-size: 24px; font-weight:bold;">0 Điểm</p>
            <p id="endTime" style="color: #666;">Thời gian: 0s</p>
            <div style="margin-top: 30px;">
                <button id="end-restartBtn" class="control-btn restart-btn" style="padding: 12px 24px;">
                    <i class="fas fa-redo"></i> Chơi lại
                </button>
            </div>
      </div>
    </div>
  `;

  // instrumentation: panel mounted
  try { if (window.HiMathStats) window.HiMathStats.startPage('compare-xep-so'); } catch (e) { }

  // ---------- Game state (scoped) ----------
  let questionNumber = 1;
  let correctCount = 0; // So cau hoan thanh
  let wrongCount = 0;   // So lan keo sai
  let currentSequence = [];
  let hiddenPositions = [];
  let hiddenNumbers = [];
  let draggableNumbers = [];
  let draggedNumber = null;
  let correctSlotsCount = 0; // So slot da dien dung trong cau hien tai
  let autoNextTimeout = null;
  let startTime = null;

  // dom (scoped)
  const gameScreen = container.querySelector('#gameScreen');
  const endScreen = container.querySelector('#endScreen');
  const questionNumberElement = container.querySelector('#xepso-questionNumber');
  const correctCountElement = container.querySelector('#xepso-correctCount');
  const wrongCountElement = container.querySelector('#xepso-wrongCount');
  const numberSequence = container.querySelector('#xepso-numberSequence');
  const draggableNumbersContainer = container.querySelector('#xepso-draggableNumbers');
  const nextBtn = container.querySelector('#xepso-nextBtn');
  const restartBtn = container.querySelector('#xepso-restartBtn');
  const endRestartBtn = container.querySelector('#end-restartBtn');

  // Helper: Get UserID tu current user
  function getUserId() {
    try {
      const currentUser = JSON.parse(localStorage.getItem('hm_user') || 'null');
      if (currentUser && (currentUser.id || currentUser.user_id)) {
        return currentUser.id || currentUser.user_id;
      }
    } catch (e) { }
    return window.HiMathUserId || null;
  }

  // audio helper
  let currentAudio = null;
  function playSoundFile(filename) {
    return new Promise(resolve => {
      try {
        if (currentAudio) { try { currentAudio.pause(); currentAudio.currentTime = 0; } catch (e) { } currentAudio = null; }
        const audio = new Audio(`assets/sound/${filename}`);
        currentAudio = audio;
        const finish = () => { if (currentAudio === audio) currentAudio = null; resolve(); };
        audio.addEventListener('ended', finish);
        audio.addEventListener('error', finish);
        const p = audio.play(); if (p && typeof p.then === 'function') p.catch(() => finish());
      } catch (e) { currentAudio = null; resolve(); }
    });
  }

  function speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'vi-VN';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }, 100);
    }
  }

  function initGame() {
    questionNumber = 1;
    correctCount = 0;
    wrongCount = 0;
    correctSlotsCount = 0;
    startTime = Date.now();

    gameScreen.style.display = 'block';
    endScreen.style.display = 'none';

    if (autoNextTimeout) { clearTimeout(autoNextTimeout); autoNextTimeout = null; }

    // Voice Instruction - Chi doc 1 lan khi bat dau choi
    speakText("Bé hãy sắp xếp sao cho các số đứng theo thứ tự từ nhỏ tới lớn");

    updateStats();
    generateNewQuestion();
    nextBtn.style.display = 'none';
  }

  function generateNewQuestion() {
    currentSequence = []; hiddenPositions = []; hiddenNumbers = []; draggableNumbers = []; draggedNumber = null; correctSlotsCount = 0;
    if (autoNextTimeout) { clearTimeout(autoNextTimeout); autoNextTimeout = null; }
    questionNumberElement.textContent = questionNumber;

    // create 6 unique numbers 1-20, sorted ascending
    const numbers = new Set();
    while (numbers.size < 6) numbers.add(getRandomNumber(1, 20));
    currentSequence = Array.from(numbers).sort((a, b) => a - b);

    // choose 2-4 random hidden positions
    const numberOfHidden = getRandomNumber(2, 4);
    const positions = [0, 1, 2, 3, 4, 5];
    for (let i = 0; i < numberOfHidden; i++) {
      const idx = Math.floor(Math.random() * positions.length);
      hiddenPositions.push(positions[idx]);
      positions.splice(idx, 1);
    }
    hiddenPositions.sort((a, b) => a - b);
    hiddenNumbers = hiddenPositions.map(p => currentSequence[p]);
    draggableNumbers = [...hiddenNumbers];

    displaySequence();
    displayDraggableNumbers();
  }

  function displaySequence() {
    numberSequence.innerHTML = '';
    currentSequence.forEach((number, index) => {
      const slot = document.createElement('div');
      slot.className = 'number-slot';
      slot.dataset.position = index;
      slot.dataset.correctValue = number;

      if (hiddenPositions.includes(index)) {
        slot.classList.add('empty');
        slot.dataset.filled = 'false';
        slot.dataset.currentValue = '';
        slot.addEventListener('dragover', handleDragOver);
        slot.addEventListener('dragenter', handleDragEnter);
        slot.addEventListener('dragleave', handleDragLeave);
        slot.addEventListener('drop', handleDrop);
      } else {
        slot.classList.add('filled');
        slot.textContent = number;
        slot.dataset.filled = 'true';
        slot.dataset.currentValue = number;
        correctSlotsCount++; // Count pre-filled as correct for logic simplification
      }

      numberSequence.appendChild(slot);
    });
  }

  function displayDraggableNumbers() {
    draggableNumbersContainer.innerHTML = '';
    const shuffledNumbers = [...draggableNumbers].sort(() => Math.random() - 0.5);
    shuffledNumbers.forEach((number, index) => {
      const el = document.createElement('div');
      el.className = 'draggable-number';
      el.textContent = number;
      el.dataset.number = number;
      el.dataset.id = `xep-drag-${index}`;
      el.draggable = true;
      el.addEventListener('dragstart', handleDragStart);
      el.addEventListener('dragend', handleDragEnd);
      draggableNumbersContainer.appendChild(el);
    });
  }

  // drag handlers (scoped)
  function handleDragStart(e) {
    draggedNumber = { element: e.target, number: parseInt(e.target.dataset.number), id: e.target.dataset.id };
    e.target.classList.add('dragging');
    try { e.dataTransfer.setData('text/plain', e.target.dataset.number); e.dataTransfer.effectAllowed = 'move'; } catch (e) { }
  }

  function handleDragOver(e) { if (!draggedNumber) return; e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }
  function handleDragEnter(e) { if (!draggedNumber) return; const slot = e.target.closest('.number-slot.empty'); if (!slot) return; slot.classList.add('drag-over'); }
  function handleDragLeave(e) { const slot = e.target.closest('.number-slot.empty'); if (!slot) return; slot.classList.remove('drag-over'); }

  function handleDrop(e) {
    e.preventDefault();
    if (!draggedNumber) return;
    const slot = e.target.closest('.number-slot.empty'); if (!slot) return;
    slot.classList.remove('drag-over');
    const correctValue = parseInt(slot.dataset.correctValue);
    const isCorrect = draggedNumber.number === correctValue;

    if (isCorrect) {
      slot.textContent = draggedNumber.number;
      slot.classList.remove('empty'); slot.classList.add('correct'); slot.dataset.filled = 'true'; slot.dataset.currentValue = draggedNumber.number;
      draggedNumber.element.classList.add('used'); draggedNumber.element.draggable = false;
      const numberIndex = draggableNumbers.indexOf(draggedNumber.number);
      if (numberIndex > -1) draggableNumbers.splice(numberIndex, 1);

      // Check completion relative to Total Slots (6)
      const totalSlots = 6;
      // We need to count how many slots are filled/correct. 
      // The slot.classList.remove('empty') makes it filled.
      // Let's count filled slots:
      const filledCount = container.querySelectorAll('.number-slot[data-filled="true"]').length;

      playSoundFile('sound_correct_answer_bit.mp3').then(() => {
        if (filledCount === totalSlots) checkIfCompleted();
      });

    } else {
      slot.classList.add('incorrect-drop');
      setTimeout(() => { slot.classList.remove('incorrect-drop'); draggedNumber.element.classList.remove('dragging'); draggedNumber.element.style.transform = ''; }, 500);
      wrongCount++; updateStats();
      playSoundFile('sound_wrong_answer_bit.mp3');
    }
    draggedNumber = null;
  }

  function handleDragEnd() { if (draggedNumber && draggedNumber.element) draggedNumber.element.classList.remove('dragging'); document.querySelectorAll('.number-slot.drag-over').forEach(s => s.classList.remove('drag-over')); draggedNumber = null; }

  function checkIfCompleted() {
    correctCount++;
    updateStats();
    document.querySelectorAll('.number-slot').forEach(slot => slot.classList.add('all-correct'));

    playSoundFile('sound_correct_answer_long.mp3').then(() => {
      if (questionNumber < GAME_CONFIG.totalQuestions) {
        nextQuestion();
      } else {
        finishGame();
      }
    });
  }

  async function finishGame() {
    const totalTime = Math.round((Date.now() - startTime) / 1000);
    // Score logic: 100 points for finishing. Penalty for wrongs? 
    // Let's keep it simple: Completion = 100 points. Stars based on Speed/Wrongs.
    // Logic: Max score 100. Minus 2 points per wrong move (min 0).
    let score = Math.max(0, 100 - (wrongCount * 2));

    // Stars based on score
    let stars = 0;
    if (score === 100) stars = 3;
    else if (score >= 80) stars = 2;
    else if (score >= 50) stars = 1;

    const isPassed = score >= GAME_CONFIG.passScore;

    // UI Result
    gameScreen.style.display = 'none';
    endScreen.style.display = 'block';

    container.querySelector('#endTitle').textContent = isPassed ? "Tuyệt Vời! 🎉" : "Cố Gắng Lần Sau! 💪";
    container.querySelector('#endScore').textContent = `${score}/100 Điểm`;
    container.querySelector('#endTime').textContent = `Thời gian: ${totalTime}s`;

    let starHtml = '';
    for (let i = 1; i <= 3; i++) starHtml += (i <= stars) ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    container.querySelector('#endStars').innerHTML = starHtml;

    // API Call
    try {
      const headers = window.getAuthHeaders ? window.getAuthHeaders() : { 'Content-Type': 'application/json' };
      const apiUrl = window.API_CONFIG?.ENDPOINTS?.GAMES?.SUBMIT || 'http://localhost:3000/api/games/submit';
      await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          student_id: getUserId(),
          level_id: GAME_CONFIG.levelId,
          game_type: 'xep-so',
          score: score,
          stars: stars,
          is_passed: isPassed,
          time_spent: totalTime
        })
      });
      console.log("Da luu ket qua Xep So");
    } catch (err) { console.error(err); }
  }

  function updateStats() { correctCountElement.textContent = correctCount; wrongCountElement.textContent = wrongCount; }

  function nextQuestion() {
    if (autoNextTimeout) { clearTimeout(autoNextTimeout); autoNextTimeout = null; }
    questionNumber++;
    generateNewQuestion();
  }

  function getRandomNumber(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

  // document-level dragover to allow drops (scoped cleanup later)
  function docDragOver(e) { e.preventDefault(); }
  document.addEventListener('dragover', docDragOver);

  // events
  nextBtn.addEventListener('click', nextQuestion);
  restartBtn.addEventListener('click', initGame);
  endRestartBtn.addEventListener('click', initGame);

  // init
  initGame();

  // cleanup
  container._xepSoCleanup = () => {
    nextBtn.removeEventListener('click', nextQuestion);
    restartBtn.removeEventListener('click', initGame);
    document.removeEventListener('dragover', docDragOver);
    if (autoNextTimeout) { clearTimeout(autoNextTimeout); autoNextTimeout = null; }
    try { if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; currentAudio = null; } } catch (e) { }
    try { if (window.HiMathStats) window.HiMathStats.endPage('compare-xep-so'); } catch (e) { }

    delete container._xepSoCleanup;
  };
}


export function unmount(container) { if (!container) return; if (container._xepSoCleanup) container._xepSoCleanup(); }

