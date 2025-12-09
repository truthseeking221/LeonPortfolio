import React, { useEffect, useRef, useState } from 'react';
import './diag-guidebook.css';

const faqQuestions = [
  'Xét nghiệm ký sinh trùng là gì?',
  'Xét nghiệm ký sinh trùng bao lâu có kết quả?',
  'Nhiễm ký sinh trùng có nguy hiểm không?',
  'Khi nào nên đi xét nghiệm ký sinh trùng?',
  'Sau điều trị có cần xét nghiệm lại không?',
  'Điều trị ký sinh trùng mất bao lâu?',
  'Làm sao để biết mình đã khỏi hẳn?',
  'Có cần xét nghiệm cả gia đình không?',
  'Chi phí xét nghiệm ký sinh trùng khoảng bao nhiêu?',
  'Đặt lịch xét nghiệm ký sinh trùng tại Diag như thế nào?'
];

const assetPath = (base, filename) => {
  const cleanBase = base ? base.replace(/\/$/, '') : '';
  if (!cleanBase) return `/${filename}`;
  return `${cleanBase}/${filename}`;
};

function DiagGuidebook({ assetBasePath = '/assets' }) {
  const [openIndex, setOpenIndex] = useState(null);
  const rootRef = useRef(null);
  const sectionsRef = useRef([]);
  const triggersRef = useRef([]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const rootNode = rootRef.current;
    if (!rootNode) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const allMascots = rootNode.querySelectorAll('.guidebook__mascot');
            allMascots.forEach((node) => node.classList.remove('mascot--active'));
            const activeMascots = entry.target.querySelectorAll('.guidebook__mascot');
            activeMascots.forEach((node) => node.classList.add('mascot--active'));
          }
        });
      },
      { rootMargin: '-20% 0px -40% 0px', threshold: 0.35 }
    );

    sectionsRef.current.forEach((section) => section && observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const handleKeyDown = (event, index) => {
    const { key } = event;
    const triggers = triggersRef.current.filter(Boolean);
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) {
      event.preventDefault();
    }
    if (key === 'ArrowDown') {
      const next = triggers[index + 1] || triggers[0];
      next?.focus();
    }
    if (key === 'ArrowUp') {
      const prev = triggers[index - 1] || triggers[triggers.length - 1];
      prev?.focus();
    }
    if (key === 'Home') {
      triggers[0]?.focus();
    }
    if (key === 'End') {
      triggers[triggers.length - 1]?.focus();
    }
    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      handleToggle(index);
    }
  };

  return (
    <div className="guidebook" ref={rootRef}>
      <header className="guidebook__masthead">
        <div className="container">
          <div className="guidebook__masthead-inner">
            <a className="guidebook__logo" href="/" aria-label="Diag.vn">
              <span className="guidebook__logo-mark" aria-hidden="true"></span>
              <span className="guidebook__logo-text">Diag</span>
            </a>
            <nav className="guidebook__nav" aria-label="Guidebook navigation">
              <a href="#phan-1">Tổng quan</a>
              <a href="#phan-2">Hiểu đúng</a>
              <a href="#phan-3">Nhận diện</a>
              <a href="#phan-4">Điều trị</a>
              <a href="#phan-5">Phòng ngừa</a>
              <a href="#phan-6">Q&A</a>
            </nav>
            <a className="btn btn--primary btn--compact" href="#cta">
              Đặt lịch xét nghiệm
            </a>
          </div>
        </div>
      </header>

      <main>
        <section
          className="guidebook__hero"
          data-mascot-state="hero"
          ref={(node) => (sectionsRef.current[0] = node)}
        >
          <div className="container guidebook__grid guidebook__grid--hero">
            <div className="guidebook__hero-copy">
              <p className="guidebook__eyebrow">Diag Guidebook</p>
              <h1>GUIDEBOOK VỀ KÝ SINH TRÙNG</h1>
              <div className="guidebook__lede">
                <h3>Bật mí nội dung cẩm nang</h3>
                <p>Doctor DIAG mang đến góc nhìn dễ hiểu và sinh động về ký sinh trùng, và những rủi ro đang hiện hữu quanh bạn và gia đình.</p>
                <p>Cẩm nang cung cấp hướng dẫn xử trí – điều trị được Doctor DIAG tinh gọn để bạn dễ áp dụng và ra quyết định chính xác.</p>
                <p>Ứng dụng thực tế giúp bạn:</p>
                <ol className="guidebook__list guidebook__list--numbered">
                  <li>1. Phân loại các ký sinh trùng</li>
                  <li>2. Nguyên nhân gây bệnh</li>
                  <li>3. Hậu quả và mức độ nguy hiểm</li>
                  <li>4. Cách điều trị</li>
                </ol>
              </div>

              <div className="guidebook__audience">
                <h3>Cẩm nang này dành riêng cho ai?</h3>
                <ol className="guidebook__list guidebook__list--numbered">
                  <li>1. Phụ huynh có con nhỏ</li>
                  <li>2. Người nghi nhiễm bệnh</li>
                  <li>3. Người có nguy cơ cao</li>
                  <li>4. Người chăm sóc</li>
                </ol>
              </div>

              <div className="guidebook__cta">
                <a className="btn btn--primary" href="#cta">
                  Đặt lịch xét nghiệm ký sinh trùng tại Diag
                </a>
                <a className="btn btn--ghost" href="#">
                  Tải cẩm nang PDF
                </a>
              </div>
            </div>
            <div className="guidebook__hero-visual">
              <div className="guidebook__mascot guidebook__mascot--hero" aria-hidden="true">
                <img src={assetPath(assetBasePath, 'mascot-hero.png')} alt="" loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        <section
          id="phan-1"
          className="guidebook__section guidebook__section--accent"
          data-mascot-state="overview"
          ref={(node) => (sectionsRef.current[1] = node)}
        >
          <div className="container">
            <div className="guidebook__section-heading">
              <h2>PHẦN 1: TỔNG QUAN VỀ BỆNH</h2>
              <div className="guidebook__mascot guidebook__mascot--overview" aria-hidden="true">
                <img src={assetPath(assetBasePath, 'mascot-overview.png')} alt="" loading="lazy" />
              </div>
            </div>

            <article className="guidebook__block">
              <h3>CON SỐ THỐNG KÊ</h3>
              <ol className="guidebook__list guidebook__list--numbered guidebook__list--cards">
                <li>1. Ở Việt Nam, tỷ lệ nhiễm ký sinh trùng rất cao.</li>
                <li>
                  2. Số liệu ước tính:
                  <ul className="guidebook__list guidebook__list--bullets">
                    <li>• 65 – 70% dân số bị nhiễm giun sán tại Việt Nam</li>
                    <li>• Trẻ em: 90%</li>
                    <li>• 40 – 50% dân số nhiễm Giardia lamblia</li>
                    <li>• 5 – 7% dân số nhiễm amip</li>
                  </ul>
                </li>
                <li>3. Từ năm 2019 – 2023, có hơn 10.000 ca nhập viện vì bệnh ký sinh trùng mỗi năm.</li>
                <li>4. Độ tuổi 20 – 35 tuổi là nhóm dễ nhiễm nhất.</li>
                <li>5. Phụ nữ mang thai và trẻ nhỏ là nhóm dễ tổn thương nhất khi bị nhiễm ký sinh trùng.</li>
                <li>6. Khu vực miền núi, nông thôn, vùng sâu vùng xa có tỷ lệ nhiễm giun sán cao hơn mức bình quân chung toàn quốc.</li>
                <li>7. Ký sinh trùng còn thích nghi tốt trong môi trường ấm ướt.</li>
              </ol>
            </article>

            <article className="guidebook__block">
              <h3>ĐỐI TƯỢNG NGUY CƠ</h3>
              <div className="guidebook__columns">
                <ul className="guidebook__list guidebook__list--bullets">
                  <li>Người hay ăn uống bên ngoài.</li>
                  <li>Người hay ăn đồ tái sống, hoặc không được nấu chín kỹ.</li>
                  <li>Người có thói quen ăn uống vặt.</li>
                  <li>Người từng bị nhiễm giun đũa, giun kim, giun móc hoặc các loại giun khác.</li>
                  <li>Người bị suy giảm miễn dịch.</li>
                  <li>Người bị bệnh mạn tính như tiểu đường, bệnh gan (viêm gan B hoặc C).</li>
                  <li>Người sống trong môi trường vệ sinh kém.</li>
                  <li>Người hay tiếp xúc với động vật như chó, mèo, gia cầm.</li>
                  <li>Người làm các nghề như:</li>
                  <li>• Bán thịt, cá, hải sản</li>
                  <li>• Làm nghề nông, trồng trọt, chăn nuôi</li>
                  <li>• Làm việc trong môi trường ẩm thấp, vệ sinh kém</li>
                  <li>• Nhân viên vệ sinh, thu gom rác</li>
                  <li>• Nhân viên chăm sóc sức khỏe, bác sĩ, y tá</li>
                  <li>• Người làm việc trong nhà hàng, quán ăn</li>
                  <li>Người đi du lịch thường xuyên đến các vùng có nguy cơ nhiễm ký sinh trùng cao.</li>
                </ul>
              </div>
            </article>

            <article className="guidebook__block guidebook__block--cards">
              <h3>PHÂN LOẠI</h3>
              <div className="guidebook__card-grid">
                <div className="guidebook__card">
                  <p>1. Giun tròn (Nematodes): giun đũa, giun kim, giun móc, giun tóc, giun lươn.</p>
                </div>
                <div className="guidebook__card">
                  <p>2. Giun dẹp (Trematodes): sán lá gan, sán lá phổi, sán lá ruột.</p>
                </div>
                <div className="guidebook__card">
                  <p>3. Sán dây (Cestodes): sán dây bò, sán dây lợn, sán dải chó.</p>
                </div>
                <div className="guidebook__card">
                  <p>4. Đơn bào (Protozoa): amip, Giardia lamblia, Toxoplasma, Cryptosporidium.</p>
                  <p>Mỗi loại ký sinh trùng có đường lây, triệu chứng và mức độ nguy hiểm khác nhau, nhưng nhìn chung đều gây ảnh hưởng nghiêm trọng đến sức khỏe nếu không được phát hiện và điều trị kịp thời.</p>
                </div>
              </div>
            </article>

            <article className="guidebook__block guidebook__block--warning">
              <h3>MỨC ĐỘ NGUY HIỂM</h3>
              <ol className="guidebook__list guidebook__list--numbered">
                <li>1. Suy dinh dưỡng, thiếu máu, chậm phát triển thể chất và trí tuệ ở trẻ em.</li>
                <li>2. Gây tổn thương gan, phổi, não, mắt, tim mạch.</li>
                <li>3. Gây viêm loét đường tiêu hóa, tắc ruột, thủng ruột.</li>
                <li>4. Gây dị ứng, mẩn ngứa, nổi mề đay, tổn thương da.</li>
                <li>5. Gây giảm sức đề kháng, dễ mắc các bệnh nhiễm trùng khác.</li>
                <li>6. Ở phụ nữ mang thai, nhiễm ký sinh trùng có thể gây sảy thai, sinh non, thai chết lưu hoặc dị tật bẩm sinh.</li>
                <li>Nếu không được điều trị đúng cách, bệnh ký sinh trùng có thể kéo dài nhiều năm, làm suy kiệt cơ thể, ảnh hưởng nghiêm trọng đến chất lượng cuộc sống và khả năng lao động.</li>
              </ol>
            </article>

            <article className="guidebook__block guidebook__block--positive">
              <h3>KHẢ NĂNG CHỮA TRỊ</h3>
              <p>Tin vui là: bệnh ký sinh trùng có thể điều trị hiệu quả nếu được phát hiện sớm, chẩn đoán đúng và dùng thuốc phù hợp.</p>
              <p>Tuy nhiên, việc tự ý dùng thuốc tẩy giun hoặc thuốc diệt ký sinh trùng không theo chỉ định của bác sĩ có thể:</p>
              <ol className="guidebook__list guidebook__list--numbered">
                <li>1. Không diệt hết ký sinh trùng, dẫn đến tái nhiễm hoặc kháng thuốc.</li>
                <li>2. Gây tác dụng phụ nguy hiểm cho gan, thận hoặc hệ thần kinh.</li>
                <li>3. Che lấp triệu chứng bệnh, làm chậm trễ việc chẩn đoán và điều trị đúng.</li>
              </ol>
              <p>Vì vậy, khi nghi ngờ bị nhiễm ký sinh trùng, bạn nên đến cơ sở y tế uy tín để được xét nghiệm và tư vấn điều trị đúng cách, an toàn và hiệu quả.</p>
            </article>
          </div>
        </section>

        <section
          id="phan-2"
          className="guidebook__section"
          data-mascot-state="education"
          ref={(node) => (sectionsRef.current[2] = node)}
        >
          <div className="container">
            <div className="guidebook__section-heading">
              <h2>PHẦN 2: HIỂU ĐÚNG VỀ BỆNH</h2>
              <div className="guidebook__mascot guidebook__mascot--education" aria-hidden="true">
                <img src={assetPath(assetBasePath, 'mascot-education.png')} alt="" loading="lazy" />
              </div>
            </div>

            <article className="guidebook__block">
              <h3>NGUYÊN NHÂN GÂY BỆNH</h3>
              <ol className="guidebook__list guidebook__list--numbered">
                <li>1. Ăn uống không hợp vệ sinh: thực phẩm nhiễm trứng, ấu trùng hoặc nang ký sinh trùng (rau sống, gỏi cá, gỏi bò, tiết canh, thịt tái, hải sản sống…).</li>
                <li>2. Uống nước không đảm bảo: nước chưa đun sôi, nước giếng, nước ao hồ, suối, sông, nước bị ô nhiễm.</li>
                <li>3. Vệ sinh cá nhân kém: không rửa tay trước khi ăn và sau khi đi vệ sinh, cắn móng tay, mút tay, để trẻ bò chơi dưới đất bẩn.</li>
                <li>4. Tiếp xúc với đất, cát, bùn có chứa trứng hoặc ấu trùng ký sinh trùng (đi chân đất, làm vườn, chơi cát…).</li>
                <li>5. Tiếp xúc với động vật nuôi hoặc động vật hoang dã mang ký sinh trùng (chó, mèo, lợn, bò, gà, vịt, chim…).</li>
                <li>6. Dùng chung đồ dùng cá nhân với người bị nhiễm ký sinh trùng (khăn tắm, chăn, gối…).</li>
                <li>7. Truyền từ mẹ sang con (một số loại ký sinh trùng có thể lây qua nhau thai hoặc trong quá trình sinh nở).</li>
              </ol>
            </article>

            <article className="guidebook__block guidebook__block--timeline">
              <h3>QUÁ TRÌNH GÂY BỆNH</h3>
              <ol className="guidebook__list guidebook__list--numbered">
                <li>1. Trứng hoặc ấu trùng ký sinh trùng xâm nhập vào cơ thể qua đường tiêu hóa, da hoặc niêm mạc.</li>
                <li>2. Di chuyển đến các cơ quan khác nhau như ruột, gan, phổi, tim, mắt, não…</li>
                <li>3. Phát triển thành thể trưởng thành, sinh sản và tiếp tục chu kỳ sống trong cơ thể người.</li>
                <li>4. Trong quá trình đó, chúng:</li>
              </ol>
              <ul className="guidebook__list guidebook__list--bullets">
                <li>• Hút chất dinh dưỡng của cơ thể</li>
                <li>• Tiết ra các chất độc</li>
                <li>• Gây tổn thương cơ quan</li>
                <li>• Kích thích phản ứng miễn dịch gây viêm, dị ứng</li>
              </ul>
              <ol className="guidebook__list guidebook__list--numbered">
                <li>5. Nếu không được điều trị, ký sinh trùng có thể tồn tại lâu dài trong cơ thể, gây bệnh mạn tính và nhiều biến chứng nguy hiểm.</li>
              </ol>
            </article>

            <article className="guidebook__block guidebook__block--mythfact">
              <h3>NHỮNG HIỂU LẦM VỀ BỆNH</h3>
              <div className="guidebook__mythfact-grid">
                <div className="guidebook__myth">
                  <p>Hiểu lầm 1: “Chỉ trẻ em mới bị nhiễm giun sán.”</p>
                  <p>Hiểu lầm 2: “Tẩy giun 6 tháng/lần là đủ, không cần xét nghiệm.”</p>
                  <p>Hiểu lầm 3: “Không có triệu chứng thì chắc chắn không bị nhiễm.”</p>
                  <p>Hiểu lầm 4: “Chỉ cần uống thuốc theo quảng cáo là khỏi.”</p>
                </div>
                <div className="guidebook__fact">
                  <p>Sự thật: Người lớn cũng có nguy cơ nhiễm rất cao, đặc biệt là người hay ăn uống bên ngoài, ăn đồ tái sống, hoặc làm việc trong môi trường dễ phơi nhiễm.</p>
                  <p>Sự thật: Không phải loại ký sinh trùng nào cũng được diệt bởi các thuốc tẩy giun thông thường. Một số loại đơn bào, sán lá, sán dây… cần thuốc đặc trị và phác đồ riêng, phải dựa trên kết quả xét nghiệm.</p>
                  <p>Sự thật: Nhiều trường hợp nhiễm ký sinh trùng không có triệu chứng rõ ràng trong thời gian dài, hoặc triệu chứng mơ hồ dễ nhầm với bệnh khác (mệt mỏi, đau đầu, rối loạn tiêu hóa nhẹ…).</p>
                  <p>Sự thật: Tự ý dùng thuốc có thể nguy hiểm, gây kháng thuốc, tổn thương gan, thận mà vẫn không diệt được ký sinh trùng.</p>
                </div>
              </div>
            </article>

            <article className="guidebook__block guidebook__block--checklist">
              <h3>DẤU HIỆU NHIỄM KÝ SINH TRÙNG</h3>
              <p>Các dấu hiệu có thể gặp:</p>
              <div className="guidebook__checklist-grid">
                <div>
                  <p>1. Triệu chứng tiêu hóa:</p>
                  <ul className="guidebook__list guidebook__list--bullets">
                    <li>• Đau bụng âm ỉ hoặc từng cơn</li>
                    <li>• Đầy hơi, chướng bụng</li>
                    <li>• Buồn nôn, nôn</li>
                    <li>• Rối loạn tiêu hóa: tiêu chảy, táo bón, phân lỏng, phân nát</li>
                    <li>• Ngứa vùng hậu môn (đặc biệt về đêm, nghi ngờ giun kim)</li>
                  </ul>
                </div>
                <div>
                  <p>2. Triệu chứng toàn thân:</p>
                  <ul className="guidebook__list guidebook__list--bullets">
                    <li>• Mệt mỏi, uể oải, thiếu năng lượng</li>
                    <li>• Sụt cân, ăn không ngon</li>
                    <li>• Thiếu máu, chóng mặt, hoa mắt</li>
                    <li>• Sốt nhẹ kéo dài, nhất là về chiều</li>
                  </ul>
                </div>
                <div>
                  <p>3. Triệu chứng trên da:</p>
                  <ul className="guidebook__list guidebook__list--bullets">
                    <li>• Nổi mề đay, mẩn ngứa</li>
                    <li>• Nổi ban đỏ, sẩn phù</li>
                    <li>• Tổn thương da dạng đường hầm (ấu trùng di chuyển dưới da)</li>
                  </ul>
                </div>
                <div>
                  <p>4. Triệu chứng ở cơ quan khác (tùy loại ký sinh trùng):</p>
                  <ul className="guidebook__list guidebook__list--bullets">
                    <li>• Ho kéo dài, khó thở (khi ký sinh trùng ở phổi)</li>
                    <li>• Đau đầu, co giật, rối loạn ý thức (khi ký sinh trùng ở não)</li>
                    <li>• Mờ mắt, giảm thị lực (khi ký sinh trùng ở mắt)</li>
                    <li>• Đau cơ, đau khớp không rõ nguyên nhân</li>
                  </ul>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section
          id="phan-3"
          className="guidebook__section"
          data-mascot-state="diagnosis"
          ref={(node) => (sectionsRef.current[3] = node)}
        >
          <div className="container">
            <div className="guidebook__section-heading">
              <h2>PHẦN 3: NHẬN DIỆN BỆNH</h2>
              <div className="guidebook__mascot guidebook__mascot--diagnosis" aria-hidden="true">
                <img src={assetPath(assetBasePath, 'mascot-diagnosis.png')} alt="" loading="lazy" />
              </div>
            </div>

            <article className="guidebook__block guidebook__block--table">
              <h3>CÁCH PHÂN BIỆT VỚI RỐI LOẠN TIÊU HÓA</h3>
              <div className="guidebook__compare">
                <div>
                  <p>1. Rối loạn tiêu hóa thông thường (do ăn uống không hợp lý, stress, hội chứng ruột kích thích…) thường:</p>
                  <ul className="guidebook__list guidebook__list--bullets">
                    <li>• Triệu chứng xuất hiện sau ăn, thay đổi vị trí, không kéo dài quá lâu.</li>
                    <li>• Ít khi kèm theo triệu chứng toàn thân như sốt, mệt mỏi kéo dài, sụt cân, thiếu máu.</li>
                  </ul>
                </div>
                <div>
                  <p>2. Nhiễm ký sinh trùng:</p>
                  <ul className="guidebook__list guidebook__list--bullets">
                    <li>• Có thể kèm theo các dấu hiệu toàn thân: mệt mỏi, thiếu máu, gầy sút, da xanh xao.</li>
                    <li>• Có thể có các triệu chứng ngoài đường tiêu hóa: ngứa da, nổi mề đay, ho kéo dài, đau ngực, đau cơ khớp…</li>
                    <li>• Tiền sử ăn uống, sinh hoạt, nghề nghiệp có yếu tố nguy cơ (ăn đồ tái sống, sống trong môi trường vệ sinh kém, tiếp xúc động vật…).</li>
                  </ul>
                </div>
              </div>
            </article>

            <article className="guidebook__block guidebook__block--steps">
              <h3>CÁCH XÉT NGHIỆM</h3>
              <ol className="guidebook__list guidebook__list--numbered guidebook__list--cards">
                <li>1. Xét nghiệm phân tìm trứng, ấu trùng, nang ký sinh trùng.</li>
                <li>2. Xét nghiệm máu:</li>
              </ol>
              <ul className="guidebook__list guidebook__list--bullets">
                <li>• Công thức máu (bạch cầu ái toan tăng gợi ý nhiễm ký sinh trùng).</li>
                <li>• Huyết thanh chẩn đoán (ELISA, Western blot…) tìm kháng thể hoặc kháng nguyên ký sinh trùng.</li>
              </ul>
              <ol className="guidebook__list guidebook__list--numbered guidebook__list--cards">
                <li>3. Xét nghiệm dịch cơ quan (dịch não tủy, dịch màng phổi, dịch ổ bụng…) nếu nghi ngờ ký sinh trùng ở các vị trí này.</li>
                <li>4. Chẩn đoán hình ảnh (siêu âm, CT, MRI) hỗ trợ phát hiện tổn thương do ký sinh trùng gây ra (nang, ổ viêm, tổn thương gan, não, phổi…).</li>
              </ol>
            </article>

            <article className="guidebook__block guidebook__block--cards">
              <h3>CÁCH ĐỌC KẾT QUẢ XÉT NGHIỆM</h3>
              <div className="guidebook__card-grid guidebook__card-grid--three">
                <div className="guidebook__card">
                  <p>1. Kết quả âm tính:</p>
                  <ul className="guidebook__list guidebook__list--bullets">
                    <li>• Không phát hiện trứng, ấu trùng, nang ký sinh trùng trong mẫu xét nghiệm.</li>
                    <li>• Kháng thể/kháng nguyên ở mức không gợi ý nhiễm hiện tại.</li>
                    <li>• Tuy nhiên, nếu vẫn có triệu chứng nghi ngờ, bác sĩ có thể chỉ định lặp lại xét nghiệm hoặc làm thêm xét nghiệm khác.</li>
                  </ul>
                </div>
                <div className="guidebook__card">
                  <p>2. Kết quả dương tính:</p>
                  <ul className="guidebook__list guidebook__list--bullets">
                    <li>• Phát hiện trực tiếp ký sinh trùng hoặc các dấu ấn cho thấy đang hoặc đã nhiễm.</li>
                    <li>• Cần được bác sĩ chuyên khoa tư vấn phác đồ điều trị phù hợp (loại thuốc, liều, thời gian…).</li>
                  </ul>
                </div>
                <div className="guidebook__card">
                  <p>3. Kết quả cần theo dõi:</p>
                  <ul className="guidebook__list guidebook__list--bullets">
                    <li>• Một số xét nghiệm có thể cho kết quả “nghi ngờ” hoặc “không điển hình”.</li>
                    <li>• Bác sĩ có thể hẹn tái khám, làm thêm các xét nghiệm bổ sung.</li>
                  </ul>
                </div>
              </div>
            </article>

            <div className="guidebook__inline-cta">
              <div>
                <h4>Đặt lịch xét nghiệm tại Diag</h4>
                <p>Đặt lịch nhanh, kết quả chính xác, tư vấn trực tiếp cùng bác sĩ chuyên khoa.</p>
              </div>
              <a className="btn btn--primary" href="#cta">
                Đặt lịch ngay
              </a>
            </div>
          </div>
        </section>

        <section
          id="phan-4"
          className="guidebook__section"
          data-mascot-state="treatment"
          ref={(node) => (sectionsRef.current[4] = node)}
        >
          <div className="container">
            <div className="guidebook__section-heading">
              <h2>PHẦN 4: KIẾN THỨC VỀ ĐIỀU TRỊ</h2>
              <div className="guidebook__mascot guidebook__mascot--treatment" aria-hidden="true">
                <img src={assetPath(assetBasePath, 'mascot-treatment.png')} alt="" loading="lazy" />
              </div>
            </div>

            <article className="guidebook__block">
              <h3>CÁCH ĐIỀU TRỊ</h3>
              <ol className="guidebook__list guidebook__list--numbered">
                <li>1. Điều trị bằng thuốc đặc hiệu:</li>
              </ol>
              <ul className="guidebook__list guidebook__list--bullets">
                <li>• Bác sĩ sẽ kê các loại thuốc diệt giun, sán, đơn bào… tùy từng loại ký sinh trùng.</li>
                <li>• Tuân thủ đúng liều lượng, thời gian, không tự ý ngưng thuốc dù triệu chứng đã giảm.</li>
              </ul>
              <ol className="guidebook__list guidebook__list--numbered">
                <li>2. Điều trị hỗ trợ:</li>
              </ol>
              <ul className="guidebook__list guidebook__list--bullets">
                <li>• Bổ sung dinh dưỡng, vitamin, khoáng chất.</li>
                <li>• Điều chỉnh chế độ ăn uống, nghỉ ngơi hợp lý.</li>
                <li>• Điều trị các biến chứng nếu có (thiếu máu, suy dinh dưỡng, tổn thương gan, phổi…).</li>
              </ul>
              <ol className="guidebook__list guidebook__list--numbered">
                <li>3. Theo dõi sau điều trị:</li>
              </ol>
              <ul className="guidebook__list guidebook__list--bullets">
                <li>• Tái khám theo lịch hẹn.</li>
                <li>• Làm lại xét nghiệm nếu cần để đánh giá hiệu quả điều trị.</li>
                <li>• Thực hiện các biện pháp phòng ngừa tái nhiễm.</li>
              </ul>
            </article>

            <article className="guidebook__block">
              <h3>CÁC LOẠI THUỐC THƯỜNG DÙNG</h3>
              <p>(Tuân thủ chỉ định của bác sĩ, không tự ý dùng thuốc.)</p>
              <ol className="guidebook__list guidebook__list--numbered">
                <li>1. Thuốc điều trị giun tròn.</li>
                <li>2. Thuốc điều trị sán dây, sán lá.</li>
                <li>3. Thuốc điều trị đơn bào (amip, Giardia…).</li>
                <li>4. Thuốc hỗ trợ triệu chứng (giảm đau, chống dị ứng, hỗ trợ tiêu hóa…).</li>
              </ol>
            </article>

            <article className="guidebook__block guidebook__block--warning">
              <h3>LƯU Ý KHI ĐIỀU TRỊ</h3>
              <ol className="guidebook__list guidebook__list--numbered">
                <li>1. Không tự ý mua thuốc tẩy giun, thuốc diệt ký sinh trùng dùng kéo dài nhiều ngày mà không có chỉ định.</li>
                <li>2. Không dùng thuốc quá liều.</li>
                <li>3. Báo ngay cho bác sĩ nếu có các dấu hiệu bất thường sau khi dùng thuốc (nổi mẩn ngứa, khó thở, đau bụng dữ dội, vàng da, mệt lả…).</li>
                <li>4. Phụ nữ mang thai, trẻ em, người có bệnh gan, thận, tim mạch cần được bác sĩ cân nhắc kỹ trước khi điều trị.</li>
              </ol>
            </article>
          </div>
        </section>

        <section
          id="phan-4b"
          className="guidebook__section guidebook__section--split"
          data-mascot-state="care"
          ref={(node) => (sectionsRef.current[5] = node)}
        >
          <div className="container">
            <div className="guidebook__section-heading">
              <h2>PHẦN 4: DINH DƯỠNG VÀ CHĂM SÓC TẠI NHÀ</h2>
              <div className="guidebook__mascot guidebook__mascot--care" aria-hidden="true">
                <img src={assetPath(assetBasePath, 'mascot-care.png')} alt="" loading="lazy" />
              </div>
            </div>
            <div className="guidebook__split">
              <article className="guidebook__block">
                <h3>CHẾ ĐỘ DINH DƯỠNG</h3>
                <ol className="guidebook__list guidebook__list--numbered">
                  <li>1. Ăn chín uống sôi, tuyệt đối không ăn đồ tái sống, gỏi, tiết canh, hải sản sống.</li>
                  <li>2. Rửa sạch rau củ, ngâm nước muối hoặc dung dịch rửa rau trước khi chế biến.</li>
                  <li>3. Hạn chế ăn ngoài hàng quán không đảm bảo vệ sinh.</li>
                  <li>4. Uống đủ nước sạch mỗi ngày.</li>
                  <li>5. Tăng cường thực phẩm giàu dinh dưỡng: thịt, cá, trứng, sữa, rau xanh, trái cây.</li>
                  <li>6. Hạn chế đường, đồ uống có gas, thức ăn nhanh, đồ chiên rán nhiều dầu mỡ.</li>
                </ol>
              </article>
              <article className="guidebook__block">
                <h3>CHĂM SÓC TẠI NHÀ</h3>
                <ol className="guidebook__list guidebook__list--numbered">
                  <li>1. Giữ vệ sinh cá nhân:</li>
                </ol>
                <ul className="guidebook__list guidebook__list--bullets">
                  <li>• Rửa tay bằng xà phòng trước khi ăn và sau khi đi vệ sinh.</li>
                  <li>• Cắt móng tay ngắn, không cắn móng tay.</li>
                </ul>
                <ol className="guidebook__list guidebook__list--numbered">
                  <li>2. Giữ vệ sinh môi trường sống:</li>
                </ol>
                <ul className="guidebook__list guidebook__list--bullets">
                  <li>• Dọn dẹp nhà cửa sạch sẽ, khô ráo.</li>
                  <li>• Xử lý phân, rác thải đúng cách.</li>
                </ul>
                <ol className="guidebook__list guidebook__list--numbered">
                  <li>3. Quản lý vật nuôi:</li>
                </ol>
                <ul className="guidebook__list guidebook__list--bullets">
                  <li>• Tẩy giun định kỳ cho chó, mèo theo khuyến cáo.</li>
                  <li>• Không để vật nuôi phóng uế bừa bãi.</li>
                </ul>
                <ol className="guidebook__list guidebook__list--numbered">
                  <li>4. Theo dõi sức khỏe:</li>
                </ol>
                <ul className="guidebook__list guidebook__list--bullets">
                  <li>• Quan sát các dấu hiệu bất thường ở bản thân và người thân.</li>
                  <li>• Chủ động đi khám nếu nghi ngờ nhiễm ký sinh trùng.</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section
          id="phan-5"
          className="guidebook__section"
          data-mascot-state="prevention"
          ref={(node) => (sectionsRef.current[6] = node)}
        >
          <div className="container">
            <div className="guidebook__section-heading">
              <h2>PHẦN 5: PHÒNG NGỪA TÁI NHIỄM</h2>
              <div className="guidebook__mascot guidebook__mascot--prevention" aria-hidden="true">
                <img src={assetPath(assetBasePath, 'mascot-prevention.png')} alt="" loading="lazy" />
              </div>
            </div>
            <article className="guidebook__block">
              <h3>CÁC PHÒNG NGỪA TÁI NHIỄM</h3>
              <ol className="guidebook__list guidebook__list--numbered">
                <li>1. Duy trì thói quen vệ sinh tốt lâu dài.</li>
                <li>2. Không ăn đồ tái sống, tiết canh, gỏi, hải sản sống.</li>
                <li>3. Đảm bảo nguồn nước sinh hoạt sạch.</li>
                <li>4. Tẩy giun định kỳ theo khuyến cáo.</li>
                <li>5. Kiểm tra sức khỏe định kỳ nếu thuộc nhóm nguy cơ cao.</li>
              </ol>
            </article>
            <article className="guidebook__block guidebook__block--timeline">
              <h3>TẨY GIUN ĐỊNH KỲ</h3>
              <ol className="guidebook__list guidebook__list--numbered">
                <li>1. Trẻ em: thường 6 tháng – 1 năm/lần, theo khuyến cáo của bác sĩ.</li>
                <li>2. Người lớn: tùy theo nguy cơ phơi nhiễm, có thể 1 năm/lần hoặc theo tư vấn chuyên môn.</li>
                <li>3. Không lạm dụng thuốc tẩy giun; luôn hỏi ý kiến bác sĩ nếu có bệnh nền hoặc đang dùng thuốc khác.</li>
              </ol>
            </article>
          </div>
        </section>

        <section
          id="phan-6"
          className="guidebook__section guidebook__section--faq"
          data-mascot-state="faq"
          ref={(node) => (sectionsRef.current[7] = node)}
        >
          <div className="container">
            <div className="guidebook__section-heading">
              <h2>PHẦN 6: Q&A</h2>
              <div className="guidebook__mascot guidebook__mascot--faq" aria-hidden="true">
                <img src={assetPath(assetBasePath, 'mascot-faq.png')} alt="" loading="lazy" />
              </div>
            </div>

            <div className="guidebook__faq" role="tablist" aria-label="Các câu hỏi thường gặp">
              <article className="guidebook__block">
                <h3>Các câu hỏi thường gặp:</h3>
                <div className="guidebook__accordion">
                  {faqQuestions.map((question, index) => {
                    const isOpen = openIndex === index;
                    const buttonId = `faq-tab-${index}`;
                    const panelId = `faq-panel-${index}`;
                    return (
                      <div className="guidebook__accordion-item" key={question}>
                        <button
                          id={buttonId}
                          className="guidebook__accordion-trigger"
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => handleToggle(index)}
                          onKeyDown={(event) => handleKeyDown(event, index)}
                          ref={(node) => {
                            triggersRef.current[index] = node;
                          }}
                        >
                          {question}
                          <span className="guidebook__accordion-icon" aria-hidden="true"></span>
                        </button>
                        <div
                          id={panelId}
                          className="guidebook__accordion-panel"
                          role="region"
                          aria-labelledby={buttonId}
                          hidden={!isOpen}
                        >
                          <p>Nội dung câu trả lời sẽ được cập nhật bởi đội marketing.</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            </div>
          </div>
        </section>

        <section
          id="cta"
          className="guidebook__section guidebook__section--cta"
          data-mascot-state="cta"
          ref={(node) => (sectionsRef.current[8] = node)}
        >
          <div className="container guidebook__cta-band">
            <div>
              <h2>Nghi ngờ nhiễm ký sinh trùng? Hãy xét nghiệm sớm tại Diag.</h2>
              <p>Đội ngũ chuyên môn Diag hỗ trợ trọn hành trình từ xét nghiệm đến tư vấn điều trị.</p>
              <div className="guidebook__cta">
                <a className="btn btn--primary" href="#">
                  Đặt lịch ngay
                </a>
                <a className="btn btn--ghost" href="#">
                  Nhận tư vấn
                </a>
              </div>
            </div>
            <div className="guidebook__mascot guidebook__mascot--cta" aria-hidden="true">
              <img src={assetPath(assetBasePath, 'mascot-cta.png')} alt="" loading="lazy" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DiagGuidebook;
