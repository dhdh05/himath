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
        padding: 40px 20px;
        max-width: 900px;
        min-height: 100%;
        height: auto;
        margin: 0 auto;
        color: #333;
        font-family: 'Nunito', sans-serif;
        text-align: center;
        background: white;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
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
        max-width: 100%;
        box-sizing: border-box;
      }
      .contact-item {
        margin: 8px 0;
        font-size: 1rem;
        color: #444;
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
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
        align-items: flex-start;
        gap: 48px;
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
        overflow: hidden;
      }
      .member-avatar i { font-size: 32px; color: #2196F3; }
      .member-avatar img { height: 100%; object-fit: cover; display: block; }
      .member-name {
        font-weight: 700;
        font-size: 1.1rem;
        color: #333;
      }
      /* Featured (the new member) — larger, positioned higher */
      .member.featured .member-avatar { width: 180px; height: 180px; margin-top: -18px; background-color: #454545;}
      .member.featured .member-name { font-size: 1.25rem; }
    `;

  container.innerHTML = `
    <div class="about-us-panel">
      <h1 class="about-us-title">ABOUT US</h1>
      
      <div class="team-members">
        <div class="member">
          <div class="member-avatar"><i class="fas fa-user-tie"></i></div>
          <div class="member-name">Đỗ Đức Huy</div>
        </div>

        <div class="member featured">
          <div class="member-avatar"><img src="./assets/images/mr_hqh.jpg" alt="Thầy Hoàng Quang Huy"></div>
          <div class="member-name"><a href="https://www.facebook.com/hqhuy.bk" target="_blank">Thầy Hoàng Quang Huy</a></div>
        </div>

        <div class="member">
          <div class="member-avatar"><i class="fas fa-user-graduate"></i></div>
          <div class="member-name">Phan Công Trung</div>
        </div>
      </div>

      <div class="about-us-content" style="max-width: 800px; text-align: justify;">
        <p>
          Xin chào mọi người! Website này là sản phẩm của bài tập lớn trong học phần <strong>"Kỹ thuật phần mềm ứng dụng"</strong> của chúng tớ.
        </p>
        
        <div style="background: #e3f2fd; padding: 15px; border-radius: 12px; margin: 20px 0; border-left: 5px solid #2196F3;">
            <p style="margin: 0; font-style: italic; color: #0d47a1;">
                "Chúng em xin gửi lời cảm ơn chân thành và sâu sắc nhất đến thầy <strong>Hoàng Quang Huy</strong> – người thầy tâm huyết đã tận tình hướng dẫn, chỉ bảo và đưa ra những lời góp ý xác đáng để chúng em thực hiện dự án này. Sự dẫn dắt của thầy không chỉ giúp chúng em xây dựng được nền tảng cơ bản trong phạm vi môn học, mà còn tạo nên nguồn tư liệu tham khảo hữu ích để các bạn sinh viên khóa sau có thể tiếp cận và phát triển thêm."
            </p>
        </div>

        <p>
          Chúng tớ rất mong sau khi mọi người trải nghiệm sẽ gửi lại phản hồi để chúng tớ có thể hoàn thiện và phát triển sản phẩm tốt hơn nữa. Cảm ơn các bạn rất nhiều! ❤️
        </p>
      </div>

      <div class="contact-info">
        <div style="font-weight: 700; margin-bottom: 15px; text-align: center; text-transform: uppercase; color: #666;">Contact Us</div>
        <div class="contact-item">
          <i class="fas fa-envelope"></i>
          <span><strong>Huy:</strong> <a href="mailto:huy.dd233441@sis.hust.edu.vn" style="color: #444; text-decoration: none; border-bottom: 1px dotted #888; word-break: break-all;">huy.dd233441@sis.hust.edu.vn</a></span>
        </div>
        <div class="contact-item">
          <i class="fas fa-envelope"></i>
          <span><strong>Trung:</strong> <a href="mailto:trung.pc233683@sis.hust.edu.vn" style="color: #444; text-decoration: none; border-bottom: 1px dotted #888; word-break: break-all;">trung.pc233683@sis.hust.edu.vn</a></span>
        </div>
      </div>
    </div>
  `;
}

export function unmount(container) {
  // Cleanup if needed
}
