
export function mount(container) {
    if (!container) return;

    // --- 1. Load External CSS ---
    if (!document.querySelector('link[href="./panels/learning/style.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './panels/learning/style.css';
        document.head.appendChild(link);
    }

    // --- HTML Structure ---
    container.innerHTML = `
        <div class="learning-panel">
            <div class="learning-header">
                <h1>🎓 Góc Học Tập</h1>
                <p>Cùng xem video và học thêm nhiều kiến thức bổ ích nhé!</p>
            </div>

            <div id="lessonsGrid" class="lessons-grid">
                <div style="grid-column: 1/-1; text-align: center; color: #999;">Đang tải danh sách bài học...</div>
            </div>
        </div>

        <!-- Cute Video Modal -->
        <div id="videoModal" class="video-modal">
            <div class="modal-wrapper">
                <div class="modal-header">
                    <div id="modalTitle" class="modal-title">Đang phát video...</div>
                    <button id="closeVideoBtn" class="close-modal-btn"><i class="fas fa-times"></i></button>
                </div>
                <div class="video-container">
                    <!-- Player cho Youtube/Drive (Fallback) -->
                    <iframe id="iframePlayer" src="" allowfullscreen allow="autoplay"></iframe>
                    
                    <!-- Player cho file MP4 truc tiep & Drive Stream (Main) -->
                    <video id="nativePlayer" controls playsinline style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: none; background:black;"></video>
                </div>
                
                <!-- QUIZ AREA -->
                <button id="startQuizBtn" class="quiz-btn-start">📝 Làm Bài Tập Củng Cố</button>
                
                <div id="quizArea" class="quiz-section">
                    <button id="closeQuizBtn" class="quiz-close-btn"><i class="fas fa-times"></i></button>
                    <div id="quizWrap" class="quiz-wrap">
                        <div id="quizContent"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // --- 3. Logic ---
    const grid = document.getElementById('lessonsGrid');
    const modal = document.getElementById('videoModal');
    const iframePlayer = document.getElementById('iframePlayer');
    const nativePlayer = document.getElementById('nativePlayer');
    const closeBtn = document.getElementById('closeVideoBtn');
    const modalTitle = document.getElementById('modalTitle');

    // QUIZ ELEMENTS
    const startQuizBtn = document.getElementById('startQuizBtn');
    const quizArea = document.getElementById('quizArea'); // Overlay container
    const quizWrap = document.getElementById('quizWrap');
    const quizContent = document.getElementById('quizContent');
    const closeQuizBtn = document.getElementById('closeQuizBtn');

    // QUIZ STATE
    let currentLessonId = null;
    let currentLessonLang = 'vi-VN'; // Default Vietnamese
    let quizQuestions = [];
    let currentQuestionIndex = 0;
    let quizScore = 0;
    let selectedAnswer = null;

    // --- VIDEO TRACKING VARIABLES ---
    let videoStartTime = null;

    loadLessons();

    async function loadLessons() {
        try {
            console.log("📥 Fetching lessons from API...");
            const apiUrl = window.API_CONFIG?.ENDPOINTS?.LESSONS?.GET || 'http://localhost:3000/api/lessons';
            const res = await fetch(apiUrl);
            const data = await res.json();
            console.log("📦 Lessons Data:", data);

            if (data.success && data.data && data.data.length > 0) {
                renderLessons(data.data);
            } else {
                grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #7f8c8d; font-size: 1.2em;">Chưa có bài học nào được cập nhật.</div>';
            }
        } catch (error) {
            console.error("❌ Stats load error:", error);
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #e74c3c;">⚠️ Mất kết nối tới máy chủ! Vui lòng thử lại sau.</div>';
        }
    }

    function renderLessons(lessons) {
        grid.innerHTML = lessons.map(l => `
            <div class="lesson-card" data-video="${l.video_url}" data-title="${l.title}" data-id="${l.lesson_id}">
                <div class="lesson-thumb">
                    <img src="${l.thumbnail_url || 'https://via.placeholder.com/640x360?text=No+Wait'}" alt="${l.title}" onerror="this.src='./assets/images/default_lesson.jpg'">
                    <div class="play-icon"><i class="fas fa-play"></i></div>
                </div>
                <div class="lesson-content">
                    <span class="lesson-tag">${l.topic || 'Kiến thức'}</span>
                    <div class="lesson-title">${l.title}</div>
                    <div class="lesson-desc">${l.description || 'Bài học thú vị.'}</div>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.lesson-card').forEach(card => {
            card.addEventListener('click', () => {
                const videoUrl = card.dataset.video;
                const title = card.dataset.title;
                const lessonId = card.dataset.id;
                openVideo(videoUrl, title, lessonId);
            });
        });
    }

    function openVideo(url, title, lessonId) {
        console.log("🎬 Opening Video:", title);
        console.log("🔗 URL:", url);

        if (!url || url === 'undefined' || url === 'null') {
            alert("Video này chưa có link hợp lệ!");
            return;
        }

        // --- DETECT LANGUAGE FROM TITLE ---
        const t = title.toLowerCase();
        if (t.includes('tiếng anh')) currentLessonLang = 'en-US';
        else if (t.includes('tiếng hàn')) currentLessonLang = 'ko-KR';
        else if (t.includes('tiếng trung') || t.includes('trung quốc')) currentLessonLang = 'zh-CN';
        else currentLessonLang = 'vi-VN';

        console.log("🗣️ Detected Language:", currentLessonLang);

        // --- RESET QUIZ UI ---
        currentLessonId = lessonId;
        resetQuizUI();

        // Start Tracking Time
        videoStartTime = Date.now();

        modalTitle.innerText = title;

        // Reset Displays
        iframePlayer.style.display = 'none';
        nativePlayer.style.display = 'none';
        iframePlayer.src = '';
        nativePlayer.pause();
        nativePlayer.src = '';

        // --- CHECK LOAI VIDEO ---

        // 1. MP4 direct
        if (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov')) {
            nativePlayer.src = url;
            nativePlayer.style.display = 'block';
            nativePlayer.play().catch(e => console.warn("Autoplay blocked:", e));
        }
        // 2. Google Drive
        else if (url.includes('drive.google.com')) {
            const idMatch = url.match(/\/d\/([-a-zA-Z0-9_]+)/);

            if (idMatch && idMatch[1]) {
                const fileId = idMatch[1];
                const streamUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

                nativePlayer.src = streamUrl;
                nativePlayer.style.display = 'block';
                nativePlayer.load();

                // Fallback Event
                nativePlayer.onerror = () => {
                    nativePlayer.style.display = 'none';
                    nativePlayer.pause();

                    let driveUrl = url;
                    if (url.includes('/view')) driveUrl = url.replace('/view', '/preview');

                    iframePlayer.src = driveUrl;
                    iframePlayer.style.display = 'block';
                };

                nativePlayer.play().catch(e => console.warn("Autoplay blocked:", e));
            } else {
                let driveUrl = url;
                if (url.includes('/view')) driveUrl = url.replace('/view', '/preview');
                iframePlayer.src = driveUrl;
                iframePlayer.style.display = 'block';
            }
        }
        else {
            let embedUrl = url;
            let videoId = '';

            if (url.includes('watch?v=')) {
                videoId = url.split('v=')[1].split('&')[0];
            } else if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1].split('?')[0];
            } else if (url.includes('/embed/')) {
                videoId = url.split('/embed/')[1].split('?')[0];
            }

            if (videoId) {
                // Them origin de tranh loi chan nhung domain
                const origin = window.location.origin;
                embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&origin=${origin}`;
            }

            iframePlayer.src = embedUrl;
            iframePlayer.style.display = 'block';
        }

        modal.classList.add('active');
    }

    async function closeVideo() {
        modal.classList.remove('active');

        // --- SUBMIT TIME IF WATCHED > 3 SECONDS (TEST MODE) ---
        if (videoStartTime) {
            const duration = Math.round((Date.now() - videoStartTime) / 1000);

            // Giam threshold xuong 3 giay de de test
            if (duration > 3) {
                console.log(`⏱️ Da xem video trong ${duration} giay. Dang luu ket qua...`);
                try {
                    const headers = window.getAuthHeaders ? window.getAuthHeaders() : { 'Content-Type': 'application/json' };

                    // Check Login
                    if (!headers['Authorization']) {
                        alert("⚠️ Bạn chưa đăng nhập! Thời gian xem video sẽ không được lưu.");
                        return;
                    }

                    if (!headers['Content-Type']) headers['Content-Type'] = 'application/json';

                    const submitUrl = window.API_CONFIG?.ENDPOINTS?.GAMES?.SUBMIT || 'http://localhost:3000/api/games/submit';
                    const res = await fetch(submitUrl, {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify({
                            game_type: 'learning',
                            score: 10,
                            time_spent: duration,
                            is_passed: true,
                            level_id: 0,
                            stars: 1
                        })
                    });
                } catch (e) {
                    console.error("❌ Stats error", e);
                }
            }
            videoStartTime = null;
        }

        setTimeout(() => {
            iframePlayer.src = '';
            nativePlayer.pause();
            nativePlayer.src = '';
        }, 300);
    }

    // --- QUIZ LOGIC ---
    function resetQuizUI() {
        if (startQuizBtn) startQuizBtn.style.display = 'block';
        if (quizArea) {
            quizArea.classList.remove('active');
            quizArea.style.display = 'none';
        }
    }

    async function startQuiz() {
        if (!currentLessonId) {
            alert('❌ Lỗi: Không tìm thấy ID bài học!');
            return;
        }

        if (nativePlayer) nativePlayer.pause();

        startQuizBtn.style.display = 'none';

        // --- FORCE SHOW PARENT ---
        if (quizArea) {
            quizArea.style.display = 'flex';
            quizArea.classList.add('active');
            quizArea.style.backgroundColor = 'white';
            quizArea.style.color = 'black';
        }

        // --- FORCE SHOW WRAPPER ---
        if (quizWrap) {
            quizWrap.style.display = 'block';
            quizWrap.style.opacity = '1';
            quizWrap.style.width = '100%';
        }

        quizContent.innerHTML = `<div style="text-align:center; color:black; font-size:1.2em; padding:20px;">⏳ Đang tìm câu hỏi cho Bài ID: ${currentLessonId}...</div>`;

        try {
            console.log(`Fetching exercises for lesson ${currentLessonId}`);
            const exUrl = window.API_CONFIG?.ENDPOINTS?.LESSONS?.EXERCISES(currentLessonId) || `http://localhost:3000/api/lessons/${currentLessonId}/exercises`;
            const res = await fetch(exUrl);
            const data = await res.json();
            console.log("Quiz Data:", data);

            if (data.success && data.data && data.data.length > 0) {
                quizQuestions = data.data;
                currentQuestionIndex = 0;
                quizScore = 0;
                selectedAnswer = null;
                renderQuestion();
            } else {
                quizContent.innerHTML = `
                    <div style="text-align:center; color:black; padding:20px;">
                        <h3 style="color:red">⚠️ Chưa có dữ liệu!</h3>
                        <p>Database chưa có câu hỏi mẫu. Vui lòng chạy lệnh <b>seed_exercises.js</b></p>
                        <button onclick="document.getElementById('closeQuizBtn').click()" style="padding:10px 20px; margin-top:15px; cursor:pointer;">Đóng</button>
                    </div>`;
            }
        } catch (e) {
            console.error(e);
            quizContent.innerHTML = `<div style="text-align:center; color:red;">❌ Lỗi kết nối API: ${e.message}</div>`;
        }
    }

    function closeQuiz() {
        if (quizArea) {
            quizArea.classList.remove('active');
            setTimeout(() => { quizArea.style.display = 'none'; }, 300);
        }
        if (startQuizBtn) startQuizBtn.style.display = 'block';
    }

    // --- SPEAK LOGIC ---
    function speakText(text, lang = currentLessonLang) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang; // Use specific language
            utterance.rate = 0.8;
            window.speechSynthesis.speak(utterance);
        }
    }

    function renderQuestion() {
        if (currentQuestionIndex >= quizQuestions.length) {
            showQuizResult();
            return;
        }

        const q = quizQuestions[currentQuestionIndex];
        let options = q.options;
        if (typeof options === 'string') {
            try { options = JSON.parse(options); } catch (e) { options = []; }
        }

        selectedAnswer = null; // Reset selection

        const html = `
            <div class="quiz-question" style="color:black !important; font-size:1.5em; font-weight:bold; margin-bottom:20px;">
                Câu ${currentQuestionIndex + 1}/${quizQuestions.length}: ${q.question_text}
                <div style="font-size:0.6em; font-weight:normal; color:#555; margin-top:5px;">(Bấm vào đáp án để nghe đọc)</div>
            </div>
            <div class="quiz-options">
                ${options.map((opt, idx) => `
                    <button class="quiz-option" id="opt-${idx}" style="color:black; font-size:1.2em; padding:15px;">${opt}</button>
                `).join('')}
            </div>
            <button id="checkAnswerBtn" style="
                margin-top: 25px; 
                padding: 12px 30px; 
                background: #ccc; 
                color: #fff; 
                border: none; 
                border-radius: 25px; 
                font-size: 1.2em; 
                font-weight: bold; 
                cursor: not-allowed;
                transition: 0.3s;
                display: block;
                width: 100%;
                max-width: 200px;
                margin-left: auto; margin-right: auto;
            " disabled>Kiểm tra</button>
        `;
        quizContent.innerHTML = html;

        // AUTO SPEAK QUESTION (Vietnamese)
        setTimeout(() => {
            speakText(q.question_text, 'vi-VN');
        }, 500);

        // Add Listeners
        options.forEach((opt, idx) => {
            const btn = document.getElementById(`opt-${idx}`);
            btn.onclick = () => selectOption(idx, opt, btn);
        });

        document.getElementById('checkAnswerBtn').onclick = () => submitAnswer(q.correct_answer);
    }

    function selectOption(idx, text, btn) {
        // SPEAK ANSWER (English/Korean/etc)
        speakText(text, currentLessonLang);

        selectedAnswer = text;

        quizContent.querySelectorAll('.quiz-option').forEach(b => {
            b.style.background = 'white';
            b.style.borderColor = '#ddd';
            b.style.transform = 'none';
        });

        btn.style.background = '#E3F2FD';
        btn.style.borderColor = '#2196F3';
        btn.style.transform = 'scale(1.02)';

        const checkBtn = document.getElementById('checkAnswerBtn');
        checkBtn.disabled = false;
        checkBtn.style.cursor = 'pointer';
        checkBtn.style.background = '#2196F3';
    }

    function submitAnswer(correct) {
        const checkBtn = document.getElementById('checkAnswerBtn');
        checkBtn.style.display = 'none';

        const isCorrect = (String(selectedAnswer).trim() === String(correct).trim());

        const allBtns = quizContent.querySelectorAll('.quiz-option');
        allBtns.forEach(b => b.onclick = null);

        let selectedBtn = null;
        let correctBtn = null;

        allBtns.forEach(b => {
            if (String(b.innerText).trim() === String(selectedAnswer).trim()) selectedBtn = b;
            if (String(b.innerText).trim() === String(correct).trim()) correctBtn = b;
        });

        if (isCorrect) {
            if (selectedBtn) {
                selectedBtn.style.background = '#d4edda';
                selectedBtn.style.borderColor = '#28a745';
                selectedBtn.innerHTML += ' ✅';
            }
            speakText("Đúng rồi!", 'vi-VN');
            quizScore++;
        } else {
            if (selectedBtn) {
                selectedBtn.style.background = '#f8d7da';
                selectedBtn.style.borderColor = '#dc3545';
            }
            if (correctBtn) {
                correctBtn.style.background = '#d4edda';
                correctBtn.style.borderColor = '#28a745';
            }
            speakText("Sai rồi!", 'vi-VN');
        }

        setTimeout(() => {
            currentQuestionIndex++;
            renderQuestion();
        }, 2000);
    }

    async function showQuizResult() {
        const total = quizQuestions.length;
        const percent = Math.round((quizScore / total) * 100);

        let stars = 0;
        let msg = '';
        let isPassed = false;

        if (percent === 100) {
            msg = 'Xuất sắc! Bạn nhận được 5 Sao! 🌟🌟🌟🌟🌟';
            stars = 5;
            isPassed = true;
        } else if (percent >= 80) {
            msg = 'Giỏi lắm! Bạn nhận được 3 Sao! ⭐⭐⭐';
            stars = 3;
            isPassed = true;
        } else if (percent >= 50) {
            msg = 'Khá tốt! Bạn nhận được 1 Sao! ⭐';
            stars = 1;
            isPassed = true;
        } else {
            msg = 'Hãy cố gắng hơn lần sau nhé! (Cần >50% để đậu)';
            stars = 0;
            isPassed = false;
        }

        // --- SUBMIT SCORE ---
        try {
            if (isPassed) {
                // Import helper dynamically or check global
                const submitFn = window.submitScoreWithAchievements ||
                    (async (data) => {
                        const headers = window.getAuthHeaders ? window.getAuthHeaders() : { 'Content-Type': 'application/json' };
                        const submitUrl = window.API_CONFIG?.ENDPOINTS?.GAMES?.SUBMIT || 'http://localhost:3000/api/games/submit';
                        const res = await fetch(submitUrl, {
                            method: 'POST', headers, body: JSON.stringify(data)
                        });
                        return await res.json();
                    });

                const res = await submitFn({
                    game_type: 'quiz_lesson_' + currentLessonId, // Unique ID per lesson quiz
                    level_id: null, // Learning doesn't use levels in the same way
                    score: percent,
                    stars: stars,
                    time_spent: 0, // Quiz time tracking is optional
                    is_passed: true
                });

                if (res && res.success) {
                    console.log("✅ Quiz Submitted!", res);
                    // Update User UI (Stars)
                    if (window.updateUserStats) window.updateUserStats();
                }
            }
        } catch (e) {
            console.error("❌ Submit Quiz Error:", e);
        }

        quizContent.innerHTML = `
            <div style="text-align: center; padding: 20px; color: black; animation: popIn 0.5s;">
                <div style="font-size: 4em; margin-bottom: 10px;">${percent >= 50 ? '🎉' : '📚'}</div>
                <div class="quiz-score" style="font-size: 1.5em; font-weight: bold; margin: 15px 0;">
                    Kết quả: ${quizScore}/${total} câu đúng
                </div>
                
                ${stars > 0 ? `
                <div style="background: #FFF9C4; color: #FBC02D; padding: 10px; border-radius: 10px; display: inline-block; margin-bottom: 15px; font-weight: bold;">
                    +${stars} Sao ⭐
                </div>
                ` : ''}

                <div style="color: #4CAF50; font-size: 1.2em; font-weight: bold; margin-top: 5px;">${msg}</div>
                
                <button onclick="document.getElementById('closeQuizBtn').click(); if(window.updateUserStats) window.updateUserStats();" 
                    style="margin-top: 25px; padding: 12px 30px; background: #2196F3; color: white; border: none; border-radius: 25px; cursor: pointer; font-size: 1.1em; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
                    Hoàn Thành
                </button>
            </div>
            <style>
                @keyframes popIn {
                    0% { transform: scale(0.8); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            </style>
        `;
    }

    if (startQuizBtn) startQuizBtn.addEventListener('click', startQuiz);
    if (closeQuizBtn) closeQuizBtn.addEventListener('click', closeQuiz);

    closeBtn.addEventListener('click', closeVideo);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeVideo();
    });
}

export function unmount(container) {
    // Cleanup
}
