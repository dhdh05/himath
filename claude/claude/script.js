// --- Cấu hình biến toàn cục ---
const canvas = document.getElementById('drawing-board');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const boardContainer = document.getElementById('board-container');
const statusText = document.getElementById('status-text');

let isDrawing = false;
let currentResult = 0;

// Cấu hình nét vẽ - Tối ưu cho Tesseract (nét dày vừa phải)
ctx.strokeStyle = 'white'; 
ctx.lineWidth = 12; // Độ dày tối ưu cho nhận diện
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// 1. Tạo câu hỏi - GIẢM PHẠM VI 0-9
function generateQuestion() {
    clearCanvas();
    boardContainer.classList.remove('correct-glow', 'wrong-glow');
    statusText.innerText = "Hãy viết đáp án lên bảng...";
    statusText.style.color = "#666";

    // THAY ĐỔI: Random từ 0-9 thay vì 0-20
    const num1 = Math.floor(Math.random() * 10);
    const isAddition = Math.random() > 0.5;
    let num2;

    if (isAddition) {
        // Đảm bảo tổng không vượt quá 9
        num2 = Math.floor(Math.random() * (9 - num1 + 1));
        currentResult = num1 + num2;
        document.getElementById('operator').innerText = '+';
    } else {
        // Đảm bảo không bị số âm
        num2 = Math.floor(Math.random() * (num1 + 1));
        currentResult = num1 - num2;
        document.getElementById('operator').innerText = '-';
    }

    document.getElementById('num1').innerText = num1;
    document.getElementById('num2').innerText = num2;
}

// 2. Xử lý vẽ - Hỗ trợ cả touch (mobile)
function startDrawing(e) {
    isDrawing = true;
    const pos = getPosition(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function draw(e) {
    if (!isDrawing) return;
    const pos = getPosition(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

// Mouse events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Touch events
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startDrawing(e);
});
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    draw(e);
});
canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    stopDrawing();
});

// Xóa bảng
function clearCanvas() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ============================================================
// THUẬT TOÁN TIỀN XỬ LÝ ẢNH NÂNG CAO
// ============================================================

function preprocessImage(originalCanvas) {
    const originalCtx = originalCanvas.getContext('2d');
    const width = originalCanvas.width;
    const height = originalCanvas.height;
    
    const imgData = originalCtx.getImageData(0, 0, width, height);
    const data = imgData.data;

    // 1. Tìm Bounding Box với ngưỡng thấp hơn
    let minX = width, minY = height, maxX = 0, maxY = 0;
    let found = false;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            if (data[index] > 30) { // Ngưỡng thấp hơn để bắt được nhiều điểm ảnh hơn
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
                found = true;
            }
        }
    }

    if (!found) return null;

    // 2. Tạo canvas vuông chuẩn hóa 28x28 (chuẩn MNIST - tối ưu cho nhận diện số)
    const cropWidth = maxX - minX + 1;
    const cropHeight = maxY - minY + 1;
    
    // Padding 20% để số không bị sát mép
    const maxDim = Math.max(cropWidth, cropHeight);
    const padding = Math.floor(maxDim * 0.2);
    const finalSize = 28; // Kích thước chuẩn MNIST

    // Canvas tạm để crop
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = maxDim + padding * 2;
    tempCanvas.height = maxDim + padding * 2;
    
    // Nền đen
    tempCtx.fillStyle = 'black';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Vẽ số vào giữa (giữ nguyên màu trắng trên đen)
    const offsetX = (tempCanvas.width - cropWidth) / 2;
    const offsetY = (tempCanvas.height - cropHeight) / 2;
    tempCtx.drawImage(
        originalCanvas, 
        minX, minY, cropWidth, cropHeight,
        offsetX, offsetY, cropWidth, cropHeight
    );

    // 3. Scale về 28x28 và làm nét hơn
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = finalSize;
    finalCanvas.height = finalSize;
    const finalCtx = finalCanvas.getContext('2d');
    
    // Nền trắng (chuẩn Tesseract)
    finalCtx.fillStyle = 'white';
    finalCtx.fillRect(0, 0, finalSize, finalSize);
    
    // Vẽ số với smoothing tắt để giữ nét rõ
    finalCtx.imageSmoothingEnabled = false;
    finalCtx.drawImage(tempCanvas, 0, 0, finalSize, finalSize);

    // 4. Đảo màu và tăng độ tương phản
    const finalData = finalCtx.getImageData(0, 0, finalSize, finalSize);
    const d = finalData.data;
    
    for (let i = 0; i < d.length; i += 4) {
        // Đảo màu: nền đen -> trắng, chữ trắng -> đen
        const brightness = (d[i] + d[i+1] + d[i+2]) / 3;
        
        if (brightness > 80) {
            // Chữ (trắng) -> Đen đậm
            d[i] = 0;
            d[i+1] = 0;
            d[i+2] = 0;
        } else {
            // Nền (đen) -> Trắng tinh
            d[i] = 255;
            d[i+1] = 255;
            d[i+2] = 255;
        }
    }
    
    finalCtx.putImageData(finalData, 0, 0);

    // 5. Scale lên 56x56 để Tesseract đọc dễ hơn
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = 56;
    outputCanvas.height = 56;
    const outputCtx = outputCanvas.getContext('2d');
    
    outputCtx.fillStyle = 'white';
    outputCtx.fillRect(0, 0, 56, 56);
    outputCtx.imageSmoothingEnabled = false;
    outputCtx.drawImage(finalCanvas, 0, 0, 56, 56);

    return outputCanvas.toDataURL('image/png');
}

// 3. Hàm Check kết quả với cấu hình tối ưu
async function checkResult() {
    statusText.innerText = "🔍 Đang nhận diện...";
    statusText.style.color = "blue";
    
    const processedImage = preprocessImage(canvas);

    if (!processedImage) {
        statusText.innerText = "❌ Bạn chưa viết gì cả!";
        statusText.style.color = "orange";
        return;
    }

    // Debug: Hiển thị ảnh đã xử lý (bỏ comment để kiểm tra)
    // const img = new Image();
    // img.src = processedImage;
    // img.style.border = '2px solid red';
    // document.body.appendChild(img);

    try {
        const { data: { text, confidence } } = await Tesseract.recognize(
            processedImage,
            'eng',
            {
                tessedit_char_whitelist: '0123456789',
                tessedit_pageseg_mode: Tesseract.PSM.SINGLE_CHAR,
                // Thêm cấu hình để tăng độ chính xác
                preserve_interword_spaces: '0'
            }
        );

        const recognizedNumber = parseInt(text.trim());
        console.log("✅ AI đọc:", text, "| Độ tin cậy:", confidence.toFixed(2) + "%");

        if (isNaN(recognizedNumber)) {
            statusText.innerText = "⚠️ Chữ viết chưa rõ. Hãy viết to và rõ ràng hơn!";
            statusText.style.color = "orange";
            return;
        }

        if (recognizedNumber === currentResult) {
            boardContainer.classList.remove('wrong-glow');
            boardContainer.classList.add('correct-glow');
            statusText.innerText = `🎉 Chính xác! ${recognizedNumber} là đúng rồi!`;
            statusText.style.color = "green";
            setTimeout(generateQuestion, 1500);
        } else {
            boardContainer.classList.remove('correct-glow');
            boardContainer.classList.add('wrong-glow');
            statusText.innerText = `❌ AI đọc là ${recognizedNumber}. Đáp án đúng là ${currentResult}`;
            statusText.style.color = "red";
        }

    } catch (error) {
        console.error(error);
        statusText.innerText = "⚠️ Lỗi xử lý. Vui lòng thử lại!";
        statusText.style.color = "red";
    }
}

// Khởi tạo
clearCanvas();
generateQuestion();