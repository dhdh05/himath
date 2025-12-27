export function mount(container) {
  if (!container) return;

  // --- CẤU HÌNH GAME ---
  const GAME_CONFIG = {
    totalQuestions: 10,
    gameType: 'chan-le',
    levelId: 50, // ID trong db.sql cho bài Nhập môn Chẵn Lẻ
    passScore: 50
  };

  // load css once
  if (!document.querySelector('link[data-panel="chan-le"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './panels/chan-le/style.css';
    link.setAttribute('data-panel', 'chan-le');
    document.head.appendChild(link);
  }

  container.innerHTML = `
    <div class="chanle-game">
      <div class="game-container" id="gameScreen">
        <div class="game-header">
            <h1><i class="fas fa-sort-numeric-up"></i> Phân Biệt Số Chẵn Lẻ</h1>
            <p class="subtitle">Kéo số vào ô tương ứng</p>
        </div>

        <div class="game-stats">
            <div class="stat">
                <div class="stat-icon"><i class="fas fa-list-ol"></i></div>
                <div class="stat-content">
                    <div class="stat-label">Câu hỏi</div>
                    <div class="stat-value"><span id="cl-qNum">1</span>/${GAME_CONFIG.totalQuestions}</div>
                </div>
            </div>
            <div class="stat">
                <div class="stat-icon"><i class="fas fa-clock"></i></div>
                <div class="stat-content">
                    <div class="stat-label">Thời gian</div>
                    <div class="stat-value" id="cl-timer">15</div>
                </div>
            </div>
            <div class="stat">
                <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
                <div class="stat-content">
                    <div class="stat-label">Đúng</div>
                    <div class="stat-value" id="cl-correct">0</div>
                </div>
            </div>
            <div class="stat">
                <div class="stat-icon"><i class="fas fa-times-circle"></i></div>
                <div class="stat-content">
                    <div class="stat-label">Sai</div>
                    <div class="stat-value" id="cl-wrong">0</div>
                </div>
            </div>
        </div>

        <div class="game-area">
            <div class="target-box even-box" id="cl-evenBox">
                <div class="target-label"><h2>CHẴN</h2></div>
                <div class="target-instruction">Kéo thả vào đây</div>
                <div class="result-message" id="cl-evenResult"></div>
            </div>

            <div class="number-display">
                <div class="current-number" id="cl-currentNumber">0</div>
                <div class="number-label">Kéo số vào ô</div>
            </div>

            <div class="target-box odd-box" id="cl-oddBox">
                <div class="target-label"><h2>LẺ</h2></div>
                <div class="target-instruction">Kéo thả vào đây</div>
                <div class="result-message" id="cl-oddResult"></div>
            </div>
        </div>

        <div class="game-controls">
            <button id="cl-nextBtn" class="next-btn" style="display:none">
                <i class="fas fa-forward"></i> Tiếp theo
            </button>
        </div>
      </div>

      <div class="result-screen" id="endScreen" style="display: none; text-align: center; padding: 20px;">
        <h2 id="endTitle">Kết quả</h2>
        <div class="stars-display" id="endStars" style="font-size: 40px; margin: 20px 0; color: #FFC107;">
          <i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>
        </div>
        <p id="endScore" style="font-size: 24px; font-weight: bold;">0 Điểm</p>
        <p id="endTime" style="color: #666;">Thời gian: 0s</p>
        <div class="controls" style="justify-content: center; margin-top: 30px;">
          <button id="cl-restartBtn" class="control-btn restart-btn" style="padding: 10px 20px; font-size: 18px; cursor: pointer;">
              <i class="fas fa-redo"></i> Chơi lại
          </button>
        </div>
      </div>
    </div>
  `;

  // instrumentation
  try { if (window.HiMathStats) window.HiMathStats.startPage('digits-chan-le'); } catch (e) {}

  // state
  let questionCount = 1;
  let correctAnswers = 0;
  let wrongAnswers = 0;
  let timeLeft = 15;
  let timerInterval = null;
  let isGameActive = true;
  let currentNumber = 0;
  let currentAnswer = '';
  let isAnswered = false;
  let startTime = Date.now();
  let autoNextTimeout = null;

  // dom
  const gameScreen = container.querySelector('#gameScreen');
  const endScreen = container.querySelector('#endScreen');
  const qNumElement = container.querySelector('#cl-qNum');
  const timerElement = container.querySelector('#cl-timer');
  const correctElement = container.querySelector('#cl-correct');
  const wrongElement = container.querySelector('#cl-wrong');
  const currentNumberElement = container.querySelector('#cl-currentNumber');
  const evenResultElement = container.querySelector('#cl-evenResult');
  const oddResultElement = container.querySelector('#cl-oddResult');
  const evenBox = container.querySelector('#cl-evenBox');
  const oddBox = container.querySelector('#cl-oddBox');
  const nextBtn = container.querySelector('#cl-nextBtn');
  const restartBtn = container.querySelector('#cl-restartBtn');

  // helper functions
  function getUserId() { return window.HiMathUserId || 1; }

  let currentAudio = null;
  function playSoundFile(filename) {
    return new Promise(resolve => {
      try {
        if (currentAudio) { try { currentAudio.pause(); currentAudio.currentTime = 0; } catch (e) {} currentAudio = null; }
        const audio = new Audio(`assets/sound/${filename}`);
        currentAudio = audio;
        const finish = () => { if (currentAudio === audio) currentAudio = null; resolve(); };
        audio.addEventListener('ended', finish);
        audio.addEventListener('error', finish);
        const p = audio.play(); if (p && typeof p.then === 'function') p.catch(() => finish());
      } catch (e) { currentAudio = null; resolve(); }
    });
  }

  function initGame() {
    questionCount = 1;
    correctAnswers = 0;
    wrongAnswers = 0;
    startTime = Date.now();
    isGameActive = true;
    
    gameScreen.style.display = 'block';
    endScreen.style.display = 'none';
    
    updateStats();
    generateNewQuestion();
  }

  function updateStats() {
    qNumElement.textContent = questionCount;
    correctElement.textContent = correctAnswers;
    wrongElement.textContent = wrongAnswers;
    timerElement.textContent = timeLeft;
  }

  function generateNewQuestion() {
    if (autoNextTimeout) { clearTimeout(autoNextTimeout); autoNextTimeout = null; }
    
    isAnswered = false;
    currentNumber = Math.floor(Math.random() * 21); // Số từ 0-20
    currentAnswer = currentNumber % 2 === 0 ? 'even' : 'odd';
    
    currentNumberElement.textContent = currentNumber;
    currentNumberElement.draggable = true;
    currentNumberElement.className = 'current-number'; // Reset class
    
    evenBox.classList.remove('drag-over');
    oddBox.classList.remove('drag-over');
    evenResultElement.textContent = '';
    oddResultElement.textContent = '';
    evenResultElement.className = 'result-message';
    oddResultElement.className = 'result-message';
    
    nextBtn.style.display = 'none';
    
    startTimer();
  }

  function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 15;
    timerElement.textContent = timeLeft;
    timerElement.classList.remove('timer-warning');

    timerInterval = setInterval(() => {
      if (!isGameActive) { clearInterval(timerInterval); return; }
      timeLeft--;
      timerElement.textContent = timeLeft;
      if (timeLeft <= 5) timerElement.classList.add('timer-warning');
      if (timeLeft <= 0) handleTimeout();
    }, 1000);
  }

  function handleTimeout() {
    if (isAnswered) return;
    processResult(false, null); // Time out counts as wrong
  }

  // Xử lý Logic Kéo thả
  function handleDragStart(e) {
    if (!isGameActive || isAnswered) { e.preventDefault(); return; }
    try { e.dataTransfer.setData('text/plain', currentNumber); } catch (err) {}
    currentNumberElement.classList.add('dragging');
  }

  function handleDragOver(e) {
    if (!isGameActive || isAnswered) { e.preventDefault(); return; }
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (e.target.closest('.even-box')) { evenBox.classList.add('drag-over'); oddBox.classList.remove('drag-over'); }
    else if (e.target.closest('.odd-box')) { oddBox.classList.add('drag-over'); evenBox.classList.remove('drag-over'); }
  }

  function handleDragLeave(e) {
    if (!e.target.closest('.even-box') && !e.target.closest('.odd-box')) { 
      evenBox.classList.remove('drag-over'); 
      oddBox.classList.remove('drag-over'); 
    }
  }

  function handleDrop(e) {
    if (!isGameActive || isAnswered) { e.preventDefault(); return; }
    e.preventDefault();
    let droppedBox = null; let userAnswer = '';
    
    if (e.target.closest('.even-box')) { droppedBox = evenBox; userAnswer = 'even'; }
    else if (e.target.closest('.odd-box')) { droppedBox = oddBox; userAnswer = 'odd'; }
    
    if (!droppedBox) return;
    evenBox.classList.remove('drag-over'); oddBox.classList.remove('drag-over');
    
    const isCorrect = userAnswer === currentAnswer;
    processResult(isCorrect, droppedBox);
  }

  function processResult(isCorrect, targetBox) {
    isAnswered = true;
    clearInterval(timerInterval);
    currentNumberElement.draggable = false;
    currentNumberElement.classList.remove('dragging');

    if (isCorrect) {
        correctAnswers++;
        currentNumberElement.classList.add('correct-number');
        playSoundFile('sound_correct_answer_long.mp3');
        
        if (targetBox === evenBox) {
            evenResultElement.textContent = 'Đúng rồi!'; evenResultElement.classList.add('correct');
        } else if (targetBox === oddBox) {
            oddResultElement.textContent = 'Đúng rồi!'; oddResultElement.classList.add('correct');
        }
    } else {
        wrongAnswers++;
        currentNumberElement.classList.add('wrong-number');
        playSoundFile('sound_wrong_answer_long.mp3');
        
        // Hiện thông báo sai ở box thả vào (hoặc nếu timeout thì ko box nào)
        if (targetBox === evenBox) {
            evenResultElement.textContent = 'Sai rồi!'; evenResultElement.classList.add('wrong');
        } else if (targetBox === oddBox) {
            oddResultElement.textContent = 'Sai rồi!'; oddResultElement.classList.add('wrong');
        } else {
            // Timeout
            currentNumberElement.textContent = 'Hết giờ!';
        }
    }
    
    updateStats();
    
    // Tự động chuyển câu hoặc kết thúc
    if (questionCount < GAME_CONFIG.totalQuestions) {
        questionCount++;
        autoNextTimeout = setTimeout(generateNewQuestion, 1500);
    } else {
        autoNextTimeout = setTimeout(finishGame, 1500);
    }
  }

  // --- KẾT THÚC & GỬI KẾT QUẢ ---
  async function finishGame() {
    isGameActive = false;
    const totalTime = Math.round((Date.now() - startTime) / 1000);
    const score = Math.round((correctAnswers / GAME_CONFIG.totalQuestions) * 100);
    
    // Tính sao
    let stars = 0;
    if (score === 100) stars = 3;
    else if (score >= 80) stars = 2;
    else if (score >= 50) stars = 1;
    
    const isPassed = score >= GAME_CONFIG.passScore;

    // UI Kết quả
    gameScreen.style.display = 'none';
    endScreen.style.display = 'block';
    
    container.querySelector('#endTitle').textContent = isPassed ? "Tuyệt Vời! 🎉" : "Cố Lên Nhé! 💪";
    container.querySelector('#endScore').textContent = `${score}/100 Điểm`;
    container.querySelector('#endTime').textContent = `Thời gian: ${totalTime}s`;
    
    const starContainer = container.querySelector('#endStars');
    starContainer.innerHTML = '';
    for(let i=1; i<=3; i++) {
        if(i <= stars) starContainer.innerHTML += '<i class="fas fa-star"></i>';
        else starContainer.innerHTML += '<i class="far fa-star"></i>';
    }

    // Gửi API
    const payload = {
        student_id: getUserId(),
        level_id: GAME_CONFIG.levelId,
        game_type: GAME_CONFIG.gameType,
        score: score,
        stars: stars,
        is_passed: isPassed,
        time_spent: totalTime
    };

    try {
        console.log("📤 Submitting Chan-Le:", payload);
        const res = await fetch('http://localhost:3000/api/games/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        console.log("📥 Server response:", data);
    } catch(err) {
        console.error("Lỗi gửi kết quả:", err);
    }
  }

  // --- TOUCH EVENTS (Mobile) ---
  function initTouchEvents() {
    let touchStartX = 0; let touchStartY = 0;
    
    function touchStartHandler(e) {
      if (!isGameActive || isAnswered) return;
      const touch = e.touches[0]; touchStartX = touch.clientX; touchStartY = touch.clientY;
      currentNumberElement.classList.add('dragging'); e.preventDefault();
    }
    
    function touchEndHandler(e) {
      if (!isGameActive || isAnswered || !currentNumberElement.classList.contains('dragging')) return;
      const touch = e.changedTouches[0]; 
      const deltaX = touch.clientX - touchStartX; 
      
      if (Math.abs(deltaX) > 50) {
        let userAnswer = ''; let targetBox = null;
        // Kéo sang trái (< -50) là Chẵn (Even Box ở bên trái trong CSS layout thường thấy, hoặc check HTML structure)
        // Trong HTML: evenBox (trái), oddBox (phải)
        if (deltaX < -50) { userAnswer = 'even'; targetBox = evenBox; }
        else if (deltaX > 50) { userAnswer = 'odd'; targetBox = oddBox; }
        
        if (targetBox) {
            const isCorrect = userAnswer === currentAnswer;
            processResult(isCorrect, targetBox);
        }
      }
      currentNumberElement.classList.remove('dragging'); 
      evenBox.classList.remove('drag-over'); 
      oddBox.classList.remove('drag-over'); 
      e.preventDefault();
    }

    currentNumberElement.addEventListener('touchstart', touchStartHandler, { passive: false });
    currentNumberElement.addEventListener('touchend', touchEndHandler, { passive: false });
    
    container._clTouch = { touchStartHandler, touchEndHandler };
  }

  // Events Wiring
  currentNumberElement.addEventListener('dragstart', handleDragStart);
  evenBox.addEventListener('dragover', handleDragOver);
  evenBox.addEventListener('dragleave', handleDragLeave);
  evenBox.addEventListener('drop', handleDrop);
  oddBox.addEventListener('dragover', handleDragOver);
  oddBox.addEventListener('dragleave', handleDragLeave);
  oddBox.addEventListener('drop', handleDrop);

  restartBtn.addEventListener('click', initGame);

  initTouchEvents();
  initGame(); // Start immediately

  // Cleanup
  container._chanLeCleanup = () => {
    clearInterval(timerInterval);
    if (autoNextTimeout) clearTimeout(autoNextTimeout);
    
    currentNumberElement.removeEventListener('dragstart', handleDragStart);
    evenBox.removeEventListener('dragover', handleDragOver);
    evenBox.removeEventListener('drop', handleDrop);
    oddBox.removeEventListener('dragover', handleDragOver);
    oddBox.removeEventListener('drop', handleDrop);
    restartBtn.removeEventListener('click', initGame);

    if (container._clTouch) {
      currentNumberElement.removeEventListener('touchstart', container._clTouch.touchStartHandler);
      currentNumberElement.removeEventListener('touchend', container._clTouch.touchEndHandler);
    }

    try { if (currentAudio) { currentAudio.pause(); currentAudio = null; } } catch(e) {}
    try { if (window.HiMathStats) window.HiMathStats.endPage('digits-chan-le'); } catch (e) {}
    
    delete container._chanLeCleanup;
  };
}

export function unmount(container) { if (!container) return; if (container._chanLeCleanup) container._chanLeCleanup(); }