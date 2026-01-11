const https = require('https');

exports.chat = async (req, res) => {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ success: false, message: 'Server missing API Key' });
    }

    // System prompt behavior
    const systemPrompt = `
    Bạn là một trợ lý ảo tên là "Bạn Nhỏ Thông Thái" trong ứng dụng học toán cho trẻ em (Hi Math).
    
    Bạn là Chip Chip, một người bạn robot dễ thương của bé 7 tuổi.
    Câu hỏi của bé: "${message}"
    
    Quy tắc trả lời:
    1. Trả lời cực ngắn gọn, giọng điệu vui vẻ, dễ hiểu.
    2. Nếu bé hỏi Tiếng Việt -> Trả lời Tiếng Việt.
    3. CHẶN NỘI DUNG XẤU: Nếu câu hỏi bạo lực/người lớn/chính trị... hãy từ chối khéo: "Ái chà, cái này khó quá, mình nói chuyện khác vui hơn đi!" hoặc "Chip Chip chưa được học cái này ạ."
    4. Với câu hỏi toán/khoa học, chỉ trả lời mức độ lớp 1-2.
    `;

    const requestBody = JSON.stringify({
        contents: [{
            parts: [{ text: systemPrompt }]
        }]
    });

    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        }
    };

    const apiReq = https.request(options, (apiRes) => {
        let chunks = [];

        apiRes.on('data', (chunk) => {
            chunks.push(chunk);
        });

        apiRes.on('end', () => {
            const data = Buffer.concat(chunks).toString();

            if (apiRes.statusCode >= 200 && apiRes.statusCode < 300) {
                try {
                    const parsedData = JSON.parse(data);
                    const reply = parsedData.candidates?.[0]?.content?.parts?.[0]?.text || "Mình chưa nghĩ ra câu trả lời, bạn hỏi lại nhé?";
                    res.json({ success: true, reply });
                } catch (e) {
                    res.status(500).json({ success: false, message: 'Failed to parse AI response' });
                }
            } else {
                // FALLBACK: If AI fails, use local logic
                console.log("AI Error, switching to local:", data);
                const localRep = localReply(message);
                res.json({ success: true, reply: localRep.text, voice: localRep.voice });
            }
        });
    });

    apiReq.on('error', (e) => {
        const localRep = localReply(message);
        res.json({ success: true, reply: localRep.text, voice: localRep.voice });
    });

    apiReq.write(requestBody);
    apiReq.end();
};

function localReply(msg) {
    msg = msg.toLowerCase();
    if (msg.includes('chào') || msg.includes('hi ') || msg === 'hello') return { text: "Chào bạn nhỏ! Cùng học toán vui nhé!", voice: "Chào bạn nhỏ! Cùng học toán vui nhé!" };
    // Only answer "who are you" if specifically asked about the bot
    if (msg.includes('bạn tên gì') || msg.match(/(bạn|mày|cậu)\s+là\s+ai/)) return { text: "Mình là Bạn Nhỏ Thông Thái!", voice: "Mình là Bạn Nhỏ Thông Thái!" };

    // Math Solver (Simple)
    // 5 + 5, 5 cong 5
    const math = msg.match(/(\d+)\s*([\+\-\*\/]|cộng|trừ|nhân|chia)\s*(\d+)/);
    if (math) {
        const a = parseInt(math[1]);
        const b = parseInt(math[3]);
        let op = math[2];
        let res = 0;

        let opWord = '';
        let opSymbol = '';
        if (op === '+' || op === 'cộng') { res = a + b; opWord = 'cộng'; opSymbol = '+'; }
        else if (op === '-' || op === 'trừ') { res = a - b; opWord = 'trừ'; opSymbol = '-'; }
        else if (op === '*' || op === 'nhân') { res = a * b; opWord = 'nhân'; opSymbol = '×'; }
        else if (op === '/' || op === 'chia') { res = (b !== 0) ? (a / b).toFixed(1) : 'vô cực'; opWord = 'chia'; opSymbol = ':'; }

        // Fallback if opWord missed
        if (!opWord) opWord = "trừ"; // Force test if it's minus issue? No, safer:
        if (!opWord) opWord = op;

        const voiceStr = `Phép tính ${a} ${opWord} ${b} ... Kết quả bằng ${res}`;

        return {
            text: `${a} ${opSymbol} ${b} = ${res}`,
            voice: voiceStr
        };
    }
    return { text: "Bé hãy hỏi những câu hỏi toán học thôi nhé!", voice: "Bé hãy hỏi những câu hỏi toán học thôi nhé!" };
}
