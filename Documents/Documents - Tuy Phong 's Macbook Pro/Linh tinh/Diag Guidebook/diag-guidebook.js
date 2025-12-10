import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// Version: 9.3.0 (Added Smart Navigation)

const faqList = [
  { q: "Xét nghiệm ký sinh trùng ở đâu?", a: "Liên hệ Diag để được tư vấn các chi nhánh gần nhất và đặt lịch xét nghiệm." },
  { q: "Xét nghiệm ký sinh trùng bao nhiêu tiền?", a: "Chi phí dao động tùy theo số lượng loại ký sinh trùng cần tầm soát. Liên hệ Diag để có giá chính xác." },
  { q: "Xét nghiệm ký sinh trùng bao lâu có kết quả?", a: "Tùy loại xét nghiệm, thường từ vài giờ đến 1-2 ngày." },
  { q: "Xét nghiệm ký sinh trùng có cần nhịn ăn không?", a: "Một số xét nghiệm máu có thể yêu cầu nhịn ăn. Bác sĩ sẽ tư vấn cụ thể." },
  { q: "Xét nghiệm ký sinh trùng cần chuẩn bị gì?", a: "Nên thông báo về các triệu chứng, tiền sử bệnh lý và thuốc đang dùng. Tuỳ loại xét nghiệm sẽ có hướng dẫn cụ thể." },
  { q: "Uống thuốc tẩy giun có tác dụng phụ gì?", a: "Có thể gặp buồn nôn, đau bụng nhẹ, chóng mặt. Hiếm gặp hơn là dị ứng, phát ban. Cần đọc kỹ hướng dẫn hoặc hỏi bác sĩ." },
  { q: "Bao lâu thì thuốc tẩy giun phát huy tác dụng?", a: "Thuốc thường bắt đầu tác dụng trong vài giờ đến vài ngày. Hiệu quả diệt ký sinh trùng hoàn toàn cần vài ngày đến vài tuần." },
  { q: "Uống thuốc tẩy giun quá liều có sao không?", a: "Uống quá liều có thể gây ngộ độc gan, thận, rối loạn thần kinh. Cần tuân thủ đúng liều lượng bác sĩ chỉ định." }
];

const SECTIONS = [
  { id: 'hero', title: 'Đầu trang', icon: '🏠' },
  { id: 'phan-1', title: 'Tổng Quan', icon: '📊' },
  { id: 'phan-2', title: 'Hiểu Đúng', icon: '💡' },
  { id: 'phan-3', title: 'Nhận Diện', icon: '👀' },
  { id: 'phan-4', title: 'Điều Trị', icon: '💊' },
  { id: 'phan-5', title: 'Phòng Ngừa', icon: '🛡️' },
  { id: 'phan-6', title: 'Hỏi Đáp', icon: '❓' },
];

function Navigation() {
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-20% 0px -50% 0px" } // Trigger when section is near center/top
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Rail */}
      <div className="nav-rail">
        {SECTIONS.map((section) => (
          <div
            key={section.id}
            className={`nav-node ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => handleScrollTo(section.id)}
          >
            <div className="nav-tooltip">{section.title}</div>
          </div>
        ))}
      </div>

      {/* Mobile Wrapper */}
      <div className="nav-mobile-wrapper">
        <div className={`nav-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>
        
        <div className={`nav-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
           {SECTIONS.map((section) => (
             <div 
                key={section.id} 
                className={`nav-mobile-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => handleScrollTo(section.id)}
             >
                <span>{section.title}</span>
                <span>{section.icon}</span>
             </div>
           ))}
        </div>

        <div className="nav-fab" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
           {mobileMenuOpen ? '✕' : '☰'}
        </div>
      </div>
    </>
  );
}

function App() {
  const [activeFaq, setActiveFaq] = useState(null);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <Navigation />
      
      {/* --- HERO SECTION --- */}
      <section id="hero" className="hero-section">
        <div className="container">
          <div className="hero-box">
            <div style={{background: '#0766F7', color:'#fff', display:'inline-block', padding:'6px 16px', borderRadius:'30px', fontWeight:'bold', marginBottom:'15px', fontSize: '0.9rem', letterSpacing:'1px'}}>DOCTOR DIAG</div>
            <h1 className="hero-title">CẨM NANG<br/>KÝ SINH TRÙNG</h1>
            <p className="hero-subtitle">
              Bật mí nội dung cẩm nang Doctor DIAG mang đến góc nhìn dễ hiểu và sinh động về ký sinh trùng, và những rủi ro đang hiện hữu quanh bạn và gia đình.
            </p>
            
            {/* Audience */}
            <div style={{marginTop:'40px', textAlign:'center'}}>
               <h4 style={{marginBottom: '20px', color:'#0284c7', fontSize:'1.1rem'}}>CẨM NANG NÀY DÀNH RIÊNG CHO AI?</h4>
               <div className="audience-grid">
                  <div className="audience-badge">
                      <span className="audience-icon">👨‍👩‍👧</span>
                      <span className="audience-label">Phụ huynh<br/>có con nhỏ</span>
                  </div>
                  <div className="audience-badge">
                      <span className="audience-icon">🤒</span>
                      <span className="audience-label">Người nghi<br/>nhiễm bệnh</span>
                  </div>
                  <div className="audience-badge">
                      <span className="audience-icon">⚠️</span>
                      <span className="audience-label">Người có<br/>nguy cơ cao</span>
                  </div>
                   <div className="audience-badge">
                      <span className="audience-icon">🏥</span>
                      <span className="audience-label">Người<br/>chăm sóc</span>
                  </div>
               </div>
            </div>
            
            <button onClick={() => scrollToSection('phan-1')} className="btn-cta" style={{marginTop: '30px'}}>
              BẮT ĐẦU TÌM HIỂU
            </button>
          </div>
        </div>
      </section>

      {/* --- SPINE START --- */}
      <div className="container relative">
        <div className="story-spine"></div>
        
        {/* ================= PHẦN 1: TỔNG QUAN ================= */}
        <div id="phan-1" className="section-header">
            <span className="section-number">PHẦN 1</span>
            <h2 className="section-title">TỔNG QUAN<br/>VỀ BỆNH</h2>
        </div>

        {/* Stats */}
        <div className="infographic-row">
          <div style={{flex:1, textAlign:'center'}}>
            <div className="visual-big">1.5<small> TỶ</small></div>
            <p style={{fontSize:'1.25rem', fontWeight:'bold', color: '#64748b'}}>người nhiễm ký sinh trùng<br/>trên toàn thế giới</p>
          </div>
          <div className="card-comic" style={{flex:1.5}}>
            <h3 style={{marginBottom:'20px', color: '#0766F7'}}>CON SỐ THỐNG KÊ</h3>
            <ul style={{fontSize: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
               <li><strong style={{color: 'var(--primary-brand)', fontSize: '1.1rem'}}>~20 nghìn</strong> người nhiễm giun chó mèo/năm VN.</li>
               <li><strong style={{color: 'var(--primary-brand)', fontSize: '1.1rem'}}>42%</strong> trẻ em 2-5 tuổi nhiễm giun sán.</li>
               <li style={{gridColumn: '1 / span 2', borderTop:'1px dashed #cbd5e1', paddingTop:'10px'}}>
                   <div className="fact-box"><strong>Fact:</strong> Khoảng 70 - 80% chúng ta nhiễm ít nhất một loại giun nào đó.</div>
               </li>
            </ul>
          </div>
        </div>

        {/* Risk Groups */}
        <div className="card-comic" style={{marginBottom:'40px'}}>
            <h3 className="text-center" style={{marginBottom:'30px'}}>ĐỐI TƯỢNG NGUY CƠ</h3>
            <div className="risk-grid" style={{marginBottom:0}}>
                <div className="risk-item" style={{textAlign:'left'}}>
                    <div style={{fontSize:'1.8rem', marginBottom:'5px'}}>👶</div>
                    <h4 style={{margin:'0 0 5px 0'}}>Trẻ em</h4>
                    <p style={{fontSize:'0.9rem', color:'#64748b', margin:0}}>Trẻ mẫu giáo và trong độ tuổi đi học.</p>
                </div>
                <div className="risk-item" style={{textAlign:'left'}}>
                    <div style={{fontSize:'1.8rem', marginBottom:'5px'}}>🤰</div>
                    <h4 style={{margin:'0 0 5px 0'}}>Phụ nữ</h4>
                    <p style={{fontSize:'0.9rem', color:'#64748b', margin:0}}>Trong độ tuổi sinh sản, mang thai, cho con bú.</p>
                </div>
                <div className="risk-item" style={{textAlign:'left'}}>
                    <div style={{fontSize:'1.8rem', marginBottom:'5px'}}>🥩</div>
                    <h4 style={{margin:'0 0 5px 0'}}>Ăn đồ tái sống</h4>
                    <p style={{fontSize:'0.9rem', color:'#64748b', margin:0}}>Thường xuyên ăn thịt, cá, hải sản tái, chưa nấu chín.</p>
                </div>
                <div className="risk-item" style={{textAlign:'left'}}>
                    <div style={{fontSize:'1.8rem', marginBottom:'5px'}}>🐾</div>
                    <h4 style={{margin:'0 0 5px 0'}}>Tiếp xúc thú cưng</h4>
                    <p style={{fontSize:'0.9rem', color:'#64748b', margin:0}}>Nuôi hoặc tiếp xúc gần với chó, mèo,...</p>
                </div>
                <div className="risk-item" style={{textAlign:'left'}}>
                    <div style={{fontSize:'1.8rem', marginBottom:'5px'}}>👨‍🌾</div>
                    <h4 style={{margin:'0 0 5px 0'}}>Lao động ngoài trời</h4>
                    <p style={{fontSize:'0.9rem', color:'#64748b', margin:0}}>Nông dân, thu gom rác, công nhân vệ sinh, nông-ngư nghiệp.</p>
                </div>
                <div className="risk-item" style={{textAlign:'left'}}>
                    <div style={{fontSize:'1.8rem', marginBottom:'5px'}}>🚽</div>
                    <h4 style={{margin:'0 0 5px 0'}}>Vệ sinh kém</h4>
                    <p style={{fontSize:'0.9rem', color:'#64748b', margin:0}}>Ở nơi thiếu nước sạch, hệ thống vệ sinh kém/ô nhiễm cao.</p>
                </div>
                <div className="risk-item" style={{textAlign:'left'}}>
                    <div style={{fontSize:'1.8rem', marginBottom:'5px'}}>😷</div>
                    <h4 style={{margin:'0 0 5px 0'}}>Suy giảm miễn dịch</h4>
                    <p style={{fontSize:'0.9rem', color:'#64748b', margin:0}}>HIV/AIDS, dùng corticoid kéo dài, sau ghép tạng, hóa trị, người cao tuổi.</p>
                </div>
            </div>
        </div>

        {/* --- CTA 1: Post Risk --- */}
        <div className="text-center relative" style={{zIndex:2, marginBottom:'60px'}}>
            <div style={{display:'inline-block', background:'#fff', padding:'20px 40px', borderRadius:'20px', border:'2px solid #0766F7', boxShadow:'4px 4px 0 #0766F7'}}>
                <p style={{fontSize:'1.1rem', fontWeight:'bold', color:'#0f172a', marginBottom:'15px', margin:0}}>
                    Bạn hoặc người thân thuộc nhóm nguy cơ trên?
                </p>
                <button className="btn-cta small" style={{marginTop:'15px'}}>
                    ĐẶT LỊCH TẦM SOÁT NGAY
                </button>
            </div>
        </div>

        {/* Classification */}
        <div style={{marginBottom:'60px'}}>
           <div className="card-comic">
               <h3 className="text-center" style={{marginBottom:'30px'}}>PHÂN LOẠI KÝ SINH TRÙNG</h3>
               <p className="text-center" style={{fontSize:'1rem', color:'#64748b', maxWidth:'600px', margin:'0 auto 30px'}}>Để có kiến thức toàn diện về ký sinh trùng, bạn cần nắm được 4 nhóm ký sinh trùng sau, mỗi nhóm có đặc điểm riêng:</p>
               
               <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', textAlign:'center'}}>
                   <div style={{padding:'15px', background:'#f8fafc', borderRadius:'15px'}}>
                      <div style={{fontSize:'2.5rem', marginBottom:'10px'}}>🪱</div>
                      <strong style={{display:'block', color:'#0766F7'}}>Giun, sán</strong>
                   </div>
                   <div style={{padding:'15px', background:'#f8fafc', borderRadius:'15px'}}>
                      <div style={{fontSize:'2.5rem', marginBottom:'10px'}}>🦠</div>
                      <strong style={{display:'block', color:'#0766F7'}}>Đơn bào</strong>
                   </div>
                   <div style={{padding:'15px', background:'#f8fafc', borderRadius:'15px'}}>
                      <div style={{fontSize:'2.5rem', marginBottom:'10px'}}>🕷️</div>
                      <strong style={{display:'block', color:'#0766F7'}}>Ngoài da</strong>
                   </div>
                   <div style={{padding:'15px', background:'#f8fafc', borderRadius:'15px'}}>
                      <div style={{fontSize:'2.5rem', marginBottom:'10px'}}>...</div>
                      <strong style={{display:'block', color:'#0766F7'}}>Khác</strong>
                   </div>
               </div>
           </div>
        </div>

        {/* Danger & Curability - Redesigned as Reality Card */}
        <div className="reality-card">
            <div className="reality-header">SỰ THẬT VỀ BỆNH</div>
            <div className="reality-content">
                <div className="reality-side danger">
                    <span className="reality-icon">🚨</span>
                    <h4 className="reality-title">NẾU CHỦ QUAN...</h4>
                    <ul style={{paddingLeft: '20px', fontSize:'0.95rem', lineHeight:'1.6', listStyle:'disc'}}>
                        <li>Suy dinh dưỡng, thiếu máu trầm trọng.</li>
                        <li>Tổn thương nội tạng: Gan, Phổi, Não.</li>
                        <li>Tắc ruột, viêm loét tiêu hóa.</li>
                        <li>Sảy thai, dị tật thai nhi.</li>
                    </ul>
                </div>

                <div className="reality-arrow">➤</div>

                <div className="reality-side cure">
                    <span className="reality-icon">✅</span>
                    <h4 className="reality-title">KHI ĐIỀU TRỊ ĐÚNG...</h4>
                    <p>Bệnh có thể điều trị <strong>hiệu quả hoàn toàn</strong> nếu phát hiện sớm và tuân thủ phác đồ y khoa.</p>
                    
                    <div style={{background: 'rgba(255,255,255,0.6)', padding: '15px', borderRadius: '10px', marginTop: '20px', border:'1px dashed #16a34a'}}>
                        <strong style={{color: '#c2410c', display:'block', marginBottom:'5px'}}>⚠️ LƯU Ý QUAN TRỌNG:</strong>
                        <p style={{margin:0, fontSize: '0.9rem'}}>Tuyệt đối không tự ý mua thuốc. Việc dùng sai thuốc có thể gây kháng thuốc, hại gan/thận mà không diệt được gốc bệnh.</p>
                    </div>
                </div>
            </div>
        </div>


        {/* ================= PHẦN 2: HIỂU ĐÚNG ================= */}
        <div id="phan-2" className="section-header">
            <span className="section-number">PHẦN 2</span>
            <h2 className="section-title">HIỂU ĐÚNG<br/>VỀ BỆNH</h2>
        </div>

        {/* Causes & Process */}
        <div className="card-comic" style={{marginBottom:'60px'}}>
            <h3 className="text-center" style={{marginBottom:'30px'}}>NGUYÊN NHÂN & QUÁ TRÌNH GÂY BỆNH</h3>
            
            <div style={{marginBottom:'40px'}}>
                <h4>🔍 NGUYÊN NHÂN LÂY NHIỄM:</h4>
                <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'15px', textAlign:'center', marginTop:'15px'}}>
                    <div className="grid-item-clean">
                        <div style={{fontSize:'2rem'}}>💧</div>
                        <span style={{fontSize:'0.9rem'}}>Thực phẩm/Nước bẩn</span>
                    </div>
                    <div className="grid-item-clean">
                        <div style={{fontSize:'2rem'}}>🚽</div>
                        <span style={{fontSize:'0.9rem'}}>Vệ sinh kém</span>
                    </div>
                    <div className="grid-item-clean">
                        <div style={{fontSize:'2rem'}}>🏜️</div>
                        <span style={{fontSize:'0.9rem'}}>Đất/Cát nhiễm bệnh</span>
                    </div>
                    <div className="grid-item-clean">
                        <div style={{fontSize:'2rem'}}>🦟</div>
                        <span style={{fontSize:'0.9rem'}}>Côn trùng truyền bệnh</span>
                    </div>
                </div>
            </div>

            <div>
                <h4>🔄 QUÁ TRÌNH GÂY BỆNH:</h4>
                <div className="process-flow">
                    <div className="process-step">
                        <div className="process-number">1</div>
                        <strong>Nguồn bệnh</strong>
                        <p style={{fontSize:'0.85rem', margin:0}}>Đất, nước, thực phẩm, thú nuôi (trứng/ấu trùng).</p>
                    </div>
                    <div className="process-step">
                        <div className="process-number">2</div>
                        <strong>Xâm nhập</strong>
                        <p style={{fontSize:'0.85rem', margin:0}}>Qua đường tiêu hoá hoặc xuyên qua da.</p>
                    </div>
                    <div className="process-step">
                        <div className="process-number">3</div>
                        <strong>Phát triển</strong>
                        <p style={{fontSize:'0.85rem', margin:0}}>Di chuyển trong cơ thể, trưởng thành, gây viêm.</p>
                    </div>
                    <div className="process-step">
                        <div className="process-number">4</div>
                        <strong>Gây hại</strong>
                        <p style={{fontSize:'0.85rem', margin:0}}>Thiếu máu, suy dinh dưỡng, tổn thương tạng.</p>
                    </div>
                </div>
            </div>
        </div>
        

        {/* Myths */}
        <div className="card-comic" style={{marginBottom:'60px'}}>
           <h3 className="text-center" style={{marginBottom: '30px', fontSize: '1.8rem'}}>NHỮNG HIỂU LẦM VỀ BỆNH</h3>
           <div className="myth-grid">
              <div className="myth-card">
                 <div className="myth-header">❌ "Chỉ trẻ em mới bị."</div>
                 <div className="myth-body">
                    <strong>✅ SỰ THẬT:</strong> Người lớn ăn hàng, đồ tái sống nhiễm rất cao.
                 </div>
              </div>
              <div className="myth-card">
                 <div className="myth-header">❌ "Tẩy giun 6 tháng là đủ."</div>
                 <div className="myth-body">
                     <strong>✅ SỰ THẬT:</strong> Sán lá, đơn bào cần thuốc đặc trị riêng.
                 </div>
              </div>
              <div className="myth-card">
                 <div className="myth-header">❌ "Không triệu chứng là khỏe."</div>
                 <div className="myth-body">
                    <strong>✅ SỰ THẬT:</strong> Nhiều ca bệnh âm thầm, chỉ phát hiện khi biến chứng.
                 </div>
              </div>
              <div className="myth-card">
                 <div className="myth-header">❌ "Tự mua thuốc là khỏi."</div>
                 <div className="myth-body">
                    <strong>✅ SỰ THẬT:</strong> Dễ gây kháng thuốc, hại gan mà không diệt gốc bệnh.
                 </div>
              </div>
           </div>
        </div>

        {/* ================= PHẦN 3: NHẬN DIỆN ================= */}
        <div id="phan-3" className="section-header">
            <span className="section-number">PHẦN 3</span>
            <h2 className="section-title">NHẬN DIỆN<br/>DẤU HIỆU</h2>
        </div>

        {/* Symptoms */}
        <div style={{marginBottom: '60px'}}>
            <div className="card-comic" style={{textAlign:'left'}}>
                <h3 className="text-center" style={{color:'#ea580c', marginBottom:'30px'}}>DẤU HIỆU NHIỄM KÝ SINH TRÙNG</h3>
                
                <div className="symptom-grid">
                    <div className="symptom-group">
                        <div className="symptom-title">
                            <span style={{fontSize:'1.8rem'}}>🧑</span>
                            <h4>Dấu hiệu ở người lớn</h4>
                        </div>
                        <ul className="symptom-list">
                            <li>Đau bụng tái diễn, đầy hơi, khó tiêu.</li>
                            <li>Rối loạn tiêu hóa: táo bón hoặc tiêu chảy.</li>
                            <li>Buồn nôn, chán ăn.</li>
                            <li>Ngứa da, nổi mẩn, mề đay.</li>
                            <li>Mệt mỏi kéo dài, thiếu máu, da xanh xao.</li>
                            <li>Sốt kéo dài không rõ nguyên nhân.</li>
                            <li>Sụt cân hoặc suy nhược cơ thể.</li>
                            <li>Giảm trí nhớ, tập trung, lo âu.</li>
                        </ul>
                    </div>

                    <div className="symptom-group">
                        <div className="symptom-title">
                            <span style={{fontSize:'1.8rem'}}>👶</span>
                            <h4>Dấu hiệu ở trẻ em</h4>
                        </div>
                        <ul className="symptom-list">
                            <li>Ngứa hậu môn về đêm.</li>
                            <li>Ngứa da, nổi mẩn, mề đay.</li>
                            <li>Đau bụng, rối loạn tiêu hóa.</li>
                            <li>Suy dinh dưỡng, chậm lớn, bụng hơi to.</li>
                            <li>Biếng ăn, kém hấp thu.</li>
                            <li>Ngủ chập chờn, quấy khóc ban đêm.</li>
                            <li>Học kém, giảm tập trung.</li>
                            <li>Sốt dai dẳng không rõ nguyên nhân.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        {/* VS Comparison - Redesigned */}
        <div style={{marginBottom: '60px'}}>
           <div className="card-comic">
                <h3 className="text-center" style={{marginBottom:'30px'}}>CÁCH PHÂN BIỆT VỚI DỊ ỨNG / RỐI LOẠN TIÊU HÓA</h3>
                <div className="vs-layout">
                    <div className="vs-card normal">
                        <h4 style={{color: '#64748b', fontSize:'1.2rem', marginBottom:'15px', fontWeight:'800'}}>Rối loạn tiêu hóa / Dị ứng</h4>
                        <ul style={{listStyle:'none', padding:0}}>
                            <li style={{marginBottom:'10px', display:'flex', gap:'10px'}}><span style={{color:'#64748b'}}>➤</span> Có yếu tố khởi phát rõ (ăn lạ, dị nguyên).</li>
                            <li style={{marginBottom:'10px', display:'flex', gap:'10px'}}><span style={{color:'#64748b'}}>➤</span> Triệu chứng nhanh, tự giới hạn.</li>
                            <li style={{display:'flex', gap:'10px'}}><span style={{color:'#64748b'}}>➤</span> Hiếm khi sụt cân, thiếu máu.</li>
                        </ul>
                    </div>
                    
                    <div className="vs-badge">VS</div>

                    <div className="vs-card parasite">
                        <h4 style={{color: '#ef4444', fontSize:'1.2rem', marginBottom:'15px', fontWeight:'800'}}>Nhiễm Ký sinh trùng</h4>
                        <ul style={{listStyle:'none', padding:0}}>
                            <li style={{marginBottom:'10px', display:'flex', gap:'10px'}}><span style={{color:'#ef4444'}}>➤</span> Kéo dài, mạn tính, tái diễn.</li>
                            <li style={{marginBottom:'10px', display:'flex', gap:'10px'}}><span style={{color:'#ef4444'}}>➤</span> Khó điều trị bằng thuốc thường.</li>
                            <li style={{display:'flex', gap:'10px'}}><span style={{color:'#ef4444'}}>➤</span> Kèm sụt cân, thiếu máu, ngứa da.</li>
                        </ul>
                    </div>
                </div>
           </div>
        </div>

        {/* --- CTA 2: Post Symptoms/VS --- */}
        <div className="text-center relative" style={{zIndex:2, marginBottom:'60px'}}>
             <button className="btn-cta" style={{background:'#ea580c', borderColor:'#9a3412'}}>
                NGHI NGỜ NHIỄM? ĐẶT LỊCH XÉT NGHIỆM NGAY
             </button>
        </div>

        {/* Diagnosis */}
        <div style={{marginBottom: '60px'}}>
           <div className="text-center" style={{marginBottom:'30px'}}>
              <h3>CÁCH XÉT NGHIỆM</h3>
           </div>
           
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'20px'}}>
              <div className="card-minimal">
                 <div style={{fontSize:'2rem', marginBottom:'10px'}}>🔍</div>
                 <strong>Soi phân</strong>
                 <p style={{fontSize:'0.9rem', color:'#64748b', marginTop:'5px'}}>Phát hiện trứng, nang hoặc ấu trùng trong mẫu phân, xác định chính xác các bệnh giun sán đường ruột.</p>
              </div>
              <div className="card-minimal">
                 <div style={{fontSize:'2rem', marginBottom:'10px'}}>🔬</div>
                 <strong>Soi dịch cơ thể</strong>
                 <p style={{fontSize:'0.9rem', color:'#64748b', marginTop:'5px'}}>Tìm trực tiếp ký sinh trùng cư trú ngoài đường tiêu hóa (đờm, dịch não tuỷ, mô, áp-xe).</p>
              </div>
              <div className="card-minimal">
                 <div style={{fontSize:'2rem', marginBottom:'10px'}}>🩸</div>
                 <strong>Huyết thanh học (ELISA)</strong>
                 <p style={{fontSize:'0.9rem', color:'#64748b', marginTop:'5px'}}>Phát hiện kháng thể hoặc kháng nguyên đặc hiệu, hữu ích với KST mô khó tìm bằng soi trực tiếp.</p>
              </div>
              <div className="card-minimal">
                 <div style={{fontSize:'2rem', marginBottom:'10px'}}>🧬</div>
                 <strong>PCR – sinh học phân tử</strong>
                 <p style={{fontSize:'0.9rem', color:'#64748b', marginTop:'5px'}}>Xác định ADN của ký sinh trùng với độ chính xác cao, phù hợp khi triệu chứng không điển hình hoặc tải KST thấp.</p>
              </div>
              <div className="card-minimal">
                 <div style={{fontSize:'2rem', marginBottom:'10px'}}>📈</div>
                 <strong>Xét nghiệm máu</strong>
                 <p style={{fontSize:'0.9rem', color:'#64748b', marginTop:'5px'}}>Đánh giá tăng bạch cầu ái toan, dấu hiệu viêm và rối loạn chức năng cơ quan liên quan nhiễm KST.</p>
              </div>
              <div className="card-minimal">
                 <div style={{fontSize:'2rem', marginBottom:'10px'}}>📸</div>
                 <strong>Chẩn đoán hình ảnh</strong>
                 <p style={{fontSize:'0.9rem', color:'#64748b', marginTop:'5px'}}>Siêu âm, CT, MRI giúp phát hiện tổn thương gan, phổi, não, mô mềm do ký sinh trùng gây ra.</p>
              </div>
           </div>

           <div className="card-comic" style={{marginTop: '30px', padding: '30px'}}>
                <h4 className="text-center" style={{fontSize:'1.5rem', marginBottom:'25px', color: '#0f172a'}}>🚦 CÁCH ĐỌC KẾT QUẢ</h4>
                
                <div className="result-traffic-container">
                    {/* Positive - Red */}
                    <div className="traffic-light-row">
                        <div className="light-bulb red">POS</div>
                        <div className="light-info">
                            <div className="light-title">DƯƠNG TÍNH (+)</div>
                            <p className="light-desc">Đã tìm thấy dấu hiệu ký sinh trùng. <strong>Hành động:</strong> Cần gặp bác sĩ để lên phác đồ điều trị ngay.</p>
                        </div>
                    </div>

                    {/* Warning - Yellow */}
                    <div className="traffic-light-row">
                         <div className="light-bulb yellow">SUS</div>
                         <div className="light-info">
                             <div className="light-title">NGHI NGỜ (+/-)</div>
                             <p className="light-desc">Tín hiệu chưa rõ ràng hoặc ở ranh giới. <strong>Hành động:</strong> Cần xét nghiệm lại hoặc làm thêm phương pháp khác.</p>
                         </div>
                    </div>

                    {/* Negative - Green */}
                    <div className="traffic-light-row">
                        <div className="light-bulb green">NEG</div>
                        <div className="light-info">
                            <div className="light-title">ÂM TÍNH (-)</div>
                            <p className="light-desc">Hiện tại chưa tìm thấy ký sinh trùng. <strong>Hành động:</strong> Tiếp tục phòng ngừa và tái kiểm tra định kỳ.</p>
                        </div>
                    </div>
                </div>
           </div>
           
           <div className="text-center" style={{marginTop:'30px'}}>
              <button className="btn-cta">ĐẶT LỊCH XÉT NGHIỆM</button>
           </div>
        </div>

        {/* ================= PHẦN 4: ĐIỀU TRỊ ================= */}
        <div id="phan-4" className="section-header">
            <span className="section-number">PHẦN 4</span>
            <h2 className="section-title">KIẾN THỨC<br/>VỀ ĐIỀU TRỊ</h2>
        </div>

        {/* Cách Điều Trị */}
        <div className="card-comic" style={{marginBottom:'60px'}}>
            <h3 className="text-center" style={{marginBottom:'30px'}}>CÁCH ĐIỀU TRỊ</h3>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:'30px'}}>
                 <div className="card-minimal">
                    <h4 style={{color:'#0766F7'}}>1. Điều trị đặc hiệu</h4>
                    <p style={{fontSize:'0.9rem', color:'#334155'}}>Chọn thuốc dựa trên loại ký sinh trùng, mức độ tổn thương và phác đồ chuẩn để tối ưu hiệu quả điều trị.</p>
                 </div>
                 <div className="card-minimal">
                    <h4 style={{color:'#0766F7'}}>2. Điều trị hỗ trợ & xử trí biến chứng</h4>
                    <p style={{fontSize:'0.9rem', color:'#334155'}}>Hỗ trợ giảm viêm, giảm đau, ổn định tiêu hoá; can thiệp khi có nang lớn, áp-xe hoặc tổn thương nặng.</p>
                 </div>
                 <div className="card-minimal">
                    <h4 style={{color:'#0766F7'}}>3. Theo dõi sau điều trị</h4>
                    <p style={{fontSize:'0.9rem', color:'#334155'}}>Đánh giá lại bằng xét nghiệm hoặc hình ảnh học để xác nhận đã loại bỏ ký sinh trùng. Điều chỉnh phác đồ nếu bệnh nhân đáp ứng chậm hoặc còn lưu tổn thương.</p>
                 </div>
                 <div className="card-minimal">
                    <h4 style={{color:'#0766F7'}}>4. Phòng ngừa tái nhiễm</h4>
                    <p style={{fontSize:'0.9rem', color:'#334155'}}>Tăng cường vệ sinh ăn uống, xử lý nguồn lây và kiểm soát động vật mang mầm bệnh.</p>
                 </div>
            </div>
        </div>

        {/* Medications */}
        <div className="card-comic" style={{marginBottom:'60px'}}>
            <h3 className="text-center" style={{marginBottom:'30px'}}>CÁCH LOẠI THUỐC THƯỜNG DÙNG</h3>
            <div className="med-grid">
                <div className="med-card">
                    <div className="med-name">Albendazole</div>
                    <p style={{fontSize:'0.85rem', color:'#334155', margin:0}}>Hiệu quả với nhiều loại giun và một số sán mô (giun đũa chó mèo, giun đầu gai...).</p>
                </div>
                <div className="med-card">
                    <div className="med-name">Mebendazole</div>
                    <p style={{fontSize:'0.85rem', color:'#334155', margin:0}}>Chủ yếu trên giun đường ruột (đũa, tóc, kim, móc). Dùng trong tẩy giun cộng đồng.</p>
                </div>
                <div className="med-card">
                    <div className="med-name">Ivermectin</div>
                    <p style={{fontSize:'0.85rem', color:'#334155', margin:0}}>Hiệu quả cao với giun lươn và giun truyền qua da. Ưu tiên khi nghi ngờ giun lươn lan rộng.</p>
                </div>
                <div className="med-card">
                    <div className="med-name">Praziquantel</div>
                    <p style={{fontSize:'0.85rem', color:'#334155', margin:0}}>Đặc hiệu cho đa số sán dây và sán lá (sán lợn, sán phổi). Tác dụng nhanh, liều đơn.</p>
                </div>
                <div className="med-card">
                    <div className="med-name">Triclabendazole</div>
                    <p style={{fontSize:'0.85rem', color:'#334155', margin:0}}>Lựa chọn hàng đầu cho sán lá gan lớn. Diệt cả sán trưởng thành và ấu trùng.</p>
                </div>
                <div className="med-card">
                    <div className="med-name">Niclosamide</div>
                    <p style={{fontSize:'0.85rem', color:'#334155', margin:0}}>Dùng chủ yếu cho sán dây đường ruột. Ít hấp thu toàn thân.</p>
                </div>
            </div>
        </div>

        {/* Treatment Notes */}
        <div className="card-comic" style={{marginBottom:'40px'}}>
            <h3 className="text-center" style={{marginBottom:'30px'}}>LƯU Ý KHI ĐIỀU TRỊ</h3>
            <ul style={{listStyle:'disc', paddingLeft:'20px', fontSize:'1rem', lineHeight:'1.8'}}>
                <li>Tuân thủ đúng phác đồ điều trị của bác sĩ.</li>
                <li>Không tự ý dùng thuốc khi chưa có chỉ định.</li>
                <li>Theo dõi phản ứng trong quá trình điều trị, báo ngay cho bác sĩ nếu có dấu hiệu bất thường.</li>
                <li>
                    Thận trọng ở nhóm đặc biệt:
                    <ul style={{listStyle:'circle', paddingLeft:'20px', marginTop:'5px', marginBottom:'0'}}>
                        <li>Phụ nữ mang thai: nhiều thuốc chống chỉ định, cần bác sĩ thẩm định.</li>
                        <li>Trẻ nhỏ: đặc biệt dưới 2 tuổi phải chọn thuốc và liều rất thận trọng.</li>
                        <li>Suy gan – thận: nguy cơ tích lũy thuốc, cần điều chỉnh liều.</li>
                        <li>Suy giảm miễn dịch: dễ bùng phát bệnh nặng, phải theo dõi sát.</li>
                    </ul>
                </li>
                <li>Tái khám đúng hẹn để đánh giá hiệu quả và phòng ngừa tái nhiễm.</li>
            </ul>
        </div>

        {/* --- CTA 3: Pre-Prevention/Post Treatment --- */}
        <div style={{background:'#e0f2fe', padding:'30px', borderRadius:'20px', textAlign:'center', marginBottom:'60px', border:'2px solid #bae6fd'}}>
            <h3 style={{color:'#0369a1', fontSize:'1.5rem', marginBottom:'10px'}}>Chưa rõ mình có nhiễm bệnh hay không?</h3>
            <p style={{marginBottom:'20px'}}>Đừng đoán mò. Kết quả xét nghiệm là cơ sở duy nhất để điều trị dứt điểm.</p>
            <button className="btn-cta" style={{background:'#0369a1', borderColor:'#075985'}}>ĐẶT LỊCH NGAY</button>
        </div>


        {/* ================= PHẦN 4: DINH DƯỠNG VÀ CHĂM SÓC TẠI NHÀ ================= */}
        <div className="section-header">
            <span className="section-number">PHẦN 4</span>
            <h2 className="section-title">DINH DƯỠNG<br/>& CHĂM SÓC TẠI NHÀ</h2>
        </div>
        
        {/* Nutrition & Care - Redesigned Layout */}
        <div className="care-layout" style={{marginBottom:'60px'}}>
           {/* Nutrition Card */}
           <div className="care-card">
              <div className="care-header" style={{background:'#0766F7'}}>🥗 CHẾ ĐỘ DINH DƯỠNG</div>
              <div className="care-body">
                 <div style={{marginBottom:'20px'}}>
                     <strong style={{color:'#0766F7', display:'block', marginBottom:'10px'}}>Nên bổ sung:</strong>
                     <div className="care-item">
                        <div className="care-icon" style={{color:'#0766F7'}}>🥩</div>
                        <span><strong>Đạm:</strong> Thịt nạc, cá, trứng, sữa.</span>
                     </div>
                     <div className="care-item">
                        <div className="care-icon" style={{color:'#0766F7'}}>🥦</div>
                        <span><strong>Vitamin:</strong> Rau xanh & trái cây.</span>
                     </div>
                     <div className="care-item">
                        <div className="care-icon" style={{color:'#0766F7'}}>🍠</div>
                        <span><strong>Chất xơ:</strong> Khoai lang, bí đỏ.</span>
                     </div>
                     <div className="care-item">
                        <div className="care-icon" style={{color:'#0766F7'}}>💧</div>
                        <span><strong>Nước sạch:</strong> 1.5 - 2 lít/ngày.</span>
                     </div>
                 </div>
                 
                 <div>
                     <strong style={{color:'#ef4444', display:'block', marginBottom:'10px'}}>Nên tránh:</strong>
                     <div className="care-item">
                        <div className="care-icon" style={{color:'#ef4444'}}>❌</div>
                        <span><strong>Đồ sống/tái:</strong> Gỏi, tiết canh.</span>
                     </div>
                     <div className="care-item">
                        <div className="care-icon" style={{color:'#ef4444'}}>❌</div>
                        <span><strong>Kích thích:</strong> Rượu bia, đồ cay nóng.</span>
                     </div>
                 </div>
              </div>
           </div>

           {/* Home Care Card */}
           <div className="care-card">
              <div className="care-header" style={{background:'#16a34a'}}>🏡 CHĂM SÓC TẠI NHÀ</div>
              <div className="care-body">
                 <div className="care-item">
                    <div className="care-icon" style={{color:'#16a34a'}}>💊</div>
                    <span><strong>Tuân thủ thuốc:</strong> Đúng liều, đủ liệu trình.</span>
                 </div>
                 <div className="care-item">
                    <div className="care-icon" style={{color:'#16a34a'}}>🧼</div>
                    <span><strong>Vệ sinh:</strong> Rửa tay thường xuyên, cắt móng tay.</span>
                 </div>
                 <div className="care-item">
                    <div className="care-icon" style={{color:'#16a34a'}}>🔥</div>
                    <span><strong>Ăn uống:</strong> Ăn chín uống sôi tuyệt đối.</span>
                 </div>
                 <div className="care-item">
                    <div className="care-icon" style={{color:'#16a34a'}}>🧹</div>
                    <span><strong>Môi trường:</strong> Vệ sinh nhà cửa, xử lý rác.</span>
                 </div>
                 <div className="care-item">
                    <div className="care-icon" style={{color:'#16a34a'}}>🛌</div>
                    <span><strong>Nghỉ ngơi:</strong> Ngủ đủ giấc, giảm căng thẳng.</span>
                 </div>
                 <div className="care-item" style={{background:'#fef2f2', padding:'10px', borderRadius:'10px', marginTop:'15px'}}>
                    <div className="care-icon" style={{color:'#dc2626'}}>⚠️</div>
                    <span style={{color:'#dc2626', fontWeight:'bold'}}>Theo dõi: Báo bác sĩ ngay nếu sốt cao, đau bụng dữ dội.</span>
                 </div>
              </div>
           </div>
        </div>


        {/* ================= PHẦN 5: PHÒNG NGỪA ================= */}
        <div id="phan-5" className="section-header">
            <span className="section-number">PHẦN 5</span>
            <h2 className="section-title">PHÒNG NGỪA<br/>TÁI NHIỄM</h2>
        </div>
        
        {/* Prevention */}
        <div className="card-comic" style={{marginBottom:'60px'}}>
            <h3 className="text-center" style={{marginBottom:'30px'}}>CÁC PHÒNG NGỪA TÁI NHIỄM</h3>
            <div className="checklist-grid">
                <div className="check-item"><span className="check-icon">✅</span> <span><strong>Ăn chín uống sôi:</strong> Tránh tuyệt đối các món sống, tái.</span></div>
                <div className="check-item"><span className="check-icon">✅</span> <span><strong>Rửa tay đúng cách:</strong> Với xà phòng trước ăn/sau vệ sinh.</span></div>
                <div className="check-item"><span className="check-icon">✅</span> <span><strong>Vệ sinh môi trường:</strong> Sạch bếp, nhà vệ sinh, xử lý rác.</span></div>
                <div className="check-item"><span className="check-icon">✅</span> <span><strong>Vệ sinh thú cưng:</strong> Tẩy giun 3 tháng/lần cho chó mèo.</span></div>
                <div className="check-item"><span className="check-icon">✅</span> <span><strong>Thực phẩm an toàn:</strong> Rửa sạch rau, bảo quản đúng cách.</span></div>
                <div className="check-item"><span className="check-icon">✅</span> <span><strong>Tránh đi chân đất:</strong> Đặc biệt nơi đất ẩm, nguy cơ giun móc.</span></div>
                <div className="check-item"><span className="check-icon">✅</span> <span><strong>Tẩy giun định kỳ:</strong> Cho cả gia đình theo khuyến cáo.</span></div>
                <div className="check-item"><span className="check-icon">✅</span> <span><strong>Tránh dùng chung:</strong> Khăn, cốc, đồ cá nhân.</span></div>
            </div>
        </div>

        {/* Deworming Schedule */}
        <div className="card-minimal" style={{marginBottom:'60px', background:'#f0f9ff', border:'2px dashed #0ea5e9'}}>
            <h3 className="text-center" style={{marginBottom:'20px', color:'#0369a1'}}>📅 LỊCH TẨY GIUN ĐỊNH KỲ</h3>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'20px', textAlign:'center'}}>
                <div>
                    <strong>Trẻ em &lt;12 tháng</strong>
                    <div style={{marginTop:'5px', color:'#64748b'}}>Không tẩy giun</div>
                </div>
                <div>
                    <strong>Trẻ em &gt;12 tháng</strong>
                    <div style={{marginTop:'5px', color:'#0766F7', fontWeight:'bold'}}>6 tháng/lần</div>
                </div>
                <div>
                    <strong>Người lớn</strong>
                    <div style={{marginTop:'5px', color:'#0766F7', fontWeight:'bold'}}>6-12 tháng/lần</div>
                </div>
                <div>
                    <strong>Phụ nữ mang thai</strong>
                    <div style={{marginTop:'5px', color:'#64748b'}}>Theo chỉ định bác sĩ</div>
                </div>
            </div>
        </div>


        {/* ================= Q&A ================= */}
        <div id="phan-6" className="section-header">
            <span className="section-number">PHẦN 6</span>
            <h2 className="section-title">HỎI ĐÁP<br/>(Q&A)</h2>
        </div>
      
        <div className="faq-accordion relative" style={{zIndex: 2, background:'#fff', border:'2px solid #1e293b', borderRadius:'16px', overflow:'hidden', marginBottom:'60px'}}>
            {faqList.map((item, i) => (
              <div key={i} className={`faq-row ${activeFaq === i ? 'active' : ''}`} 
                   onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                   style={{borderBottom: '1px solid #e2e8f0', padding: '15px 20px', cursor: 'pointer', background: activeFaq === i ? '#f8fafc' : '#fff'}}>
                 <div className="faq-q" style={{fontWeight:'700', display:'flex', justifyContent:'space-between', color:'#0f172a', fontSize:'0.95rem'}}>
                    {item.q} <span style={{color:'#0766F7', fontWeight:'900'}}>{activeFaq === i ? '−' : '+'}</span>
                 </div>
                 {activeFaq === i && (
                    <div className="faq-a" style={{marginTop:'10px', color:'#334155', lineHeight:'1.5', fontSize:'0.9rem'}}>
                       {item.a}
                    </div>
                 )}
              </div>
            ))}
        </div>
      </div>

      {/* --- FOOTER CTA --- */}
      <footer id="cta" className="footer-cta">
        <div className="footer-pattern"></div>
        <div style={{position:'relative', zIndex:2}}>
           <h2 style={{fontSize: '2rem', marginBottom: '15px', textShadow:'1px 1px 0 #0048AA'}}>Đừng Nuôi "Kẻ Thù" Trong Bụng!</h2>
           <p style={{marginBottom: '30px', fontSize:'1.1rem', opacity: 0.95}}>Liên hệ ngay để được tư vấn và xét nghiệm chính xác.</p>
           <button className="btn-cta" style={{background:'#fff', color:'#0766F7', boxShadow:'4px 4px 0 rgba(0,0,0,0.2)'}}>
             ĐẶT LỊCH XÉT NGHIỆM
           </button>
        </div>
      </footer>

    </div>
  );
}

const root = createRoot(document.getElementById('diag-guidebook-root'));
root.render(<App />);