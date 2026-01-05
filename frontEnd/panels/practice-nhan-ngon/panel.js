// AI Fingers panel - integrates MediaPipe Hands for finger-counting practice
export function mount(container) {
	if (!container) return;

	// --- CAU HINH ---
	const GAME_CONFIG = {
		totalQuestions: 10,
		levelId: 70, // ID trong db.sql cho bai Tinh ngon tay
		passScore: 50
	};

	// ensure css is loaded
	if (!document.querySelector('link[data-panel="practice-nhan-ngon"]')) {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = './panels/practice-nhan-ngon/style.css';
		link.setAttribute('data-panel', 'practice-nhan-ngon');
		document.head.appendChild(link);
	}

	// render panel content (scoped inside container)
	container.innerHTML = `
		<div class="practice-nhan-panel">
			<div class="ai-container" id="gameScreen">
				<div id="loading">
					<div class="loader"></div>
					<p>Đang tải mô hình AI...</p>
				</div>

				<!-- Phan tren: Cau hoi -->
				<div class="question-section">
				<div class="hud">
                    <div class="stats-group">
					    <div class="score">Điểm: <span id="score-val">0</span></div>
                        <div class="q-count">Câu: <span id="q-val">1</span>/${GAME_CONFIG.totalQuestions}</div>
                    </div>
					<div class="status">AI thấy: <span id="detected-fingers" style="color:yellow; font-size:1.1em">0</span> ngón</div>
				</div>

				<div class="question-box">
					<span id="question">Đang khởi tạo...</span>
						<button id="speak-btn" class="speak-btn" title="Đọc lại câu hỏi" aria-label="Đọc lại câu hỏi">
							<span class="speak-icon">🔊</span>
						</button>
					</div>
				</div>

				<!-- Phan duoi: Khung nhan dien tay -->
				<div class="camera-section">
				<div class="progress-bar"><div id="progress-fill"></div></div>
				<video id="input_video" playsinline style="display:none"></video>
				<canvas id="output_canvas"></canvas>
				</div>
			</div>

            <div class="result-screen" id="endScreen" style="display: none; text-align: center; padding: 40px; color: #fff;">
                <h2 id="endTitle" style="font-size: 32px; margin-bottom: 20px;">Kết quả</h2>
                <div id="endStars" style="font-size: 50px; color: #FFC107; margin-bottom: 20px;"></div>
                <p id="endScore" style="font-size: 24px;">0 Điểm</p>
                <p id="endTime" style="color: #ccc;">Thời gian: 0s</p>
                <div style="margin-top: 30px;">
                    <button id="restartBtn" style="padding: 12px 24px; font-size: 18px; border-radius: 20px; border: none; background: #4CAF50; color: white; cursor: pointer;">
                        Chơi lại
                    </button>
                </div>
            </div>
		</div>
	`;

	// --- TRACKING START ---
	try { if (window.HiMathStats) window.HiMathStats.startPage('practice-nhan-ngon'); } catch (e) { }

	const qs = sel => container.querySelector(sel);

	// dynamic script loader (idempotent)
	function loadScript(src) {
		return new Promise((resolve, reject) => {
			if (document.querySelector(`script[src="${src}"]`)) return resolve();
			const s = document.createElement('script');
			s.src = src;
			s.async = true;
			s.onload = () => resolve();
			s.onerror = () => reject(new Error('Failed to load ' + src));
			document.head.appendChild(s);
		});
	}

	// URLs used in your original source
	const mpScripts = [
		'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
		'https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js',
		'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js',
		'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js'
	];

	// DOM elements
	const gameScreen = qs('#gameScreen');
	const endScreen = qs('#endScreen');
	const videoElement = qs('#input_video');
	const canvasElement = qs('#output_canvas');
	const canvasCtx = canvasElement.getContext('2d');
	const scoreEl = qs('#score-val');
	const qCountEl = qs('#q-val');
	const fingerEl = qs('#detected-fingers');
	const questionEl = qs('#question');
	const loadingEl = qs('#loading');
	const progressEl = qs('.progress-bar');
	const progressFill = qs('#progress-fill');
	const restartBtn = qs('#restartBtn');
	const speakBtn = qs('#speak-btn');

	// Event listener cho nut doc to
	if (speakBtn) {
		speakBtn.addEventListener('click', () => {
			const questionText = questionEl.innerText;
			if (questionText && questionText !== 'Đang khởi tạo...') {
				speakQuestion(questionText);
			}
		});
	}

	// game state
	let score = 0;
	let questionCount = 1;
	let currentTarget = 0;
	let holdTimer = 0;
	const HOLD_THRESHOLD = 30; // Giam nhe xuong 30 frame cho be de choi hon (khoang 1s giu yen)
	let isModelLoaded = false;
	let startTime = null;
	let isProcessingAnswer = false; // Flag to prevent multi-trigger bug

	// media-pipe objects
	let hands = null;
	let camera = null;

	function getUserId() {
		try {
			const currentUser = JSON.parse(localStorage.getItem('hm_user') || 'null');
			if (currentUser && (currentUser.id || currentUser.user_id)) {
				return currentUser.id || currentUser.user_id;
			}
		} catch (e) { }
		return window.HiMathUserId || null;
	}

	// Text-to-speech helper - Chuyen doi phep toan sang tieng Viet
	function speakQuestion(questionText) {
		if ('speechSynthesis' in window) {
			// Dung bat ky speech nao dang chay
			window.speechSynthesis.cancel();

			// Chuyen doi phep toan sang tieng Viet
			let speakText = questionText;

			// Thay the cac ky hieu toan hoc bang tu tieng Viet
			speakText = speakText.replace(/\s*\+\s*/g, ' cộng ');
			speakText = speakText.replace(/\s*-\s*/g, ' trừ ');
			speakText = speakText.replace(/\s*=\s*/g, ' bằng ');
			speakText = speakText.replace(/\?/g, ' bao nhiêu');

			// Dam bao co khoang trang hop ly
			speakText = speakText.replace(/\s+/g, ' ').trim();

			const utterance = new SpeechSynthesisUtterance(speakText);
			utterance.lang = 'vi-VN';
			utterance.rate = 0.85; // Toc do doc cham hon mot chut de de nghe
			utterance.pitch = 1.0;
			utterance.volume = 1.0;

			window.speechSynthesis.speak(utterance);
		}
	}

	// Voice chuc mung khi tra loi dung
	function speakCongratulations() {
		if ('speechSynthesis' in window) {
			// Dung speech hien tai
			window.speechSynthesis.cancel();

			setTimeout(() => {
				const utterance = new SpeechSynthesisUtterance('Đúng rồi! Bé giỏi quá!');
				utterance.lang = 'vi-VN';
				utterance.rate = 0.9;
				utterance.pitch = 1.1; // Cao hon mot chut de vui ve hon
				utterance.volume = 1.0;
				window.speechSynthesis.speak(utterance);
			}, 100);
		}
	}


	function newQuestion() {
		isProcessingAnswer = false; // Reset flag for new question
		if (!startTime) startTime = Date.now(); // Chi bat dau dem gio khi cau hoi dau tien hien ra

		qCountEl.innerText = questionCount;

		// Logic tao cau hoi pham vi 10
		let a = Math.floor(Math.random() * 6);
		let b = Math.floor(Math.random() * 5);
		let questionText = '';
		if (Math.random() > 0.5) {
			currentTarget = a + b;
			questionText = `${a} + ${b} = ?`;
		} else {
			if (a < b) [a, b] = [b, a];
			currentTarget = a - b;
			questionText = `${a} - ${b} = ?`;
		}
		questionEl.innerText = questionText;

		// Tu dong doc to cau hoi
		setTimeout(() => {
			speakQuestion(questionText);
		}, 300);

		holdTimer = 0;
		progressEl.style.display = 'none';
		progressFill.style.width = '0%';
	}

	function countFingers(landmarks) {
		let count = 0;
		const fingerTips = [8, 12, 16, 20];
		const fingerPips = [6, 10, 14, 18];
		for (let i = 0; i < 4; i++) {
			if (landmarks[fingerTips[i]].y < landmarks[fingerPips[i]].y) count++;
		}
		const thumbTip = landmarks[4];
		const thumbIp = landmarks[3];
		const pinkyMcp = landmarks[17];
		if (Math.abs(thumbTip.x - pinkyMcp.x) > Math.abs(thumbIp.x - pinkyMcp.x)) count++;
		return count;
	}

	function onResults(results) {
		if (!isModelLoaded) {
			isModelLoaded = true;
			loadingEl.style.display = 'none';
			newQuestion();
		}

		// draw frame
		canvasCtx.save();
		canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
		canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

		let totalFingers = 0;
		if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
			for (const landmarks of results.multiHandLandmarks) {
				if (typeof drawConnectors === 'function') drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 5 });
				if (typeof drawLandmarks === 'function') drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
				totalFingers += countFingers(landmarks);
			}
		}

		fingerEl.innerText = totalFingers;
		checkAnswer(totalFingers);
		canvasCtx.restore();
	}

	function checkAnswer(detectedNumber) {
		if (!isModelLoaded || endScreen.style.display === 'block') return;
		if (isProcessingAnswer) return; // Prevent processing if already answered

		if (detectedNumber === currentTarget) {
			progressEl.style.display = 'block';
			holdTimer++;
			let percentage = (holdTimer / HOLD_THRESHOLD) * 100;
			progressFill.style.width = `${percentage}%`;

			if (holdTimer >= HOLD_THRESHOLD) {
				// TRA LOI DUNG
				isProcessingAnswer = true; // Set flag to lock processing
				score++;
				scoreEl.innerText = score * 10; // 1 cau 10 diem
				canvasElement.style.filter = 'sepia(1) hue-rotate(90deg) saturate(5)'; // Hieu ung xanh

				// Voice chuc mung
				speakCongratulations();

				setTimeout(() => { canvasElement.style.filter = 'none'; }, 300);

				// Chuyen cau hoac ket thuc (cho thoi gian hien thi/am thanh) - tang len 5s
				setTimeout(() => {
					if (questionCount < GAME_CONFIG.totalQuestions) {
						questionCount++;
						newQuestion();
					} else {
						finishGame();
					}
				}, 5000); // Delay 5000ms de voice/hieu ung kip doc
			}
		} else {
			holdTimer = 0;
			progressFill.style.width = '0%';
			if (holdTimer === 0) progressEl.style.display = 'none';
		}
	}

	async function finishGame() {
		// 1. Dung Camera & AI
		try { if (camera) camera.stop(); } catch (e) { }

		// 2. Tinh diem
		const totalTime = Math.round((Date.now() - startTime) / 1000);
		const finalScore = Math.round((score / GAME_CONFIG.totalQuestions) * 100); // Quy ra thang 100

		let stars = 0;
		if (finalScore === 100) stars = 3;
		else if (finalScore >= 80) stars = 2;
		else if (finalScore >= 50) stars = 1;

		const isPassed = finalScore >= GAME_CONFIG.passScore;

		// 3. UI
		gameScreen.style.display = 'none';
		endScreen.style.display = 'block';

		container.querySelector('#endTitle').textContent = isPassed ? "Tuyệt Vời! 🎉" : "Cố Gắng Lần Sau! 💪";
		container.querySelector('#endScore').textContent = `${finalScore}/100 Điểm`;
		container.querySelector('#endTime').textContent = `Thời gian: ${totalTime}s`;

		let starHtml = '';
		for (let i = 1; i <= 3; i++) starHtml += (i <= stars) ? '★' : '☆';
		container.querySelector('#endStars').innerHTML = starHtml;

		// 4. Gui API Submit
		try {
			const headers = window.getAuthHeaders ? window.getAuthHeaders() : { 'Content-Type': 'application/json' };
			const apiUrl = window.API_CONFIG?.ENDPOINTS?.GAMES?.SUBMIT || 'http://localhost:3000/api/games/submit';
			await fetch(apiUrl, {
				method: 'POST',
				headers: headers,
				body: JSON.stringify({
					student_id: getUserId(),
					level_id: GAME_CONFIG.levelId,
					game_type: 'practice-nhan-ngon',
					score: finalScore,
					stars: stars,
					is_passed: isPassed,
					time_spent: totalTime
				})
			});
			console.log("Da luu ket qua Nhan Ngon");
		} catch (err) {
			console.error("Loi gui ket qua:", err);
		}
	}

	function initCamera() {
		Promise.all(mpScripts.map(loadScript)).then(() => {
			try {
				canvasElement.width = 1280;
				canvasElement.height = 720;

				hands = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
				hands.setOptions({
					maxNumHands: 2,
					modelComplexity: 1,
					minDetectionConfidence: 0.5,
					minTrackingConfidence: 0.5
				});
				hands.onResults(onResults);

				camera = new Camera(videoElement, {
					onFrame: async () => { await hands.send({ image: videoElement }); },
					width: 1280,
					height: 720
				});
				camera.start();
			} catch (err) {
				console.error('Failed to initialize MediaPipe Hands', err);
				loadingEl.innerText = 'Không thể khởi tạo mô hình AI.';
			}
		}).catch(err => {
			console.error('Failed to load MediaPipe scripts', err);
			loadingEl.innerText = 'Không thể tải thư viện AI.';
		});
	}

	// Nut choi lai
	restartBtn.addEventListener('click', () => {
		score = 0;
		questionCount = 1;
		questionCount = 1;
		isModelLoaded = false;
		isProcessingAnswer = false; // Reset flag on restart
		startTime = null;

		endScreen.style.display = 'none';
		gameScreen.style.display = 'block';
		loadingEl.style.display = 'block';

		// Khoi dong lai camera
		initCamera();
	});

	// Bat dau lan dau
	initCamera();

	// store cleanup
	container._practiceNhanCleanup = () => {
		try { if (camera && typeof camera.stop === 'function') camera.stop(); } catch (e) { }
		try { if (hands && typeof hands.close === 'function') hands.close(); } catch (e) { }
		container.innerHTML = '';

		// --- TRACKING END ---
		try { if (window.HiMathStats) window.HiMathStats.endPage('practice-nhan-ngon'); } catch (e) { }

		delete container._practiceNhanCleanup;
	};
}


export function unmount(container) {
	if (!container) return;
	if (container._practiceNhanCleanup) container._practiceNhanCleanup();
}
