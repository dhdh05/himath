export function mount(container) {
  if (!container) return;

  // Use a unique style ID for this panel
  let style = document.querySelector('style[data-panel="about-us"]');
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('data-panel', 'about-us');
    document.head.appendChild(style);
  }
  style.textContent = `
      .about-us-panel {
        padding: 20px;
        max-width: 900px;
        height: 100%;
        margin: 0 auto;
        color: #333;
        font-family: 'Nunito', sans-serif;
        text-align: center;
        background: white;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow: hidden; /* Prevent scrolling */
      }
      .about-us-title {
        font-family: 'Lato', 'Arial', sans-serif;
        font-size: 2rem;
        font-weight: 700;
        color: #2575fc;
        margin-bottom: 15px;
        text-transform: uppercase;
        margin-top: 0;
      }
      .about-us-content {
        font-size: 1rem;
        line-height: 1.5;
        color: #555;
        margin-bottom: 20px;
        max-width: 80%;
      }
      .contact-info {
        background: #f8f9fa;
        padding: 15px 30px;
        border-radius: 15px;
        display: inline-block;
        text-align: left;
        border: 2px solid #e9ecef;
      }
      .contact-item {
        margin: 8px 0;
        font-size: 1rem;
        color: #444;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .contact-item a:hover {
        color: #2575fc !important;
        border-bottom-color: #2575fc !important;
      }
      .contact-item i {
        color: #2575fc;
        font-size: 1.1rem;
      }
      .team-members {
        display: flex;
        justify-content: center;
        gap: 60px;
        margin: 20px 0;
      }
      .member {
        text-align: center;
      }
      .member-avatar {
        width: 80px;
        height: 80px;
        background: #e3f2fd;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 10px;
        font-size: 32px;
        color: #2196F3;
      }
      .member-name {
        font-weight: 700;
        font-size: 1.1rem;
        color: #333;
      }
    `;

  container.innerHTML = `
    <div class="about-us-panel">
      <h1 class="about-us-title">Về Chúng Tớ</h1>
      
      <div class="team-members">
        <div class="member">
          <div class="member-avatar"><i class="fas fa-user-tie"></i></div>
          <div class="member-name">Đỗ Đức Huy</div>
        </div>
        <div class="member">
          <div class="member-avatar"><i class="fas fa-user-graduate"></i></div>
          <div class="member-name">Phan Công Trung</div>
        </div>
      </div>

      <p class="about-us-content">
        Xin chào mọi người! Website này là sản phẩm của bài tập lớn trong học phần <strong>"Kỹ thuật phần mềm ứng dụng"</strong> của chúng tớ.
        <br><br>
        Chúng tớ rất mong sau khi mọi người trải nghiệm sẽ gửi lại phản hồi để chúng tớ có thể hoàn thiện và phát triển sản phẩm tốt hơn nữa.
        <br><br>
        Cảm ơn các bạn rất nhiều! ❤️
      </p>

      <div class="contact-info">
        <div style="font-weight: 700; margin-bottom: 15px; text-align: center; text-transform: uppercase; color: #666;">Contact Us</div>
        <div class="contact-item">
          <i class="fas fa-envelope"></i>
          <span><strong>Huy:</strong> <a href="mailto:huy.dd233441@sis.hust.edu.vn" style="color: #444; text-decoration: none; border-bottom: 1px dotted #888;">huy.dd233441@sis.hust.edu.vn</a></span>
        </div>
        <div class="contact-item">
          <i class="fas fa-envelope"></i>
          <span><strong>Trung:</strong> <a href="mailto:trung.pc233683@sis.hust.edu.vn" style="color: #444; text-decoration: none; border-bottom: 1px dotted #888;">trung.pc233683@sis.hust.edu.vn</a></span>
        </div>
      </div>
    </div>
  `;
}

export function unmount(container) {
  // Cleanup if needed
}
