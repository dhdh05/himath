export function mount(container) {
  if (!container) return;

  // --- CAU HINH GAME ---
  const GAME_CONFIG = {
    totalQuestions: 10,      // Tong so cau hoi
    gameType: 'dem-so',      // Key game trong DB (game_type)
    levelId: 56,             // ID level trong DB (gia su level 1 cua dem so la 56 theo file db.sql)
    passScore: 50            // Diem toi thieu de qua man
  };

  // ensure css is loaded
  if (!document.querySelector('link[data-panel="dem-so"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './panels/dem-so/style.css';
    link.setAttribute('data-panel', 'dem-so');
    document.head.appendChild(link);
  }

  // root markup (scoped to panel container)
  container.innerHTML = `
    <div class="demso-container">
      <div class="game-container" id="gameScreen">
        <div class="game-header">
            <h1><i class="fas fa-calculator"></i> Đếm Icon</h1>
        </div>

        <div class="game-stats">
            <div class="stat">
                <div class="stat-label">Câu</div>
                <div class="stat-value"><span id="questionNumber">1</span>/${GAME_CONFIG.totalQuestions}</div>
            </div>
            <div class="stat">
                <div class="stat-label">Đúng</div>
                <div class="stat-value correct" id="correctCount">0</div>
            </div>
            <div class="stat">
                <div class="stat-label">Sai</div>
                <div class="stat-value wrong" id="wrongCount">0</div>
            </div>
        </div>

        <div class="question-box">
            <h2>Đếm số hình dưới đây:</h2>
        </div>

        <div class="icons-display" id="iconsContainer">
            </div>

        <div class="answers-section">
            <h3>Chọn số lượng đúng:</h3>
            <div class="answers-grid" id="answersContainer">
                </div>
        </div>

        <div class="controls">
            <div class="result-message" id="resultMessage"></div>
            <button id="nextBtn" class="control-btn next-btn" style="display:none">
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
          <button id="restartBtn" class="control-btn restart-btn">
              <i class="fas fa-redo"></i> Chơi lại
          </button>
        </div>
      </div>
    </div>
  `;

  // instrumentation
  try { if (window.HiMathStats) window.HiMathStats.startPage('digits-dem-so'); } catch (e) { }

  // ================================
  // GAME LOGIC
  // ================================
  const iconTypes = [
    { icon: "fas fa-apple-alt", color: "#ff6b6b" },
    { icon: "fas fa-lemon", color: "#FF9800" },
    { icon: "fas fa-star", color: "#FFC107" },
    { icon: "fas fa-heart", color: "#f44336" },
    { icon: "fas fa-cloud", color: "#2196F3" },
    { icon: "fas fa-sun", color: "#FFC107" },
    { icon: "fas fa-moon", color: "#607D8B" },
    { icon: "fas fa-tree", color: "#4CAF50" },
    { icon: "fas fa-gem", color: "#9C27B0" },
    { icon: "fas fa-snowflake", color: "#03A9F4" }
  ];

  // state
  let questionNumber = 1;
  let correctCount = 0;
  let wrongCount = 0;
  let isAnswered = false;
  let currentCorrectAnswer = 0;
  let currentIconsData = [];
  let currentIconType = null;
  let autoNextTimeout = null;

  // Time tracking
  let startTime = Date.now();

  // dom
  const gameScreen = container.querySelector('#gameScreen');
  const endScreen = container.querySelector('#endScreen');
  const questionNumberElement = container.querySelector('#questionNumber');
  const correctCountElement = container.querySelector('#correctCount');
  const wrongCountElement = container.querySelector('#wrongCount');
  const iconsContainer = container.querySelector('#iconsContainer');
  const answersContainer = container.querySelector('#answersContainer');
  const nextBtn = container.querySelector('#nextBtn');
  const restartBtn = container.querySelector('#restartBtn');
  const resultMessageElement = container.querySelector('#resultMessage');

  // helper: get UserID safely tu current user
  function getUserId() {
    try {
      const currentUser = JSON.parse(localStorage.getItem('hm_user') || 'null');
      if (currentUser && (currentUser.id || currentUser.user_id)) {
        return currentUser.id || currentUser.user_id;
      }
    } catch (e) { }
    // Fallback: Neu chua dang nhap, dung HiMathUserId hoac null
    return window.HiMathUserId || null;
  }

  // Audio helper
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
    startTime = Date.now(); // Reset gio choi

    // UI Reset
    gameScreen.style.display = 'block';
    endScreen.style.display = 'none';

    updateStats();
    generateNewQuestion();
  }

  function generateNewQuestion() {
    isAnswered = false;
    if (autoNextTimeout) { clearTimeout(autoNextTimeout); autoNextTimeout = null; }

    // Reset UI per question
    resultMessageElement.textContent = '';
    resultMessageElement.className = 'result-message';
    resultMessageElement.classList.remove('show');
    nextBtn.style.display = 'none';

    questionNumberElement.textContent = questionNumber;

    questionNumberElement.textContent = questionNumber;

    // Voice Instruction
    speakText("Bé hãy đếm số hình dưới đây nhé");

    // Logic tao cau hoi
    currentIconType = iconTypes[getRandomNumber(0, iconTypes.length - 1)];
    currentCorrectAnswer = getRandomNumber(0, 10); // Dem so luong 0-10
    currentIconsData = [];
    for (let i = 0; i < currentCorrectAnswer; i++) {
      currentIconsData.push({ icon: currentIconType.icon, color: currentIconType.color, index: i });
    }

    displayIcons();
    generateAnswers();
  }

  function displayIcons() {
    iconsContainer.innerHTML = '';
    currentIconsData.forEach((iconData, index) => {
      const elem = document.createElement('div');
      elem.className = 'icon-item';
      elem.style.setProperty('--i', index);
      const iEl = document.createElement('i');
      iEl.className = iconData.icon;
      iEl.style.color = iconData.color;
      elem.appendChild(iEl);
      iconsContainer.appendChild(elem);
    });
  }

  function generateAnswers() {
    answersContainer.innerHTML = '';
    const answers = [currentCorrectAnswer];
    while (answers.length < 4) {
      let wrongAnswer;
      const offset = getRandomNumber(1, 3);
      const shouldAdd = Math.random() > 0.5;
      wrongAnswer = shouldAdd ? currentCorrectAnswer + offset : currentCorrectAnswer - offset;
      if (wrongAnswer >= 0 && wrongAnswer <= 20 && !answers.includes(wrongAnswer)) answers.push(wrongAnswer);
    }
    const shuffled = shuffleArray([...answers]);
    shuffled.forEach(ans => {
      const btn = document.createElement('button');
      btn.className = 'answer-btn';
      btn.textContent = ans;
      btn.dataset.answer = ans;
      btn.dataset.correct = ans === currentCorrectAnswer ? 'true' : 'false';

      btn.addEventListener('click', () => handleAnswerClick(btn));
      answersContainer.appendChild(btn);
    });
  }

  function handleAnswerClick(clickedButton) {
    if (isAnswered) return;
    isAnswered = true;

    const isCorrect = clickedButton.dataset.correct === 'true';

    // UI Feedback
    const allBtns = container.querySelectorAll('.answer-btn');
    allBtns.forEach(button => {
      button.classList.add('answered');
      if (button.dataset.correct === 'true') button.classList.add('correct');
      else if (button === clickedButton && !isCorrect) button.classList.add('incorrect');
      button.disabled = true;
    });

    if (isCorrect) {
      correctCount++;
      resultMessageElement.textContent = '🎉 Chính xác!';
      resultMessageElement.classList.add('correct');
      playSoundFile('sound_correct_answer_long.mp3');
    } else {
      wrongCount++;
      resultMessageElement.textContent = '❌ Sai rồi!';
      resultMessageElement.classList.add('incorrect');
      playSoundFile('sound_wrong_answer_long.mp3');
    }

    resultMessageElement.classList.add('show');
    updateStats();

    // Auto next logic
    if (questionNumber < GAME_CONFIG.totalQuestions) {
      autoNextTimeout = setTimeout(nextQuestion, 1500); // Tu chuyen cau sau 1.5s
    } else {
      autoNextTimeout = setTimeout(finishGame, 1500);   // Het cau thi ket thuc
    }
  }

  function updateStats() {
    correctCountElement.textContent = correctCount;
    wrongCountElement.textContent = wrongCount;
  }

  function nextQuestion() {
    questionNumber++;
    generateNewQuestion();
  }

  // --- KET THUC GAME & GUI KET QUA ---
  async function finishGame() {
    // 1. Tinh toan
    const totalTime = Math.round((Date.now() - startTime) / 1000); // giay
    const score = Math.round((correctCount / GAME_CONFIG.totalQuestions) * 100);

    // Tinh sao
    let stars = 0;
    if (score === 100) stars = 3;
    else if (score >= 80) stars = 2;
    else if (score >= 50) stars = 1;

    const isPassed = score >= GAME_CONFIG.passScore;

    // 2. Hien thi UI Ket qua
    gameScreen.style.display = 'none';
    endScreen.style.display = 'block';

    container.querySelector('#endTitle').textContent = isPassed ? "Chúc Mừng! 🎉" : "Cố Gắng Lần Sau! 💪";
    container.querySelector('#endScore').textContent = `${score}/100 Điểm (${correctCount}/${GAME_CONFIG.totalQuestions} câu)`;
    container.querySelector('#endTime').textContent = `Thời gian: ${totalTime} giây`;

    // Render sao
    const starContainer = container.querySelector('#endStars');
    starContainer.innerHTML = '';
    for (let i = 1; i <= 3; i++) {
      if (i <= stars) starContainer.innerHTML += '<i class="fas fa-star"></i>';
      else starContainer.innerHTML += '<i class="far fa-star"></i>';
    }

    // 3. Gui API Submit ve Server
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
      console.log("📤 Submitting results:", payload);
      const headers = window.getAuthHeaders ? window.getAuthHeaders() : { 'Content-Type': 'application/json' };
      const apiUrl = window.API_CONFIG?.ENDPOINTS?.GAMES?.SUBMIT || 'http://localhost:3000/api/games/submit';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      console.log("📥 Server response:", data);

      if (data.success) {
        // Co the them hieu ung thong bao "Da luu diem"
      }
    } catch (err) {
      console.error("Loi gui ket qua:", err);
    }
  }

  function getRandomNumber(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function shuffleArray(array) { const s = [...array]; for (let i = s.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[s[i], s[j]] = [s[j], s[i]]; } return s; }

  // events
  nextBtn.addEventListener('click', nextQuestion);
  restartBtn.addEventListener('click', initGame);

  // start
  initGame();

  // cleanup
  container._demSoCleanup = () => {
    nextBtn.removeEventListener('click', nextQuestion);
    restartBtn.removeEventListener('click', initGame);
    if (autoNextTimeout) { clearTimeout(autoNextTimeout); autoNextTimeout = null; }
    try { if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; currentAudio = null; } } catch (e) { }
    try { if (window.HiMathStats) window.HiMathStats.endPage('digits-dem-so'); } catch (e) { }

    delete container._demSoCleanup;
  };
}


export function unmount(container) { if (!container) return; if (container._demSoCleanup) container._demSoCleanup(); }
