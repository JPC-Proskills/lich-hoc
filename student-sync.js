/* Keep the locally editable planner separate from the student snapshot. */
const studentScope=new URL('./',location.href).pathname;
const studentFeedKey='proskills-public-feed:'+studentScope;
let acceptedFeed=null,localPlannerDb=null,viewingPublished=false,activePublicFeed=null,feedRequest=null;
try{
 const cached=localStorage.getItem(studentFeedKey);
 if(cached)acceptedFeed=StudentFeed.validate(JSON.parse(cached));
}catch{}
function syncScheduleRole(){
 if(isTeacher()){
  if(viewingPublished){db=localPlannerDb;viewingPublished=false;}
  localPlannerDb=db;
  return;
 }
 if(!viewingPublished)localPlannerDb=db;
 if(!viewingPublished||activePublicFeed!==acceptedFeed)db=C.clone(acceptedFeed?.data||SEED);
 activePublicFeed=acceptedFeed;
 viewingPublished=true;
}
function publicWeek(){
 return StudentFeed.visibleWeek(acceptedFeed,todayVN())||{
  ...C.studentWeeks({weeks:[]},todayVN())[0],entries:[],greetings:[]
 };
}
function publicUpdateText(){
 const visible=StudentFeed.visibleWeek(acceptedFeed,todayVN());
 return visible?'Lịch dạy hiện tại cập nhật đến tuần '+StudentCore.weekLabel(visible.start):'Chưa có lịch học được phát hành.';
}
async function fetchStudentSchedule(){
 const response=await fetch(new URL('published-schedule.json',location.href),{cache:'no-store',signal:AbortSignal.timeout(12000)});
 if(!response.ok)throw Error('Chưa lấy được lịch đã phát hành.');
 const body=await response.text();
 if(body.length>10*1024*1024)throw Error('Tệp lịch quá lớn.');
 const feed=StudentFeed.validate(JSON.parse(body));
 if(acceptedFeed&&Date.parse(feed.publishedAt)<Date.parse(acceptedFeed.publishedAt))return false;
 if(acceptedFeed&&StudentFeed.signature(feed)===StudentFeed.signature(acceptedFeed)&&feed.publishedAt===acceptedFeed.publishedAt)return false;
 const replacing=Boolean(acceptedFeed);
 acceptedFeed=feed;
 try{localStorage.setItem(studentFeedKey,JSON.stringify(feed));}catch{}
 if(!isTeacher()){
  const oldWeek=weekId;
  if(publicWeek().id!==oldWeek)resetStudentSearch();
  if($('#dialog').open&&$('#dialog-body .lesson-sheet'))close();
  init();
 }
 return replacing;
}
async function checkStudentSchedule(manual=false){
 try{
  feedRequest??=fetchStudentSchedule().finally(()=>{feedRequest=null;});
  const changed=await feedRequest;
  if(manual||changed&&!isTeacher()&&StudentFeed.visibleWeek(acceptedFeed,todayVN()))toast(publicUpdateText());
 }catch{
  if(manual)toast(navigator.onLine?'Chưa kiểm tra được cập nhật. Bạn vẫn có thể xem lịch đã tải.':'Đang ngoại tuyến. Bạn vẫn xem được lịch đã tải.');
 }
}
function setStudentWeek(){
 if(!requireTeacher())return;
 const previous=db.visibleWeekId;
 db.visibleWeekId=weekId;
 if(!save()){if(previous===undefined)delete db.visibleWeekId;else db.visibleWeekId=previous;return;}
 init();
 toast('Đã chọn tuần '+StudentCore.weekLabel(week().start)+'. Tải tệp lịch để phát hành.');
}
function exportStudentSchedule(){
 if(!requireTeacher())return;
 try{
  const feed=StudentFeed.create(db,db.visibleWeekId);
  download('published-schedule.json',JSON.stringify(feed,null,2));
  toast('Đã tải tệp lịch. Đưa published-schedule.json lên GitHub để học viên nhận lịch.');
 }catch(error){toast(error.message);}
}
