// Constants
const AUTH_KEY = 'AUTH_KEY_HI_MATH';
const STUDENT_ID = 'STUDENT_ID_HI_MATH';

// Save game result to backend
async function saveChanLeResult(score, timeSpent) {
  try {
    const token = localStorage.getItem(AUTH_KEY);
    const studentId = localStorage.getItem(STUDENT_ID);
    
    if (!token || !studentId) {
      console.warn('Not authenticated');
      return null;
    }
    
    const response = await fetch('http://localhost:5000/api/games/result', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        studentId: parseInt(studentId),
        levelId: 3,
        score: Math.round(score),
        timeSpent: Math.round(timeSpent),
        attempts: 1
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Result saved:', result);
      return result;
    } else {
      console.error('Save failed:', await response.text());
      return null;
    }
  } catch (error) {
    console.error('Save result error:', error);
    return null;
  }
}

export function mount(container) {
  if (!container) return;
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
      <div class="game-container">
        <div class="game-header">
            <h1><i class="fas fa-sort-numeric-up"></i> Phân Biệt Số Chẵn Lẻ</h1>
            <p class="subtitle">Kéo số vào ô tương ứng chẵn hoặc lẻ</p>
        </div>

        <div class="game-stats">
            <div class="stat">
                <div class="stat-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-label">Thời gian</div>
                    <div class="stat-value" id="cl-timer">15</div>
                </div>
            </div>
            <div class="stat">
                <div class="stat-icon">
                    <i class="fas fa-star"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-label">Điểm</div>
                    <div class="stat-value" id="cl-score">0</div>
                </div>
            </div>
            <div class="stat">
                <div class="stat-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-label">Đúng</div>
                    <div class="stat-value" id="cl-correct">0</div>
                </div>
            </div>
            <div class="stat">
                <div class="stat-icon">
                    <i class="fas fa-times-circle"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-label">Sai</div>
                    <div class="stat-value" id="cl-wrong">0</div>
                </div>
            </div>
        </div>

        <div class="game-area">
            <div class="target-box even-box" id="cl-evenBox">
                <div class="target-label">
                    <i class="fas fa-check-double"></i>
                    <h2>CHẴN</h2>
                </div>
                <div class="target-instruction">Kéo thả vào đây</div>
                <div class="result-message" id="cl-evenResult"></div>
            </div>

            <div class="number-display">
                <div class="current-number" id="cl-currentNumber">0</div>
                <div class="number-label">Kéo số vào ô tương ứng</div>
            </div>

            <div class="target-box odd-box" id="cl-oddBox">
                <div class="target-label">
                    <i class="fas fa-check"></i>
                    <h2>LẺ</h2>
                </div>
                <div class="target-instruction">Kéo thả vào đây</div>
                <div class="result-message" id="cl-oddResult"></div>
            </div>
        </div>

        <div class="game-controls">
            <div class="hint">
                <i class="fas fa-lightbulb"></i> Kéo số hình tròn sang trái (chẵn) hoặc phải (lẻ)
            </div>
            <button id="cl-nextBtn" class="next-btn">
                <i class="fas fa-forward"></i> Câu tiếp theo
            </button>
            <button id="cl-finishBtn" class="restart-btn" style="background: #4CAF50;">
                <i class="fas fa-check"></i> Hoàn thành
            </button>
            <button id="cl-restartBtn" class="restart-btn">
                <i class="fas fa-redo"></i> Chơi lại
            </button> 
        </div>
      </div>
    </div>
  `;

  // state
  let score = 0;
  let correctAnswers = 0;
  let wrongAnswers = 0;
  let timeLeft = 15;
  let timerInterval = null;
  let isGameActive = true;
  let currentNumber = 0;
  let currentAnswer = '';
  let isAnswered = false;

  // dom
  const timerElement = container.querySelector('#cl-timer');
  const scoreElement = container.querySelector('#cl-score');
  const correctElement = container.querySelector('#cl-correct');
  const wrongElement = container.querySelector('#cl-wrong');
  const currentNumberElement = container.querySelector('#cl-currentNumber');
  const evenResultElement = container.querySelector('#cl-evenResult');
  const oddResultElement = container.querySelector('#cl-oddResult');
  const evenBox = container.querySelector('#cl-evenBox');
  const oddBox = container.querySelector('#cl-oddBox');
  const nextBtn = container.querySelector('#cl-nextBtn');
  const restartBtn = container.querySelector('#cl-restartBtn');

  // helpers
  function updateStats() {
    scoreElement.textContent = score;
    correctElement.textContent = correctAnswers;
    wrongElement.textContent = wrongAnswers;
    timerElement.textContent = timeLeft;
  }

  function generateNewNumber() {
    currentNumber = Math.floor(Math.random() * 21);
    currentAnswer = currentNumber % 2 === 0 ? 'even' : 'odd';
    currentNumberElement.textContent = currentNumber;
    currentNumberElement.draggable = true;
    currentNumberElement.classList.remove('dragging');
    isAnswered = false;
    evenBox.classList.remove('drag-over');
    oddBox.classList.remove('drag-over');
    evenResultElement.textContent = '';
    oddResultElement.textContent = '';
    evenResultElement.className = 'result-message';
    oddResultElement.className = 'result-message';
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
    isAnswered = true;
    clearInterval(timerInterval);
    if (currentAnswer === 'even') {
      evenResultElement.textContent = 'Đáp án đúng!';
      evenResultElement.classList.add('correct');
      oddResultElement.textContent = 'Sai';
      oddResultElement.classList.add('wrong');
    } else {
      oddResultElement.textContent = 'Đáp án đúng!';
      oddResultElement.classList.add('correct');
      evenResultElement.textContent = 'Sai';
      evenResultElement.classList.add('wrong');
    }
    wrongAnswers++;
    updateStats();
    setTimeout(nextQuestion, 2000);
  }

  function nextQuestion() {
    if (!isGameActive) return;
    startTimer();
    generateNewNumber();
  }

  // drag/drop handlers
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
    if (!e.target.closest('.even-box') && !e.target.closest('.odd-box')) { evenBox.classList.remove('drag-over'); oddBox.classList.remove('drag-over'); }
  }

  function handleDrop(e) {
    if (!isGameActive || isAnswered) { e.preventDefault(); return; }
    e.preventDefault();
    let droppedBox = null; let userAnswer = '';
    if (e.target.closest('.even-box')) { droppedBox = evenBox; userAnswer = 'even'; }
    else if (e.target.closest('.odd-box')) { droppedBox = oddBox; userAnswer = 'odd'; }
    if (!droppedBox) return;
    evenBox.classList.remove('drag-over'); oddBox.classList.remove('drag-over');
    checkAnswer(userAnswer, droppedBox);
  }

  function checkAnswer(userAnswer, targetBox) {
    if (isAnswered) return;
    isAnswered = true; clearInterval(timerInterval); currentNumberElement.draggable = false; currentNumberElement.classList.remove('dragging');
    const isCorrect = userAnswer === currentAnswer;
    if (isCorrect) {
      score++; correctAnswers++;
      if (targetBox === evenBox) { evenResultElement.textContent = 'Đúng rồi!'; evenResultElement.classList.add('correct'); oddResultElement.textContent = ''; }
      else { oddResultElement.textContent = 'Đúng rồi!'; oddResultElement.classList.add('correct'); evenResultElement.textContent = ''; }
    } else {
      wrongAnswers++;
      if (targetBox === evenBox) {
        evenResultElement.textContent = 'Sai rồi!'; evenResultElement.classList.add('wrong');
        if (currentAnswer === 'odd') { oddResultElement.textContent = 'Đáp án đúng!'; oddResultElement.classList.add('correct'); }
      } else {
        oddResultElement.textContent = 'Sai rồi!'; oddResultElement.classList.add('wrong');
        if (currentAnswer === 'even') { evenResultElement.textContent = 'Đáp án đúng!'; evenResultElement.classList.add('correct'); }
      }
    }
    updateStats();
    setTimeout(nextQuestion, 2000);
  }



  // touch handlers
  function initTouchEvents() {
    let touchStartX = 0; let touchStartY = 0;
    function touchStartHandler(e) {
      if (!isGameActive || isAnswered) return;
      const touch = e.touches[0]; touchStartX = touch.clientX; touchStartY = touch.clientY;
      currentNumberElement.classList.add('dragging'); e.preventDefault();
    }
    function touchEndHandler(e) {
      if (!isGameActive || isAnswered || !currentNumberElement.classList.contains('dragging')) return;
      const touch = e.changedTouches[0]; const touchEndX = touch.clientX; const touchEndY = touch.clientY; const deltaX = touchEndX - touchStartX; const deltaY = touchEndY - touchStartY;
      if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
        let userAnswer = ''; let targetBox = null;
        if (deltaX < -50 && Math.abs(deltaX) > Math.abs(deltaY)) { userAnswer = 'even'; targetBox = evenBox; }
        else if (deltaX > 50 && Math.abs(deltaX) > Math.abs(deltaY)) { userAnswer = 'odd'; targetBox = oddBox; }
        if (userAnswer && targetBox) checkAnswer(userAnswer, targetBox);
      }
      currentNumberElement.classList.remove('dragging'); evenBox.classList.remove('drag-over'); oddBox.classList.remove('drag-over'); e.preventDefault();
    }

    currentNumberElement.addEventListener('touchstart', touchStartHandler, { passive: false });
    currentNumberElement.addEventListener('touchend', touchEndHandler, { passive: false });

    function evenTouchStart() { if (!isGameActive || isAnswered) return; evenBox.classList.add('drag-over'); }
    function oddTouchStart() { if (!isGameActive || isAnswered) return; oddBox.classList.add('drag-over'); }
    evenBox.addEventListener('touchstart', evenTouchStart);
    oddBox.addEventListener('touchstart', oddTouchStart);

    function docTouchEnd() { evenBox.classList.remove('drag-over'); oddBox.classList.remove('drag-over'); }
    document.addEventListener('touchend', docTouchEnd);

    // store to remove later
    container._clTouch = { touchStartHandler, touchEndHandler, evenTouchStart, oddTouchStart, docTouchEnd };
  }

  // wire up events
  currentNumberElement.addEventListener('dragstart', handleDragStart);
  evenBox.addEventListener('dragover', handleDragOver);
  evenBox.addEventListener('dragleave', handleDragLeave);
  evenBox.addEventListener('drop', handleDrop);
  oddBox.addEventListener('dragover', handleDragOver);
  oddBox.addEventListener('dragleave', handleDragLeave);
  oddBox.addEventListener('drop', handleDrop);

  nextBtn.addEventListener('click', nextQuestion);
  
  const finishBtn = container.querySelector('#cl-finishBtn');
  finishBtn?.addEventListener('click', async () => {
    isGameActive = false;
    clearInterval(timerInterval);
    
    // Save result to backend
    const timeSpent = 300 - timeLeft;
    const result = await saveChanLeResult(score, timeSpent);
    const stars = result?.stars || (score >= 80 ? 3 : score >= 60 ? 2 : score >= 40 ? 1 : 0);
    
    // Show completion modal
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;';
    modal.innerHTML = `
      <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); text-align: center; max-width: 400px;">
        <h2 style="font-size: 32px; margin-bottom: 20px; color: #4CAF50;">🎉 Hoàn thành!</h2>
        <div style="background: #f0f0f0; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <p style="font-size: 18px; margin: 5px 0; color: #666;">Điểm: <strong style="font-size: 24px; color: #2196F3;">${score}%</strong></p>
          <p style="font-size: 18px; margin: 10px 0; color: #666;">Đúng: ${correctAnswers} | Sai: ${wrongAnswers}</p>
          <p style="font-size: 36px; margin: 15px 0;">${'⭐'.repeat(stars)}${'☆'.repeat(3-stars)}</p>
        </div>
        <button onclick="location.reload()" style="padding: 12px 24px; font-size: 16px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Chơi lại</button>
      </div>
    `;
    container.appendChild(modal);
  });
  
  restartBtn.addEventListener('click', () => { isGameActive = false; clearInterval(timerInterval); setTimeout(() => { initGame(); }, 300); });

  initTouchEvents();

  // start the game
  generateNewNumber();
  startTimer();

  // cleanup
  container._chanLeCleanup = () => {
    clearInterval(timerInterval);
    currentNumberElement.removeEventListener('dragstart', handleDragStart);
    evenBox.removeEventListener('dragover', handleDragOver);
    evenBox.removeEventListener('dragleave', handleDragLeave);
    evenBox.removeEventListener('drop', handleDrop);
    oddBox.removeEventListener('dragover', handleDragOver);
    oddBox.removeEventListener('dragleave', handleDragLeave);
    oddBox.removeEventListener('drop', handleDrop);
    nextBtn.removeEventListener('click', nextQuestion);
    restartBtn.removeEventListener('click', () => { isGameActive = false; clearInterval(timerInterval); setTimeout(() => { initGame(); }, 300); });


    // touch cleanup
    if (container._clTouch) {
      currentNumberElement.removeEventListener('touchstart', container._clTouch.touchStartHandler);
      currentNumberElement.removeEventListener('touchend', container._clTouch.touchEndHandler);
      evenBox.removeEventListener('touchstart', container._clTouch.evenTouchStart);
      oddBox.removeEventListener('touchstart', container._clTouch.oddTouchStart);
      document.removeEventListener('touchend', container._clTouch.docTouchEnd);
      delete container._clTouch;
    }

    try { currentNumberElement.draggable = false; } catch(e) {}
    delete container._chanLeCleanup;
  };
}

export function unmount(container) { if (!container) return; if (container._chanLeCleanup) container._chanLeCleanup(); }
