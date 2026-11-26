/* Demo roles are intentionally reset to student whenever the page opens. */
let role='student';
const isTeacher=()=>role==='teacher';
function todayVN(){const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()),get=t=>parts.find(p=>p.type===t).value;return `${get('year')}-${get('month')}-${get('day')}`}
function accessibleWeeks(){return isTeacher()?[...db.weeks].sort((a,b)=>b.start.localeCompare(a.start)):[publicWeek()]}
function requireTeacher(){if(isTeacher())return true;toast('Chế độ học viên chỉ xem lịch. Hãy đăng nhập chế độ giáo viên để điều chỉnh.');return false}
function updateAppearanceMeta(){document.querySelector('meta[name="theme-color"]').content=document.documentElement.dataset.theme==='dark'?(isTeacher()?'#262624':'#18191B'):(isTeacher()?'#FAF9F5':'#F3F4F5')}
function updatedText(){const stamp=week()?.updatedAt||db.updatedAt;if(!stamp||!Number.isFinite(Date.parse(stamp)))return 'Lịch tuần mới: chưa có ngày cập nhật được ghi nhận.';return 'Lịch tuần mới được cập nhật vào ngày '+new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(stamp))+' lúc '+new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(stamp))+'.'}
function applyModeUI(){
 syncScheduleRole();
 C.ensureGreetings(db,SEED);C.ensureRoster(db);C.ensureTeacherColors(db);
 document.documentElement.dataset.role=role;
 const allowed=isTeacher()?['calendar','search','workload','catalog']:['calendar','search'];if(!allowed.includes(tab))tab='calendar';
 document.querySelectorAll('[data-tab]').forEach(b=>b.hidden=!allowed.includes(b.dataset.tab));
 const cal=$('[data-tab="calendar"]');cal.querySelector('.nav-full').textContent=isTeacher()?'Lịch học trong tuần':'Lịch tuần';cal.querySelector('.nav-short').textContent=isTeacher()?'Lịch dạy':'Lịch tuần';
 const search=$('[data-tab="search"]');search.querySelector('.nav-full').textContent='Tra cứu lịch học';search.querySelector('.nav-short').textContent='Tra cứu';
 $('.side-label').textContent=isTeacher()?'KHÔNG GIAN GIÁO VIÊN':'KHÔNG GIAN HỌC VIÊN';$('#role-avatar').textContent=isTeacher()?'GV':'HV';$('#role-caption').textContent=isTeacher()?'Giáo vụ Hành chính':'Chế độ học viên';$('#mode-badge').innerHTML=icon(isTeacher()?'badge':'school')+(isTeacher()?'Giáo viên':'Học viên');
 $('#mode-switch').innerHTML=icon(isTeacher()?'school':'lock')+'<span class="mode-full">'+(isTeacher()?'Chế độ học viên':'Chế độ giáo viên')+'</span><span class="mode-compact">'+(isTeacher()?'Học viên':'Giáo viên')+'</span>';$('#mode-switch').onclick=switchRole;$('#mode-badge').title=isTeacher()?'Giáo vụ Hành chính · Điều chỉnh lịch':'Chế độ xem dành cho học viên và giáo viên';
 $('#publish-week').hidden=!isTeacher();$('#export-open').hidden=!isTeacher();$('#save-state').textContent=isTeacher()?'Đã lưu trên máy':'Chỉ xem lịch';
 const weeks=accessibleWeeks();if(!weeks.some(w=>w.id===weekId))weekId=(isTeacher()?(weeks.find(w=>w.start===C.studentWeeks(db,todayVN())[0].start)||weeks[0]):weeks[0]).id;
 $('#sidebar-toggle').onclick=()=>{const collapsed=document.documentElement.classList.toggle('sidebar-collapsed');$('#sidebar-toggle').innerHTML=icon(collapsed?'menu':'menu_open');$('#sidebar-toggle').setAttribute('aria-expanded',String(!collapsed));$('#sidebar-toggle').setAttribute('aria-label',collapsed?'Hiện thanh bên':'Ẩn thanh bên để mở rộng lịch');};
 $('#help').onclick=()=>isTeacher()?showAdminHelp():showStudentHelp();updateAppearanceMeta();
}
function switchRole(){
 if(isTeacher()){role='student';tab='calendar';view='list';sortBy='time';query='';teacherFilter='';classFilter='';allWeeks=false;resetStudentSearch();weekId=publicWeek().id;close();init();toast('Đã chuyển sang chế độ học viên, chỉ xem lịch.');return}
 modal('Chế độ giáo viên · Giáo vụ Hành chính',`<form id="teacher-login"><p class="form-note">Chế độ điều chỉnh lịch dành cho Giáo vụ Hành chính. Giáo viên vẫn có thể xem và tìm lịch trong chế độ học viên.</p><label class="form-label">Mật khẩu giáo viên<input id="teacher-password" type="password" autocomplete="current-password" required placeholder="Nhập mật khẩu giáo viên"></label><div id="login-error" class="error" role="alert"></div><div class="form-actions"><button class="button" type="button" id="cancel-login">Hủy</button><button class="button primary" type="submit">${icon('lock_open')}Vào chế độ giáo viên</button></div></form>`);
 $('#cancel-login').onclick=close;$('#teacher-login').onsubmit=async e=>{e.preventDefault();const field=$('#teacher-password');try{const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(field.value)),hash=Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');field.value='';if(hash!==APP_CONFIG.teacherPasswordSha256){ $('#login-error').textContent='Mật khẩu chưa đúng. Vui lòng nhập lại.';field.focus();return}if(!$('#teacher-login')?.isConnected||!$('#dialog').open)return;role='teacher';tab='calendar';view=innerWidth<761?'list':'grid';sortBy='time';close();init();toast('Đã mở chế độ giáo viên.')}catch{field.value='';$('#login-error').textContent='Không mở được chế độ giáo viên. Hãy dùng bản web HTTPS hoặc trình duyệt hỗ trợ xác thực.'}};
}
function showStudentSession(id,inweek){
 const w=accessibleWeeks().find(w=>w.id===inweek),e=w?.entries.find(e=>e.id===id);if(!e||e.status==='cancelled')return;
 const c=cls(e.classId),t=teacher(e.teacherId),p=program(c?.programId),date=C.addDays(w.start,e.day);
 const fact=(symbol,label,value)=>`<div class="lesson-fact">${icon(symbol)}<dt>${label}</dt><dd>${value}</dd></div>`;
 modal('Chi tiết buổi học',`<article class="lesson-sheet" style="--lesson-accent:${programColor(p)}"><header class="lesson-hero"><p class="lesson-program">${esc(p?.name||'Lịch học Proskills')}</p><h3>${esc(c?.name||'Lớp học')}</h3><p class="lesson-topic">${esc(e.title)}</p></header><dl class="lesson-facts">${fact('calendar_today','Ngày học',esc(DAYS[e.day])+'<small>'+esc(dateLabel(date))+'</small>')}${fact('schedule','Ca học',esc(PERIOD_START[e.start-1])+' – '+esc(PERIOD_END[e.end-1])+'<small>Tiết '+e.start+'–'+e.end+'</small>')}${fact('person','Giáo viên',esc(t?.name||'Chưa cập nhật'))}${fact('meeting_room','Cơ sở / phòng',esc(StudentCore.campus(e.campus)||'Chưa cập nhật')+'<small>'+esc(roomLabel(e.room))+'</small>')}</dl><p class="lesson-reminder">${icon('info')}<span>Nếu đi học bù, bạn nhớ xin phép giáo viên trước ít nhất 1 ngày</span></p>${studentTimeline(w,e)}<button class="button primary" id="add-to-calendar">${icon('event_available')}Thêm vào lịch điện thoại</button></article>`);
 $('#add-to-calendar').onclick=()=>addStudentEvent(w,e);
}

function wireSort(){$("#sort-by")?.addEventListener("change",e=>{sortBy=e.target.value;render()})}

function showStudentHelp(){
 const steps=[
  ['search','Chọn lớp','Vào Tra cứu, gõ mã lớp như E696 hoặc 696. Chọn một hay nhiều lớp từ gợi ý.'],
  ['filter_list','Xem hoặc lọc lịch','Nhấn Tra cứu để xem kết quả. Mở Tìm kiếm nâng cao để lọc thêm, hoặc vào Lịch tuần để xem toàn bộ lịch.'],
  ['event_available','Mở chi tiết buổi học','Chạm vào một buổi để xem đầy đủ chuyên đề, địa điểm, các buổi tiếp theo và thêm vào lịch điện thoại.']
 ];
 modal('Hướng dẫn xem lịch',`<ol class="student-guide">${steps.map(([symbol,title,body],i)=>`<li><span class="guide-icon">${icon(symbol)}</span><div><small>Bước ${i+1}</small><h3>${title}</h3><p>${body}</p></div></li>`).join('')}</ol>`);
}
function showAdminHelp(){modal('Giáo vụ Hành chính · Hướng dẫn',`<div class="help-text"><p><b>Lập lịch:</b> chọn tuần và thêm/sửa buổi học. Chọn cơ sở rồi chọn phòng; app kiểm tra trùng giáo viên, lớp và phòng.</p><p><b>Tuần mới:</b> giữ khung tuần cũ, gợi ý bài tiếp theo và luân phiên lịch chào theo danh sách của từng ca. Lịch chào không cộng vào tiết dạy.</p><p><b>Chương trình đào tạo:</b> quản lý lớp, giáo viên, phòng, chương trình và 10 màu nhận diện. Ẩn lớp hoàn thành hoặc phòng ngừng sử dụng khỏi danh sách chọn.</p><p><b>Công suất:</b> tổng tiết, tiết ngày, tiết tối và chi tiết từng ngày. Cần rà soát vì lịch mẫu chưa nhập đủ các ô gộp/ca nối từ Excel.</p><p><b>Ngày cập nhật:</b> được ghi khi lưu dữ liệu lịch; bản cũ chưa có mốc sẽ hiển thị chưa ghi nhận.</p><p><b>Chế độ học viên:</b> giao diện xanh chỉ xem và tìm học bù. Khi tải lại trang, app mặc định trở về chế độ này.</p><p><b>Bản demo:</b> khóa thao tác bằng mật khẩu tại trình duyệt, chưa có tài khoản hoặc phân quyền máy chủ. Hãy sao lưu sau khi làm lịch.</p></div>`)}
