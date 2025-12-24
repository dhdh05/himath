// Constants - Match main.js
const AUTH_KEY = 'hm_is_authed';
const STUDENT_ID = 'STUDENT_ID';

// Save game result to backend
async function saveHocSoResult(score, timeSpent) {
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
        levelId: 1,
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
  // ensure css is loaded
  if (!document.querySelector('link[data-panel="hoc-so"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './panels/hoc-so/style.css';
    link.setAttribute('data-panel', 'hoc-so');
    document.head.appendChild(link);
  }

  container.innerHTML = `
    <div class="container">
      <header>
        <h1><i class="fas fa-graduation-cap"></i> Học Số 0-9</h1>
      </header>

      <main>
        <div class="audio-section">
          <button id="audioBtn" class="audio-btn">
            <i class="fas fa-volume-up"></i>
            <span>Phát âm</span>
          </button>
        </div>

        <div class="number-section">
          <div class="number-nav-container">
            <button id="prevBtn" class="nav-btn" disabled>
              <i class="fas fa-chevron-left"></i>
            </button>

            <div class="number-display-container">
              <div class="number-icon" id="numberDisplay">0</div>
              <div class="number-name" id="numberName">Số Không</div>
            </div>

            <button id="nextBtn" class="nav-btn">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div class="image-section">
          <div class="image-wrapper">
            <img id="numberImage" src="https://cdn.pixabay.com/photo/2016/11/29/13/55/balloons-1869796_1280.jpg" alt="Hình ảnh số 0">
          </div>
        </div>

        <div class="quick-numbers">
          <div class="numbers-container">
            <!-- Buttons will be inserted by script -->
          </div>
        </div>
      </main>
    </div>

    <audio id="numberAudio" preload="auto"></audio>
  `;

  // initialize digits functionality (adapted from main.js)
  const numbersData = [
    { number: 0, name: "Số Không", imageUrl: "https://cdn.pixabay.com/photo/2016/11/29/13/55/balloons-1869796_1280.jpg", audioUrl: "assets/sound/so_khong.mp3" },
    { number: 1, name: "Số Một", imageUrl: "https://cdn.pixabay.com/photo/2016/03/27/22/22/fox-1284512_1280.jpg", audioUrl: "assets/sound/so_mot.mp3" },
    { number: 2, name: "Số Hai", imageUrl: "https://cdn.pixabay.com/photo/2017/07/24/19/57/tiger-2535888_1280.jpg", audioUrl: "assets/sound/so_hai.mp3" },
    { number: 3, name: "Số Ba", imageUrl: "https://cdn.pixabay.com/photo/2015/03/26/09/39/puppy-690104_1280.jpg", audioUrl: "assets/sound/so_ba.mp3" },
    { number: 4, name: "Số Bốn", imageUrl: "https://cdn.pixabay.com/photo/2017/01/20/11/48/hedgehog-1995345_1280.jpg", audioUrl: "assets/sound/so_bon.mp3" },
    { number: 5, name: "Số Năm", imageUrl: "https://cdn.pixabay.com/photo/2016/02/10/16/37/cat-1192026_1280.jpg", audioUrl: "assets/sound/so_nam.mp3" },
    { number: 6, name: "Số Sáu", imageUrl: "https://cdn.pixabay.com/photo/2017/06/09/12/59/dice-2386810_1280.jpg", audioUrl: "assets/sound/so_sau.mp3" },
    { number: 7, name: "Số Bảy", imageUrl: "https://cdn.pixabay.com/photo/2013/04/01/21/31/rainbow-99180_1280.jpg", audioUrl: "assets/sound/so_bay.mp3" },
    { number: 8, name: "Số Tám", imageUrl: "https://cdn.pixabay.com/photo/2015/06/08/15/02/octopus-801125_1280.jpg", audioUrl: "assets/sound/so_tam.mp3" },
    { number: 9, name: "Số Chín", imageUrl: "https://cdn.pixabay.com/photo/2015/10/12/15/11/baseball-984444_1280.jpg", audioUrl: "assets/sound/so_chin.mp3" }
  ];

  let currentNumberIndex = 0;
  const audioElement = container.querySelector('#numberAudio');
  const audioBtn = container.querySelector('#audioBtn');
  const prevBtn = container.querySelector('#prevBtn');
  const nextBtn = container.querySelector('#nextBtn');
  const numberDisplay = container.querySelector('#numberDisplay');
  const numberName = container.querySelector('#numberName');
  const numberImage = container.querySelector('#numberImage');
  const numbersContainer = container.querySelector('.numbers-container');

  function createNumberButtons() {
    numbersContainer.innerHTML = '';
    numbersData.forEach((numberData, index) => {
      const numberBtn = document.createElement('button');
      numberBtn.className = 'number-btn';
      numberBtn.textContent = numberData.number;
      if (index === 0) numberBtn.classList.add('active');
      numberBtn.addEventListener('click', () => changeNumber(index));
      numbersContainer.appendChild(numberBtn);
    });
  }

  function updateDisplay() {
    const currentData = numbersData[currentNumberIndex];
    numberDisplay.textContent = currentData.number;
    numberName.textContent = currentData.name;
    numberImage.src = currentData.imageUrl;
    numberImage.alt = `Hình ảnh minh họa cho số ${currentData.number}`;
    if (audioElement) {
      try { audioElement.pause(); audioElement.currentTime = 0; } catch (e) { }
      audioElement.onended = null;
      audioElement.src = currentData.audioUrl;
      try { audioElement.load(); } catch (e) { }
      if (audioBtn) { audioBtn.innerHTML = `<i class="fas fa-volume-up"></i><span>Phát âm</span>`; audioBtn.disabled = false; }
    }
    prevBtn.disabled = currentNumberIndex === 0;
    nextBtn.disabled = currentNumberIndex === numbersData.length - 1;
    container.querySelectorAll('.number-btn').forEach(btn => btn.classList.remove('active'));
    const btns = container.querySelectorAll('.number-btn'); if (btns[currentNumberIndex]) btns[currentNumberIndex].classList.add('active');
  }

  function changeNumber(index) {
    if (index < 0 || index >= numbersData.length) return;
    currentNumberIndex = index; updateDisplay();
  }

  function playAudio() {
    if (!audioBtn || !audioElement) return;
    audioBtn.innerHTML = `<i class="fas fa-volume-up"></i><span>Đang phát...</span>`;
    audioBtn.disabled = true;
    audioElement.onended = () => { if (audioBtn) { audioBtn.innerHTML = `<i class="fas fa-volume-up"></i><span>Phát âm</span>`; audioBtn.disabled = false; } };
    try { audioElement.pause(); audioElement.currentTime = 0; } catch (e) { }
    const p = audioElement.play(); if (p && typeof p.then === 'function') p.catch(err => { console.error(err); if (audioBtn) { audioBtn.innerHTML = `<i class="fas fa-volume-up"></i><span>Phát âm</span>`; audioBtn.disabled = false; } });
  }

  function handleKeydown(event) {
    switch (event.key) {
      case 'ArrowLeft': if (currentNumberIndex > 0) changeNumber(currentNumberIndex - 1); break;
      case 'ArrowRight': if (currentNumberIndex < numbersData.length - 1) changeNumber(currentNumberIndex + 1); break;
      case ' ': case 'Enter': event.preventDefault(); playAudio(); break;
      default: if (/^[0-9]$/.test(event.key)) changeNumber(Number(event.key));
    }
  }

  // Save result and show completion
  async function completeGame() {
    const score = (currentNumberIndex + 1) * 10; // 0-10 numbers = 10-100 score
    const startTime = parseFloat(localStorage.getItem('GAME_START_TIME') || Date.now());
    const timeSpent = Math.round((Date.now() - startTime) / 1000); // in seconds
    const result = await saveHocSoResult(score, timeSpent);

    const stars = result?.stars || (score >= 80 ? 3 : score >= 60 ? 2 : 1);
    const resultHTML = `
      <div class="hoc-so-result-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;">
        <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); text-align: center; max-width: 400px;">
          <h2 style="font-size: 32px; margin-bottom: 20px; color: #4CAF50;">🎉 Hoàn thành!</h2>
          <div style="background: #f0f0f0; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <p style="font-size: 18px; margin: 5px 0; color: #666;">Điểm: <strong style="font-size: 24px; color: #2196F3;">${score}%</strong></p>
            <p style="font-size: 18px; margin: 10px 0; color: #666;">Thời gian: <strong>${timeSpent}s</strong></p>
            <p style="font-size: 36px; margin: 15px 0;">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</p>
          </div>
          <div style="display: flex; gap: 10px; justify-content: center;">
            <button onclick="location.reload()" style="padding: 12px 24px; font-size: 16px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Chơi lại</button>
            <button onclick="document.querySelector('[data-panel-hoc-so]').parentElement.textContent = ''; document.querySelector('.sidebar-menu').style.display='block';" style="padding: 12px 24px; font-size: 16px; background: #2196F3; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Quay lại</button>
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('afterbegin', resultHTML);
    localStorage.removeItem('GAME_START_TIME');
  }

  createNumberButtons(); updateDisplay();
  audioBtn?.addEventListener('click', playAudio);
  prevBtn?.addEventListener('click', () => changeNumber(currentNumberIndex - 1));
  nextBtn?.addEventListener('click', () => changeNumber(currentNumberIndex + 1));
  document.addEventListener('keydown', handleKeydown);

  // Add finish game button to controls
  const finishBtn = document.createElement('button');
  finishBtn.textContent = '✅ Hoàn thành';
  finishBtn.style.cssText = 'padding: 10px 20px; font-size: 16px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 15px; width: 100%;';
  finishBtn.addEventListener('click', completeGame);

  const controlsDiv = container.querySelector('[data-hoc-controls]') || container.querySelector('div:last-child');
  if (controlsDiv) {
    controlsDiv.appendChild(finishBtn);
  }

  // store cleanup on container
  container._hocCleanup = () => {
    document.removeEventListener('keydown', handleKeydown);
    audioBtn?.removeEventListener('click', playAudio);
    prevBtn?.removeEventListener('click', () => changeNumber(currentNumberIndex - 1));
    nextBtn?.removeEventListener('click', () => changeNumber(currentNumberIndex + 1));
    try { audioElement.pause(); audioElement.currentTime = 0; } catch (e) { }
    delete container._hocCleanup;
  };

  // Store start time for duration calculation
  localStorage.setItem('GAME_START_TIME', Date.now());
}

export function unmount(container) {
  if (!container) return;
  if (container._hocCleanup) container._hocCleanup();
}
