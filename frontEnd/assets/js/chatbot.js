// Chatbot Logic
(function () {
    // 1. Inject HTML
    const container = document.createElement('div');
    container.id = 'chatbot-container';
    container.innerHTML = `
        <div id="chatbot-window">
            <div class="chat-header">
                <h3><i class="fas fa-robot"></i> Bạn Nhỏ Thông Thái</h3>
                <div style="cursor:pointer" id="chat-close-btn"><i class="fas fa-times"></i></div>
            </div>
            <div class="chat-messages" id="chat-messages">
                <div class="message bot">Chào bé! Mình là người bạn học toán nè. Bé cần giúp gì không?</div>
            </div>
            <div class="typing-indicator" id="typing-indicator">Đang suy nghĩ...</div>
            <div class="chat-input-area">
                <input type="text" id="chat-input" placeholder="Hỏi toán hoặc trò chuyện...">
                <button id="mic-btn"><i class="fas fa-microphone"></i></button>
                <button id="send-btn" class="send-btn"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
        <div id="chatbot-toggle">
            <i class="fas fa-comment-dots"></i>
        </div>
    `;
    document.body.appendChild(container);
    // Chatbot is always visible now

    // 2. Variables
    const toggleBtn = document.getElementById('chatbot-toggle');
    const chatWindow = document.getElementById('chatbot-window');
    const closeBtn = document.getElementById('chat-close-btn');
    const messagesEl = document.getElementById('chat-messages');
    const inputEl = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const micBtn = document.getElementById('mic-btn');
    const typingIndicator = document.getElementById('typing-indicator');

    let isDragging = false;
    let hasMoved = false;
    let initialX, initialY;
    let currentX = 0, currentY = 0;
    let xOffset = 0, yOffset = 0;

    // 3. Drag Logic (Mouse + Touch)
    function dragStart(e) {
        // Only allow dragging from header or toggle button
        if (!e.target.closest('#chatbot-toggle') && !e.target.closest('.chat-header')) return;

        // NOTE: We rely on CSS 'touch-action: none' to prevent scrolling.
        // We do NOT call preventDefault() here so that 'click' events can still fire on touch devices.

        // Normalize touch/mouse
        let clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        let clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

        initialX = clientX - xOffset;
        initialY = clientY - yOffset;

        isDragging = true;
        hasMoved = false;
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault(); // Stop text selection/other defaults

            let clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            let clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

            currentX = clientX - initialX;
            currentY = clientY - initialY;

            // Check if moved significantly (> 5px)
            if (Math.abs(currentX - xOffset) > 5 || Math.abs(currentY - yOffset) > 5) {
                hasMoved = true;
            }

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, container);
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    // Events for Drag
    container.addEventListener('touchstart', dragStart, { passive: false });
    container.addEventListener('touchend', dragEnd, { passive: false });
    container.addEventListener('touchmove', drag, { passive: false });

    container.addEventListener('mousedown', dragStart);
    container.addEventListener('mouseup', dragEnd);
    container.addEventListener('mousemove', drag);

    // 4. Open/Close Logic
    let isOpen = false;

    // Toggle handling
    const handleToggle = (e) => {
        if (hasMoved) {
            hasMoved = false;
            return;
        }
        toggleChat();
    };

    toggleBtn.addEventListener('click', handleToggle);
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent trigger drag
        toggleChat();
    });

    function toggleChat() {
        isOpen = !isOpen;
        if (isOpen) {
            chatWindow.classList.add('open');
            toggleBtn.style.opacity = '0';
            toggleBtn.style.pointerEvents = 'none';
            playGreeting();
        } else {
            chatWindow.classList.remove('open');
            toggleBtn.style.opacity = '1';
            toggleBtn.style.pointerEvents = 'auto';
        }
    }

    // 5. Chat Logic
    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `message ${sender}`;
        div.textContent = text;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    async function handleSend() {
        const text = inputEl.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        inputEl.value = '';
        typingIndicator.classList.add('active');

        try {
            const res = await fetch('/api/chatbot/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            const data = await res.json();
            typingIndicator.classList.remove('active');

            if (data.success) {
                addMessage(data.reply, 'bot');
                // Voice can be different from text
                speak(data.voice || data.reply);
            } else {
                // Show detailed error for debugging
                let errDetail = JSON.stringify(data.error || {});
                addMessage("Lỗi kết nối: " + data.message + ". Chi tiết: " + errDetail, 'bot');
            }
        } catch (e) {
            typingIndicator.classList.remove('active');
            addMessage("Lỗi kết nối rồi bạn ơi! (Check if server is running)", 'bot');
        }
    }

    sendBtn.addEventListener('click', handleSend);
    inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // 6. Text-to-Speech (TTS)
    function speak(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();

            // Strip emojis/icons for voice (Monster Regex)
            const cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
                .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

            console.log("Speaking (No-Emoji):", cleanText);
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.lang = 'vi-VN';
            utterance.rate = 1.1;

            // Try to find a Vietnamese voice
            const voices = window.speechSynthesis.getVoices();
            const viVoice = voices.find(v => v.lang.includes('vi'));
            if (viVoice) utterance.voice = viVoice;

            window.speechSynthesis.speak(utterance);
        }
    }

    function playGreeting() {
        speak("Xin chào! Mình là Bạn Nhỏ Thông Thái. Cùng học toán nhé!");
    }

    // 7. Speech-to-Text (STT)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'vi-VN';
        recognition.continuous = false;
        recognition.interimResults = false;

        // (Listener moved to bottom)

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            inputEl.value = transcript;
            micBtn.classList.remove('recording');
            handleSend();
        };

        recognition.onerror = (event) => {
            micBtn.classList.remove('recording');
            console.error("Mic Error:", event.error);
            if (event.error === 'not-allowed') {
                addMessage("Vui lòng cho phép quyền truy cập Micro để nói chuyện.", 'bot');
            } else if (event.error === 'no-speech') {
                // Do nothing significantly, just stop
            } else {
                addMessage(`Lỗi Micro: ${event.error}`, 'bot');
            }
        };

        recognition.onend = () => {
            micBtn.classList.remove('recording');
        };

        // Fix double click error
        micBtn.addEventListener('click', () => {
            if (micBtn.classList.contains('recording')) {
                recognition.stop();
                return;
            }
            micBtn.classList.add('recording');
            try { recognition.start(); } catch (e) {
                console.error(e);
                micBtn.classList.remove('recording');
            }
        });
    } else {
        micBtn.style.display = 'none'; // Hide if not supported
    }

    // Force load voices (On Chrome sometimes needs this)
    if ('speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
            console.log("Voices loaded");
        };
    }
})();
