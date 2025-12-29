export function mount(container) {
  if (!container) return;

  // --- CẤU HÌNH ---
  const GAME_CONFIG = {
    totalQuestions: 10,
    levelId: 75, // ID trong db.sql cho bài So sánh cơ bản (0-10)
    passScore: 50
  };

  // ensure css is loaded
  if (!document.querySelector('link[data-panel="so-sanh"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './panels/so-sanh/style.css';
    link.setAttribute('data-panel','so-sanh');
    document.head.appendChild(link);
  }

  container.innerHTML = `
    <div class="sosanh-container">
      <div class="game-container" id="gameScreen">
        <div class="game-header">
            <h1>So Sánh Số</h1>
        </div>

        <div class="game-stats">
            <div class="stat">
                <div class="stat-label">Câu</div>
                <div class="stat-value"><span id="sosanh-questionNumber">1</span>/${GAME_CONFIG.totalQuestions}</div>
            </div>
            <div class="stat">
                <div class="stat-label">Đúng</div>
                <div class="stat-value correct" id="sosanh-correctCount">0</div>
            </div>
            <div class="stat">
                <div class="stat-label">Sai</div>
                <div class="stat-value wrong" id="sosanh-wrongCount">0</div>
            </div>
        </div>

        <div class="numbers-display">
            <div class="number-box left-box" id="sosanh-leftNumber">
                <div class="number-value">0</div>
            </div>
            
            <div class="comparison-box" id="sosanh-comparisonBox">
                <div class="question-mark">?</div>
                <div class="answer-symbol" id="sosanh-answerSymbol"></div>
            </div>
            
            <div class="number-box right-box" id="sosanh-rightNumber">
                <div class="number-value">0</div>
            </div>
        </div>

        <div class="question-box">
            <h2>Số bên trái <span class="highlight">?</span> số bên phải</h2>
        </div>

        <div class="answers-section">
            <h3>Chọn so sánh đúng:</h3>
            <div class="answers-container">
                <button class="answer-btn larger-btn" id="sosanh-largerBtn">
                    <i class="fas fa-greater-than"></i> Lớn hơn
                </button>
                <button class="answer-btn smaller-btn" id="sosanh-smallerBtn">
                    <i class="fas fa-less-than"></i> Bé hơn
                </button>
                </div>
        </div>

        <div class="controls">
            <button id="sosanh-nextBtn" class="control-btn next-btn" style="display:none">
                <i class="fas fa-forward"></i> Tiếp theo
            </button>
            <button id="sosanh-restartBtn" class="control-btn restart-btn" style="display:none">
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

  // --- TRACKING START ---
  try { if (window.HiMathStats) window.HiMathStats.startPage('compare-so-sanh'); } catch (e) {}

  // ---------- Game logic ----------
  let questionNumber = 1;
  let correctCount = 0;
  let wrongCount = 0;
  let isAnswered = false;
  let leftNumber = 0;
  let rightNumber = 0;
  let correctAnswer = ''; // 'larger' or 'smaller'
  let autoNextTimeout = null;
  let startTime = null;

  // DOM Elements
  const gameScreen = container.querySelector('#gameScreen');
  const endScreen = container.querySelector('#endScreen');
  const questionNumberElement = container.querySelector('#sosanh-questionNumber');
  const correctCountElement = container.querySelector('#sosanh-correctCount');
  const wrongCountElement = container.querySelector('#sosanh-wrongCount');
  const leftNumberElement = container.querySelector('#sosanh-leftNumber').querySelector('.number-value');
  const rightNumberElement = container.querySelector('#sosanh-rightNumber').querySelector('.number-value');
  const comparisonBox = container.querySelector('#sosanh-comparisonBox');
  const answerSymbol = container.querySelector('#sosanh-answerSymbol');
  const largerBtn = container.querySelector('#sosanh-largerBtn');
  const smallerBtn = container.querySelector('#sosanh-smallerBtn');
  const nextBtn = container.querySelector('#sosanh-nextBtn');
  const restartBtn = container.querySelector('#sosanh-restartBtn'); // Nút này ẩn trong màn chơi chính
  const endRestartBtn = container.querySelector('#end-restartBtn');

  // Helper: Get UserID từ current user
  function getUserId() {
    try {
      const currentUser = JSON.parse(localStorage.getItem('hm_user') || 'null');
      if (currentUser && (currentUser.id || currentUser.user_id)) {
        return currentUser.id || currentUser.user_id;
      }
    } catch (e) {}
    return window.HiMathUserId || null;
  }

  // Audio helper
  let currentAudio = null;
  function playSoundFile(filename) {
    return new Promise(resolve => {
      try {
        if (currentAudio) { try { currentAudio.pause(); currentAudio.currentTime = 0; } catch(e){} currentAudio = null; }
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
    questionNumber = 1; 
    correctCount = 0; 
    wrongCount = 0; 
    isAnswered = false;
    startTime = Date.now();
    
    // Reset UI
    gameScreen.style.display = 'block';
    endScreen.style.display = 'none';
    
    if (autoNextTimeout) { clearTimeout(autoNextTimeout); autoNextTimeout = null; }
    
    updateStats();
    generateNewQuestion();
  }

  function generateNewQuestion() {
    isAnswered = false;
    if (autoNextTimeout) { clearTimeout(autoNextTimeout); autoNextTimeout = null; }
    
    questionNumberElement.textContent = questionNumber;
    
    // pick two different numbers 0-10 (theo level db)
    do {
      leftNumber = getRandomNumber(0, 10);
      rightNumber = getRandomNumber(0, 10);
    } while (leftNumber === rightNumber); // Đảm bảo khác nhau để chỉ có Lớn/Bé (vì chưa làm nút Bằng)

    correctAnswer = leftNumber > rightNumber ? 'larger' : 'smaller';

    updateNumbersDisplay();
    resetUI();
  }

  function updateNumbersDisplay() {
    leftNumberElement.textContent = leftNumber;
    rightNumberElement.textContent = rightNumber;
  }

  function resetUI() {
    comparisonBox.classList.remove('show-answer');
    answerSymbol.textContent = '';
    
    largerBtn.className = 'answer-btn larger-btn';
    smallerBtn.className = 'answer-btn smaller-btn';
    largerBtn.disabled = false; 
    smallerBtn.disabled = false;
    
    nextBtn.style.display = 'none';
  }

  function handleAnswer(userAnswer) {
    if (isAnswered) return;
    isAnswered = true;
    const isCorrect = userAnswer === correctAnswer;
    
    largerBtn.disabled = true; 
    smallerBtn.disabled = true;

    // Show symbol
    answerSymbol.textContent = correctAnswer === 'larger' ? '>' : '<';
    comparisonBox.classList.add('show-answer');

    if (isCorrect) {
      correctCount++;
      if (userAnswer === 'larger') largerBtn.classList.add('correct'); else smallerBtn.classList.add('correct');
      playSoundFile('sound_correct_answer_long.mp3');
    } else {
      wrongCount++;
      if (userAnswer === 'larger') largerBtn.classList.add('incorrect'); else smallerBtn.classList.add('incorrect');
      // Show correct hint
      if (correctAnswer === 'larger') largerBtn.classList.add('correct'); else smallerBtn.classList.add('correct');
      playSoundFile('sound_wrong_answer_long.mp3');
    }

    updateStats();
    
    // Logic chuyển câu hoặc kết thúc
    if (questionNumber < GAME_CONFIG.totalQuestions) {
        questionNumber++;
        autoNextTimeout = setTimeout(generateNewQuestion, 1500);
    } else {
        autoNextTimeout = setTimeout(finishGame, 1500);
    }
  }

  function updateStats() { 
      correctCountElement.textContent = correctCount; 
      wrongCountElement.textContent = wrongCount; 
  }

  async function finishGame() {
    const totalTime = Math.round((Date.now() - startTime) / 1000);
    const score = Math.round((correctCount / GAME_CONFIG.totalQuestions) * 100);
    
    let stars = 0;
    if (score === 100) stars = 3;
    else if (score >= 80) stars = 2;
    else if (score >= 50) stars = 1;
    
    const isPassed = score >= GAME_CONFIG.passScore;

    // UI Result
    gameScreen.style.display = 'none';
    endScreen.style.display = 'block';

    container.querySelector('#endTitle').textContent = isPassed ? "Làm Tốt Lắm! 🎉" : "Cố Gắng Lần Sau! 💪";
    container.querySelector('#endScore').textContent = `${score}/100 Điểm`;
    container.querySelector('#endTime').textContent = `Thời gian: ${totalTime}s`;
    
    let starHtml = '';
    for(let i=1; i<=3; i++) starHtml += (i <= stars) ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
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
                game_type: 'so-sanh', // game_type trong DB
                score: score,
                stars: stars,
                is_passed: isPassed,
                time_spent: totalTime
            })
        });
        console.log("Đã lưu kết quả So Sánh");
    } catch(err) { console.error(err); }
  }

  function getRandomNumber(min,max) { return Math.floor(Math.random()*(max-min+1))+min; }

  // events
  largerBtn.addEventListener('click', () => handleAnswer('larger'));
  smallerBtn.addEventListener('click', () => handleAnswer('smaller'));
  // nextBtn hidden in this logic but kept for manual control if needed
  nextBtn.addEventListener('click', generateNewQuestion);
  restartBtn.addEventListener('click', initGame);
  endRestartBtn.addEventListener('click', initGame);

  // init
  initGame();

  // cleanup
  container._soSanhCleanup = () => {
    if (autoNextTimeout) { clearTimeout(autoNextTimeout); autoNextTimeout = null; }
    try { if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; currentAudio = null; } } catch(e) {}
    try { if (window.HiMathStats) window.HiMathStats.endPage('compare-so-sanh'); } catch (e) {}
    
    delete container._soSanhCleanup;
  };
}

export function unmount(container) { if (!container) return; if (container._soSanhCleanup) container._soSanhCleanup(); }


// export function mount(container) {
//   if (!container) return;
//   // ensure css is loaded
//   if (!document.querySelector('link[data-panel="so-sanh"]')) {
//     const link = document.createElement('link');
//     link.rel = 'stylesheet';
//     link.href = './panels/so-sanh/style.css';
//     link.setAttribute('data-panel','so-sanh');
//     document.head.appendChild(link);
//   }

//   container.innerHTML = `
//     <div class="sosanh-container">
//       <div class="game-container">
//         <div class="game-header">
//             <h1>So Sánh Số</h1>
//         </div>

//         <div class="game-stats">
//             <div class="stat">
//                 <div class="stat-label">Câu</div>
//                 <div class="stat-value" id="sosanh-questionNumber">1</div>
//             </div>
//             <div class="stat">
//                 <div class="stat-label">Đúng</div>
//                 <div class="stat-value correct" id="sosanh-correctCount">0</div>
//             </div>
//             <div class="stat">
//                 <div class="stat-label">Sai</div>
//                 <div class="stat-value wrong" id="sosanh-wrongCount">0</div>
//             </div>
//         </div>

//         <div class="numbers-display">
//             <div class="number-box left-box" id="sosanh-leftNumber">
//                 <div class="number-value">0</div>
//             </div>
            
//             <div class="comparison-box" id="sosanh-comparisonBox">
//                 <div class="question-mark">?</div>
//                 <div class="answer-symbol" id="sosanh-answerSymbol"></div>
//             </div>
            
//             <div class="number-box right-box" id="sosanh-rightNumber">
//                 <div class="number-value">0</div>
//             </div>
//         </div>

//         <div class="question-box">
//             <h2>Số bên trái <span class="highlight">?</span> số bên phải</h2>
//         </div>

//         <div class="answers-section">
//             <h3>Chọn so sánh đúng:</h3>
//             <div class="answers-container">
//                 <button class="answer-btn larger-btn" id="sosanh-largerBtn">
//                     <i class="fas fa-greater-than"></i> Lớn hơn
//                 </button>
//                 <button class="answer-btn smaller-btn" id="sosanh-smallerBtn">
//                     <i class="fas fa-less-than"></i> Bé hơn
//                 </button>
//             </div>
//         </div>

//         <div class="controls">
//             <button id="sosanh-nextBtn" class="control-btn next-btn">
//                 <i class="fas fa-forward"></i> Tiếp theo
//             </button>
//             <button id="sosanh-restartBtn" class="control-btn restart-btn">
//                 <i class="fas fa-redo"></i> Làm lại
//             </button>
//         </div>
//       </div>
//     </div>
//   `;

//   try { if (window.HiMathStats) window.HiMathStats.event('panel_mount', { page: 'compare-so-sanh' }); } catch (e) {}

//   // ---------- Game logic (scoped to container) ----------
//   let questionNumber = 1;
//   let correctCount = 0;
//   let wrongCount = 0;
//   let isAnswered = false;
//   let leftNumber = 0;
//   let rightNumber = 0;
//   let correctAnswer = ''; // 'larger' or 'smaller'
//   let autoNextTimeout = null;

//   const questionNumberElement = container.querySelector('#sosanh-questionNumber');
//   const correctCountElement = container.querySelector('#sosanh-correctCount');
//   const wrongCountElement = container.querySelector('#sosanh-wrongCount');
//   const leftNumberElement = container.querySelector('#sosanh-leftNumber').querySelector('.number-value');
//   const rightNumberElement = container.querySelector('#sosanh-rightNumber').querySelector('.number-value');
//   const comparisonBox = container.querySelector('#sosanh-comparisonBox');
//   const answerSymbol = container.querySelector('#sosanh-answerSymbol');
//   const largerBtn = container.querySelector('#sosanh-largerBtn');
//   const smallerBtn = container.querySelector('#sosanh-smallerBtn');
//   const nextBtn = container.querySelector('#sosanh-nextBtn');
//   const restartBtn = container.querySelector('#sosanh-restartBtn');

//   // audio helper
//   let currentAudio = null;
//   function playSoundFile(filename) {
//     return new Promise(resolve => {
//       try {
//         if (currentAudio) { try { currentAudio.pause(); currentAudio.currentTime = 0; } catch(e){} currentAudio = null; }
//         const audio = new Audio(`assets/sound/${filename}`);
//         currentAudio = audio;
//         const finish = () => { if (currentAudio === audio) currentAudio = null; resolve(); };
//         audio.addEventListener('ended', finish);
//         audio.addEventListener('error', finish);
//         const p = audio.play(); if (p && typeof p.then === 'function') p.catch(() => finish());
//       } catch (e) { currentAudio = null; resolve(); }
//     });
//   }

//   function initGame() {
//     questionNumber = 1; correctCount = 0; wrongCount = 0; isAnswered = false;
//     if (autoNextTimeout) { clearTimeout(autoNextTimeout); autoNextTimeout = null; }
//     updateStats();
//     generateNewQuestion();
//     nextBtn.disabled = true;
//   }

//   function generateNewQuestion() {
//     isAnswered = false;
//     questionNumberElement.textContent = questionNumber;
//     // pick two different numbers 0-9
//     do {
//       leftNumber = getRandomNumber(0,9);
//       rightNumber = getRandomNumber(0,9);
//     } while (leftNumber === rightNumber);

//     // determine correct answer but DO NOT set answerSymbol here (avoid inline style conflicts)
//     correctAnswer = leftNumber > rightNumber ? 'larger' : 'smaller';

//     updateNumbersDisplay();
//     resetUI();
//   }

//   function updateNumbersDisplay() {
//     leftNumberElement.textContent = leftNumber;
//     rightNumberElement.textContent = rightNumber;
//   }

//   function resetUI() {
//     comparisonBox.classList.remove('show-answer');
//     // remove any inline styles on answerSymbol to allow CSS class to control visibility
//     answerSymbol.textContent = '';
//     largerBtn.className = 'answer-btn larger-btn';
//     smallerBtn.className = 'answer-btn smaller-btn';
//     largerBtn.disabled = false; smallerBtn.disabled = false;
//     nextBtn.disabled = true;
//   }

//   function handleAnswer(userAnswer) {
//     if (isAnswered) return;
//     isAnswered = true;
//     const isCorrect = userAnswer === correctAnswer;
//     largerBtn.disabled = true; smallerBtn.disabled = true;

//     // set the symbol content then show it by toggling class
//     answerSymbol.textContent = correctAnswer === 'larger' ? '>' : '<';
//     comparisonBox.classList.add('show-answer');

//     if (isCorrect) {
//       correctCount++;
//       if (userAnswer === 'larger') largerBtn.classList.add('correct'); else smallerBtn.classList.add('correct');
//     } else {
//       wrongCount++;
//       if (userAnswer === 'larger') largerBtn.classList.add('incorrect'); else smallerBtn.classList.add('incorrect');
//       if (correctAnswer === 'larger') largerBtn.classList.add('correct'); else smallerBtn.classList.add('correct');
//     }

//     try { if (window.HiMathStats) window.HiMathStats.record('so_sanh_attempt', { questionNumber, leftNumber, rightNumber, chosen: userAnswer, correct: isCorrect }); } catch (e) {}

//     updateStats();
//     nextBtn.disabled = false;
//     const soundFile = isCorrect ? 'sound_correct_answer_long.mp3' : 'sound_wrong_answer_long.mp3';
//     playSoundFile(soundFile).then(() => nextQuestion());
//   }

//   function updateStats() { correctCountElement.textContent = correctCount; wrongCountElement.textContent = wrongCount; }

//   function nextQuestion() { if (autoNextTimeout) { clearTimeout(autoNextTimeout); autoNextTimeout = null; } questionNumber++; generateNewQuestion(); }

//   function getRandomNumber(min,max) { return Math.floor(Math.random()*(max-min+1))+min; }

//   // events (scoped)
//   largerBtn.addEventListener('click', () => handleAnswer('larger'));
//   smallerBtn.addEventListener('click', () => handleAnswer('smaller'));
//   nextBtn.addEventListener('click', nextQuestion);
//   restartBtn.addEventListener('click', initGame);

//   // init
//   initGame();

//   // cleanup
//   container._soSanhCleanup = () => {
//     largerBtn.removeEventListener('click', () => handleAnswer('larger'));
//     smallerBtn.removeEventListener('click', () => handleAnswer('smaller'));
//     nextBtn.removeEventListener('click', nextQuestion);
//     restartBtn.removeEventListener('click', initGame);
//     if (autoNextTimeout) { clearTimeout(autoNextTimeout); autoNextTimeout = null; }
//     try { if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; currentAudio = null; } } catch(e) {}
//     delete container._soSanhCleanup;
//     try { if (window.HiMathStats) window.HiMathStats.event('panel_unmount', { page: 'compare-so-sanh' }); } catch (e) {}
//   };
// }

// export function unmount(container) { if (!container) return; if (container._soSanhCleanup) container._soSanhCleanup(); }
