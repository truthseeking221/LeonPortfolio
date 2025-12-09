import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

// Version: 9.0.0 (Clean & Hierarchy Focus)

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

function App() {
  const [activeFaq, setActiveFaq] = useState(null);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      
      {/* --- HERO SECTION --- */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-box">
            <div style={{background: '#0766F7', color:'#fff', display:'inline-block', padding:'6px 16px', borderRadius:'30px', fontWeight:'bold', marginBottom:'15px', fontSize: '0.9rem', letterSpacing:'1px'}}>DOCTOR DIAG</div>
            <h1 className="hero-title">CẨM NANG<br/>KÝ SINH TRÙNG</h1>
            <p className="hero-subtitle">
              Bật mí nội dung cẩm nang Doctor DIAG mang đến góc nhìn dễ hiểu và sinh động về ký sinh trùng, và những rủi ro đang hiện hữu quanh bạn và gia đình.
            </p>
            
            {/* Benefits & Audience - Clean Layout */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '40px', textAlign: 'left', marginTop:'30px'}}>
               {/* Audience */}
               <div className="card-minimal" style={{borderLeft:'4px solid #0ea5e9'}}>
                   <h4 style={{marginBottom: '15px', color:'#0284c7'}}>Cẩm nang này dành riêng cho ai?</h4>
                   <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                      <span style={{background: '#e0f2fe', color: '#0369a1', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight:'bold'}}>Phụ huynh có con nhỏ</span>
                      <span style={{background: '#e0f2fe', color: '#0369a1', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight:'bold'}}>Người nghi nhiễm bệnh</span>
                      <span style={{background: '#e0f2fe', color: '#0369a1', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight:'bold'}}>Người có nguy cơ cao</span>
                      <span style={{background: '#e0f2fe', color: '#0369a1', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight:'bold'}}>Người chăm sóc</span>
                   </div>
               </div>
            </div>
            
            <button onClick={() => scrollToSection('phan-1')} className="btn-cta">
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

        {/* Stats - Boxed for Emphasis */}
        <div className="infographic-row">
          <div style={{flex:1, textAlign:'center'}}>
            <div className="visual-big">1.5<small> TỶ</small></div>
            <p style={{fontSize:'1.25rem', fontWeight:'bold', color: '#64748b'}}>người nhiễm ký sinh trùng<br/>trên toàn thế giới</p>
          </div>
          <div className="card-comic" style={{flex:1.5}}>
            <h3 style={{marginBottom:'20px', color: '#0766F7'}}>CON SỐ THỐNG KÊ</h3>
            <ul style={{fontSize: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
               <li>~20 nghìn người nhiễm giun chó mèo/năm VN.</li>
               <li>42% trẻ em 2-5 tuổi nhiễm giun sán.</li>
               <li style={{gridColumn: '1 / span 2', borderTop:'1px dashed #cbd5e1', paddingTop:'10px'}}>
                   <strong>Fact:</strong> Khoảng 70 - 80% chúng ta nhiễm ít nhất một loại giun nào đó.
               </li>
            </ul>
          </div>
        </div>

        {/* Risk Groups - UNBOXED Clean Grid */}
        <div className="card-comic" style={{marginBottom:'60px'}}>
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
                    <div style={{fontSize:'1.8rem', marginBottom:'5px'}}> unclean </div>
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

        {/* Classification - Minimal Grid */}
        <div style={{marginBottom:'60px'}}>
           <div className="text-center" style={{marginBottom:'30px'}}>
               <h3>PHÂN LOẠI KÝ SINH TRÙNG</h3>
               <p style={{fontSize:'1rem', color:'#64748b', maxWidth:'600px', margin:'0 auto'}}>Để có kiến thức toàn diện về ký sinh trùng, bạn cần nắm được 4 nhóm ký sinh trùng sau, mỗi nhóm có đặc điểm riêng:</p>
           </div>
           <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px'}}>
               <div className="grid-item-clean">
                  <div style={{fontSize:'2rem'}}>🪱</div>
                  <strong style={{display:'block', marginTop:'5px', color:'#0766F7'}}>Giun, sán</strong>
               </div>
               <div className="grid-item-clean">
                  <div style={{fontSize:'2rem'}}>🦠</div>
                  <strong style={{display:'block', marginTop:'5px', color:'#0766F7'}}>Động vật đơn bào</strong>
               </div>
               <div className="grid-item-clean">
                  <div style={{fontSize:'2rem'}}>🕷️</div>
                  <strong style={{display:'block', marginTop:'5px', color:'#0766F7'}}>Ký sinh trùng ngoài da</strong>
               </div>
               <div className="grid-item-clean">
                  <div style={{fontSize:'2rem'}}>...</div>
                  <strong style={{display:'block', marginTop:'5px', color:'#0766F7'}}>Và nhiều loại khác</strong>
               </div>
           </div>
        </div>

        {/* Danger & Curability - Boxed for Impact */}
        <div style={{position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom:'60px'}}>
             <div className="card-comic" style={{borderColor: '#ef4444', margin:0}}>
                <h3 style={{color: '#dc2626'}}>🚨 MỨC ĐỘ NGUY HIỂM</h3>
                <ul style={{paddingLeft: '20px', fontSize:'0.95rem', lineHeight:'1.6', listStyle:'disc'}}>
                   <li>Suy dinh dưỡng, thiếu máu trầm trọng.</li>
                   <li>Tổn thương nội tạng: Gan, Phổi, Não.</li>
                   <li>Tắc ruột, viêm loét tiêu hóa.</li>
                   <li>Sảy thai, dị tật thai nhi.</li>
                </ul>
             </div>
             
             <div className="card-comic" style={{borderColor: '#16a34a', margin:0}}>
                <h3 style={{color: '#16a34a'}}>✅ KHẢ NĂNG CHỮA TRỊ</h3>
                <p>Điều trị hiệu quả hoàn toàn nếu phát hiện sớm và dùng đúng phác đồ.</p>
                <div style={{background: '#fff7ed', padding: '15px', borderRadius: '10px', marginTop: '15px'}}>
                    <strong style={{color: '#c2410c'}}>⚠️ CẢNH BÁO:</strong>
                    <p style={{margin:0, fontSize: '0.9rem'}}>Tự ý dùng thuốc có thể gây kháng thuốc hoặc hại gan/thận mà không hết bệnh.</p>
                </div>
             </div>
        </div>


        {/* ================= PHẦN 2: HIỂU ĐÚNG ================= */}
        <div id="phan-2" className="section-header">
            <span className="section-number">PHẦN 2</span>
            <h2 className="section-title">HIỂU ĐÚNG<br/>VỀ BỆNH</h2>
        </div>

        {/* Nguyên Nhân & Quá Trình Gây Bệnh */}
        <div className="card-comic" style={{marginBottom:'60px'}}>
            <h3 className="text-center" style={{marginBottom:'30px'}}>NGUYÊN NHÂN & QUÁ TRÌNH GÂY BỆNH</h3>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'30px', marginBottom:'30px'}}>
                <div>
                    <h4>🔍 NGUYÊN NHÂN LÂY NHIỄM:</h4>
                    <ul style={{listStyle:'disc', paddingLeft:'20px', fontSize:'0.95rem', lineHeight:'1.6'}}>
                        <li>Thực phẩm và nước uống nhiễm bẩn.</li>
                        <li>Vệ sinh cá nhân và môi trường kém.</li>
                        <li>Tiếp xúc với đất, cát hoặc bề mặt nhiễm mầm bệnh.</li>
                        <li>Muỗi, côn trùng và động vật truyền bệnh.</li>
                    </ul>
                </div>
                <div>
                    <h4>🔄 QUÁ TRÌNH GÂY BỆNH:</h4>
                    <ul style={{listStyle:'none', paddingLeft:0, fontSize:'0.95rem', lineHeight:'1.8'}}>
                        <li><strong>Nguồn mầm bệnh:</strong> Đất – nước – thực phẩm – thú nuôi – vật dụng (trứng/ấu trùng).</li>
                        <li><strong>Con đường xâm nhập:</strong> Tiêu hoá • Qua da • Thú nuôi • Vật dụng/da.</li>
                        <li><strong>Xâm nhập cơ thể:</strong> Vượt hàng rào bảo vệ • Định cư ruột/mô.</li>
                        <li><strong>Phát triển & sinh sản:</strong> Trứng → Ấu trùng → Trưởng thành • Gây viêm.</li>
                        <li><strong>Gây bệnh:</strong> Thiếu máu • Suy dinh dưỡng • Tổn thương cơ quan.</li>
                        <li><strong>Thải ra môi trường:</strong> Trứng/ấu trùng theo phân – nước → tái lây nhiễm.</li>
                    </ul>
                </div>
            </div>
        </div>
        

        {/* MYTHS VS FACTS - Grid Cards */}
        <div style={{position: 'relative', zIndex: 2, marginBottom:'60px'}}>
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

        {/* SYMPTOMS - Clean List Layout */}
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

        {/* VS COMPARISON - Clean */}
        <div style={{marginBottom: '60px'}}>
           <div className="card-comic">
                <h3 className="text-center" style={{marginBottom:'20px'}}>CÁCH PHÂN BIỆT VỚI DỊ ỨNG / RỐI LOẠN TIÊU HÓA</h3>
                <div style={{display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '20px', alignItems: 'center'}}>
                    <div className="card-minimal" style={{margin:0, padding:'20px', borderLeft:'4px solid #0766F7'}}>
                        <h4 style={{color: '#0766F7', fontSize:'1.1rem'}}>Rối loạn tiêu hóa / Dị ứng thông thường</h4>
                        <ul style={{listStyle:'disc', paddingLeft:'20px', fontSize:'0.9rem', color:'#64748b', lineHeight:'1.6'}}>
                            <li>Thường có yếu tố khởi phát rõ ràng (ăn lạ, tiếp xúc dị nguyên).</li>
                            <li>Triệu chứng thường xuất hiện nhanh và tự giới hạn.</li>
                            <li>Hiếm khi kèm theo sụt cân, thiếu máu, mệt mỏi kéo dài.</li>
                        </ul>
                    </div>
                    <div style={{fontSize: '2rem', fontWeight: '900', color: '#1e293b', alignSelf:'center'}}>VS</div>
                    <div className="card-minimal" style={{margin:0, padding:'20px', borderLeft:'4px solid #ef4444'}}>
                        <h4 style={{color: '#ef4444', fontSize:'1.1rem'}}>Nhiễm ký sinh trùng</h4>
                        <ul style={{listStyle:'disc', paddingLeft:'20px', fontSize:'0.9rem', color:'#64748b', lineHeight:'1.6'}}>
                            <li>Triệu chứng kéo dài, mạn tính, thường tái diễn.</li>
                            <li>Không rõ nguyên nhân, khó điều trị dứt điểm bằng thuốc thông thường.</li>
                            <li>Kèm theo các dấu hiệu toàn thân như sụt cân, thiếu máu, mệt mỏi, ngứa da.</li>
                            <li>Có yếu tố nguy cơ (ăn đồ tái sống, tiếp xúc thú cưng, môi trường kém vệ sinh).</li>
                        </ul>
                    </div>
                </div>
           </div>
        </div>

        {/* DIAGNOSIS - Updated Content */}
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

           <div className="card-comic" style={{marginTop: '30px', padding: '20px'}}>
                <h4 className="text-center" style={{fontSize:'1.2rem', marginBottom:'15px'}}>CÁCH ĐỌC KẾT QUẢ XÉT NGHIỆM</h4>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', justifyContent: 'center', fontSize:'0.95rem', textAlign:'center'}}>
                    <div><span style={{color: '#16a34a', fontWeight: 'bold'}}>Dương tính:</span> Xác nhận có KST hoặc dấu ấn đặc hiệu. Bác sĩ dựa vào lâm sàng để đánh giá mức độ và chỉ định điều trị.</div>
                    <div><span style={{color: '#dc2626', fontWeight: 'bold'}}>Âm tính:</span> Chưa phát hiện KST nhưng không loại trừ hoàn toàn. Có thể cần lặp lại hoặc dùng xét nghiệm chuyên sâu nếu vẫn nghi ngờ.</div>
                    <div><span style={{color: '#ca8a04', fontWeight: 'bold'}}>Nghi ngờ:</span> Tín hiệu không đủ rõ để kết luận. Bệnh nhân sẽ được xét nghiệm bổ sung hoặc theo dõi lại để xác định chính xác.</div>
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

        {/* CÁCH LOẠI THUỐC THƯỜNG DÙNG */}
        <div className="card-comic" style={{marginBottom:'60px'}}>
            <h3 className="text-center" style={{marginBottom:'30px'}}>CÁCH LOẠI THUỐC THƯỜNG DÙNG</h3>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:'20px'}}>
                <div className="card-minimal">
                    <h4 style={{color:'#0766F7'}}>Albendazole</h4>
                    <p style={{fontSize:'0.9rem', color:'#334155'}}>Thuốc phổ rộng, hiệu quả với nhiều loại giun và một số bệnh sán mô. Dùng trong giun đũa chó mèo, giun đầu gai, giun lươn, sán dây và một số bệnh sán lá.</p>
                </div>
                <div className="card-minimal">
                    <h4 style={{color:'#0766F7'}}>Mebendazole</h4>
                    <p style={{fontSize:'0.9rem', color:'#334155'}}>Tác dụng chủ yếu trên giun đường ruột như giun đũa, giun tóc, giun kim và giun móc. Thường dùng trong các chiến dịch tẩy giun cộng đồng.</p>
                </div>
                <div className="card-minimal">
                    <h4 style={{color:'#0766F7'}}>Ivermectin</h4>
                    <p style={{fontSize:'0.9rem', color:'#334155'}}>Hiệu quả cao với giun lươn và một số giun truyền qua da. Là lựa chọn ưu tiên khi nghi ngờ giun lươn lan rộng hoặc bệnh nhân có yếu tố suy giảm miễn dịch.</p>
                </div>
                <div className="card-minimal">
                    <h4 style={{color:'#0766F7'}}>Praziquantel</h4>
                    <p style={{fontSize:'0.9rem', color:'#334155'}}>Thuốc đặc hiệu cho đa số bệnh sán dây và sán lá như sán dây bò/lợn, sán lá phổi, sán lá ruột. Có tác dụng diệt ký sinh trùng nhanh và thường dùng liều đơn.</p>
                </div>
                <div className="card-minimal">
                    <h4 style={{color:'#0766F7'}}>Triclabendazole</h4>
                    <p style={{fontSize:'0.9rem', color:'#334155'}}>Lựa chọn hàng đầu cho sán lá gan lớn. Có hiệu quả cao trên cả giai đoạn trưởng thành và ấu trùng, được Bộ Y tế chỉ định rõ trong phác đồ điều trị.</p>
                </div>
                <div className="card-minimal">
                    <h4 style={{color:'#0766F7'}}>Niclosamide</h4>
                    <p style={{fontSize:'0.9rem', color:'#334155'}}>Dùng chủ yếu cho sán dây đường ruột. Thuốc tác động tại ruột, ít hấp thu toàn thân và phù hợp khi cần kiểm soát sán dây trưởng thành.</p>
                </div>
            </div>
        </div>

        {/* LƯU Ý KHI ĐIỀU TRỊ */}
        <div className="card-comic" style={{marginBottom:'60px'}}>
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


        {/* ================= PHẦN 4: DINH DƯỠNG VÀ CHĂM SÓC TẠI NHÀ ================= */}
        <div className="section-header">
            <span className="section-number">PHẦN 4</span>
            <h2 className="section-title">DINH DƯỠNG<br/>& CHĂM SÓC TẠI NHÀ</h2>
        </div>
        
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'30px', marginBottom:'60px'}}>
           <div className="card-minimal" style={{background:'#eff6ff', border:'1px solid #bfdbfe'}}>
              <h3 style={{color: '#0766F7'}}>🥗 CHẾ ĐỘ DINH DƯỠNG</h3>
              <div style={{marginTop:'15px', lineHeight:'1.8'}}>
                 <h4>Nên bổ sung:</h4>
                 <ul style={{listStyle:'disc', paddingLeft:'20px', fontSize:'0.95rem', marginBottom:'15px'}}>
                    <li>Thực phẩm giàu đạm: thịt nạc, cá, trứng, sữa.</li>
                    <li>Rau xanh & trái cây: bổ sung vitamin, khoáng chất.</li>
                    <li>Chất xơ dễ tiêu: khoai lang, bí đỏ, rau củ hấp.</li>
                    <li>Nguồn nước sạch: uống đủ 1,5-2 lít/ngày.</li>
                 </ul>
                 <h4>Nên tránh:</h4>
                 <ul style={{listStyle:'disc', paddingLeft:'20px', fontSize:'0.95rem'}}>
                    <li>Đồ sống hoặc tái: gỏi cá, thịt tái, tiết canh, rau sống kém vệ sinh.</li>
                    <li>Đồ chiên rán, cay nóng: dễ gây rối loạn tiêu hóa.</li>
                    <li>Thực phẩm nhiều đường: bánh kẹo, nước ngọt.</li>
                    <li>Rượu bia: gây gánh nặng lên gan, ảnh hưởng hấp thu thuốc.</li>
                 </ul>
              </div>
           </div>
           <div className="card-minimal" style={{background:'#f0fdf4', border:'1px solid #bbf7d0'}}>
              <h3 style={{color: '#16a34a'}}>🏡 CHĂM SÓC TẠI NHÀ</h3>
              <div style={{marginTop: '15px', lineHeight:'1.8'}}>
                 <ul style={{listStyle:'disc', paddingLeft:'20px', fontSize:'0.95rem'}}>
                    <li>Tuân thủ thuốc đúng hướng dẫn: đúng liều, thời điểm, đủ liệu trình.</li>
                    <li>Giữ vệ sinh cá nhân: rửa tay trước ăn/sau vệ sinh, cắt móng tay ngắn.</li>
                    <li>Ăn chín uống sôi: tránh tuyệt đối thực phẩm sống/tái.</li>
                    <li>Giữ môi trường sạch: vệ sinh bếp, nhà vệ sinh, xử lý phân – rác.</li>
                    <li>Nghỉ ngơi hợp lý: ngủ đủ giấc, giảm căng thẳng.</li>
                    <li>Theo dõi triệu chứng: liên hệ bác sĩ nếu sốt, đau bụng, tiêu chảy kéo dài.</li>
                 </ul>
              </div>
           </div>
        </div>


        {/* ================= PHẦN 5: PHÒNG NGỪA ================= */}
        <div id="phan-5" className="section-header">
            <span className="section-number">PHẦN 5</span>
            <h2 className="section-title">PHÒNG NGỪA<br/>TÁI NHIỄM</h2>
        </div>
        
        {/* CÁC PHÒNG NGỪA TÁI NHIỄM */}
        <div className="card-comic" style={{marginBottom:'60px'}}>
            <h3 className="text-center" style={{marginBottom:'30px'}}>CÁC PHÒNG NGỪA TÁI NHIỄM</h3>
            <ul style={{listStyle:'disc', paddingLeft:'20px', fontSize:'1rem', lineHeight:'1.8'}}>
                <li>Ăn chín uống sôi: Tránh tuyệt đối các món sống, tái; đảm bảo nước uống và thực phẩm được xử lý vệ sinh.</li>
                <li>Rửa tay đúng cách: Rửa tay với xà phòng trước khi ăn, sau khi đi vệ sinh và sau khi tiếp xúc đất, thú cưng.</li>
                <li>Giữ vệ sinh môi trường: Làm sạch bếp, nhà vệ sinh, dụng cụ ăn uống; xử lý phân – rác đúng quy trình.</li>
                <li>Vệ sinh thú cưng: Tẩy giun định kỳ cho chó mèo 3 tháng/lần, tránh để vật nuôi tiếp xúc gần khi đang điều trị.</li>
                <li>Quản lý thực phẩm an toàn: Rửa sạch rau củ, ngâm nước muối, bảo quản lạnh đúng cách; tránh mua thực phẩm không rõ nguồn gốc.</li>
                <li>Tránh đi chân đất: Đặc biệt ở khu vực ẩm, đất ướt hoặc nơi có nguy cơ nhiễm giun móc và giun lươn.</li>
                <li>Tẩy giun định kỳ theo khuyến cáo: Thực hiện tẩy giun cho cá nhân và gia đình, nhất là trẻ nhỏ, theo khuyến cáo của Bộ Y tế.</li>
                <li>Tránh dùng chung đồ cá nhân: Không dùng chung khăn, cốc, chén, thau rửa hay vật dụng tắm rửa để hạn chế lây chéo trong gia đình.</li>
            </ul>
        </div>

        {/* TẨY GIUN ĐỊNH KỲ */}
        <div className="card-comic" style={{marginBottom:'60px'}}>
            <h3 className="text-center" style={{marginBottom:'30px'}}>TẨY GIUN ĐỊNH KỲ</h3>
            <ul style={{listStyle:'disc', paddingLeft:'20px', fontSize:'1rem', lineHeight:'1.8'}}>
                <li><strong>Trẻ em &lt;12 tháng tuổi:</strong> Không tẩy giun.</li>
                <li><strong>Trẻ em từ 12 tháng tuổi:</strong> 6 tháng/lần.</li>
                <li><strong>Người lớn:</strong> 6-12 tháng/lần (Tùy mức độ nguy cơ).</li>
                <li><strong>Phụ nữ mang thai:</strong> Theo chỉ định bác sĩ, không tẩy giun trong 3 tháng đầu thai kỳ.</li>
                <li><strong>Người suy giảm miễn dịch/bệnh mãn tính:</strong> Theo chỉ định bác sĩ.</li>
            </ul>
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