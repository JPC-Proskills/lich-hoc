/* In-memory student view never replaces proskills-planner-v1. */
const studentScope=new URL('./',location.href).pathname;
const studentFeedKey='proskills-public-feed:'+studentScope;
let acceptedFeed=null,pendingFeed=null,localPlannerDb=null,viewingPublished=false,activePublicFeed=null,feedBusy=false;
try{const savedFeed=localStorage.getItem(studentFeedKey);if(savedFeed)acceptedFeed=StudentFeed.validate(JSON.parse(savedFeed))}catch{}
function syncScheduleRole(){
 if(isTeacher()){
  if(viewingPublished){db=localPlannerDb;viewingPublished=false;}
  localPlannerDb=db;
 }else if(acceptedFeed){
  if(!viewingPublished)localPlannerDb=db;
  if(activePublicFeed!==acceptedFeed){db=C.clone(acceptedFeed.data);activePublicFeed=acceptedFeed;}
  else if(!viewingPublished)db=C.clone(acceptedFeed.data);
  viewingPublished=true;
 }
}
function showScheduleUpdate(){
 const host=document.getElementById('schedule-update');if(!host)return;
 if(!pendingFeed||isTeacher()){host.hidden=true;return;}
 const w=StudentFeed.changedWeek(acceptedFeed,pendingFeed,todayVN());
 const short=s=>s.slice(8,10)+'/'+s.slice(5,7);
 host.hidden=false;host.innerHTML=`<p><b>Có lịch mới${w?' tuần '+short(w.start)+' – '+short(C.addDays(w.start,6)):''}.</b> Cập nhật để xem lịch vừa phát hành.</p><button class="button small" id="accept-schedule">Cập nhật lịch</button>`;
 document.getElementById('accept-schedule').onclick=()=>{
  if(isTeacher()||!pendingFeed)return;
  const target=StudentFeed.changedWeek(acceptedFeed,pendingFeed,todayVN());
  acceptedFeed=pendingFeed;pendingFeed=null;
  let stored=true;try{localStorage.setItem(studentFeedKey,JSON.stringify(acceptedFeed))}catch{stored=false;}
  query='';teacherFilter='';classFilter='';tab='calendar';if(target)weekId=target.id;
  init();showScheduleUpdate();toast(stored?'Đã cập nhật lịch mới.':'Đã mở lịch mới; máy chưa lưu được bản xem ngoại tuyến.');
 };
}
async function checkStudentSchedule(manual=false){
 if(feedBusy)return;feedBusy=true;
 try{
  const response=await fetch(new URL('published-schedule.json',location.href),{cache:'no-store',signal:AbortSignal.timeout(12000)});
  if(!response.ok)throw Error('Chưa lấy được lịch đã phát hành.');
  const body=await response.text();if(body.length>10*1024*1024)throw Error('Tệp lịch quá lớn.');
  const feed=StudentFeed.validate(JSON.parse(body));
  if(C.studentWeeks(feed.data,todayVN()).every(w=>w.placeholder)){if(manual)toast('Chưa có lịch học được phát hành cho tuần này và tuần sau.');return;}
  if(!acceptedFeed||StudentFeed.signature(feed)!==StudentFeed.signature(acceptedFeed))pendingFeed=feed;
  else{pendingFeed=null;if(manual)toast('Bạn đang xem lịch mới nhất đã phát hành.');}
  showScheduleUpdate();
 }catch{if(manual)toast(navigator.onLine?'Chưa kiểm tra được lịch mới. Bạn vẫn có thể xem lịch đã tải.':'Đang ngoại tuyến. Bạn vẫn xem được lịch đã tải.');}
 finally{feedBusy=false;}
}
function exportStudentSchedule(){
 if(!requireTeacher())return;
 try{const feed=StudentFeed.create(db,todayVN());download('published-schedule.json',JSON.stringify(feed,null,2));toast('Đã xuất lịch học viên. Đưa published-schedule.json lên cùng thư mục index.html trên GitHub để phát hành.');}catch(e){toast(e.message);}
}
