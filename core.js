(function(root){
'use strict';
const clone=x=>JSON.parse(JSON.stringify(x));
const uid=()=>globalThis.crypto?.randomUUID?.()||'id-'+Date.now()+'-'+Math.random().toString(36).slice(2);
const PROGRAM_COLORS=[{name:'Clay',value:'#D97757'},{name:'Sky',value:'#6A9BCC'},{name:'Olive',value:'#788C5D'},{name:'Fig',value:'#C46686'},{name:'Heather',value:'#CBCADB'},{name:'Cactus',value:'#BCD1CA'},{name:'Coral',value:'#EBCECE'},{name:'Kraft',value:'#D4A27F'},{name:'Manilla',value:'#EBDBBC'},{name:'Slate',value:'#666663'}];
function addDays(s,n){const d=new Date(s+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)}
function studentWeeks(db,today){const d=new Date(today+'T12:00:00Z'),monday=addDays(today,-((d.getUTCDay()+6)%7)),current=db.weeks.find(w=>w.start===monday)||{id:'empty-'+monday,start:monday,entries:[],placeholder:true},next=db.weeks.find(w=>w.start===addDays(monday,7));return next?[current,next]:[current]}
function makeupSessions(db,weeks,{today,teacherText='',topic='',programId=''}={}){const normalize=s=>String(s).normalize('NFD').replace(/\p{Diacritic}/gu,'').replace(/[đĐ]/g,'d').toLowerCase().trim();return weeks.flatMap(w=>w.entries.map(e=>({...e,weekId:w.id,date:addDays(w.start,e.day)}))).filter(e=>e.status==='planned'&&(!today||e.date>=today)&&(!programId||db.classes.find(c=>c.id===e.classId)?.programId===programId)&&(!teacherText||normalize(db.teachers.find(t=>t.id===e.teacherId)?.name).includes(normalize(teacherText)))&&(!topic||normalize(e.title).includes(normalize(topic)))).sort((a,b)=>a.date.localeCompare(b.date)||a.start-b.start)}
function offsets(p){let n=0;return p.lessons.map(l=>{const x={...l,offset:n};n+=l.periods;return x})}
function progress(db,cls,through,mode='planned'){
 const p=db.programs.find(p=>p.id===cls.programId);if(!p)return 0;
 const ls=offsets(p);let n=cls.baseline||0;
 for(const w of db.weeks.filter(w=>w.start<=through))for(const e of w.entries){
  if(e.classId!==cls.id||e.status==='cancelled'||(mode==='done'&&e.status!=='done'))continue;
  const l=ls.find(l=>l.id===e.lessonId);if(l)n=Math.max(n,l.offset+Math.min(l.periods,(e.lessonOffset||0)+e.end-e.start+1));
 }return n;
}
function nextWeek(db,source,date,{copy=true,advance=true,mode='planned',rotateGreetings=true}={}){
 if(db.weeks.some(w=>w.start===date))throw Error('Tuần này đã tồn tại. Hãy chọn tuần khác.');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date+'T12:00:00Z').toISOString().slice(0,10)!==date||new Date(date+'T12:00:00Z').getUTCDay()!==1)throw Error('Ngày bắt đầu phải là ngày hợp lệ và là Thứ 2.');
 if(date<=source.start)throw Error('Tuần mới phải sau tuần nguồn.');
 const week={id:uid(),start:date,name:'Tuần '+date,entries:[],greetings:[]};let advanced=0,review=0,finished=0;
 if(!copy)return {week,advanced,review,finished};
 const cursors={};
 for(const e of [...source.entries].sort((a,b)=>a.day-b.day||a.start-b.start)){
  const cls=db.classes.find(c=>c.id===e.classId);if(!cls?.active||e.status==='cancelled')continue;
  const p=db.programs.find(p=>p.id===cls.programId);
  if(!advance||!p||!e.lessonId){week.entries.push({...clone(e),id:uid(),status:'planned',suggested:!!advance,needsReview:!!advance,source:undefined});if(advance)review++;continue}
  if(cursors[cls.id]===undefined)cursors[cls.id]=progress(db,cls,source.start,mode);
  const ls=offsets(p);let start=e.start;
  while(start<=e.end){
   const n=cursors[cls.id],l=ls.find(l=>n>=l.offset&&n<l.offset+l.periods);
   if(!l){finished++;break}
   const count=Math.min(e.end-start+1,l.offset+l.periods-n);
   week.entries.push({...clone(e),id:uid(),start,end:start+count-1,lessonId:l.id,lessonOffset:n-l.offset,title:l.title,status:'planned',suggested:true,needsReview:false,source:undefined});
   cursors[cls.id]+=count;start+=count;advanced++;
  }
 }
 for(const e of week.entries)if(e.roomId&&db.rooms?.some(r=>r.id===e.roomId&&!r.active)){if(!e.needsReview)review++;e.needsReview=true;}
 week.greetings=rotateDuties(db,source.greetings||[],rotateGreetings);
 return {week,advanced,review,finished};
}
function rotateDuties(db,greetings,rotate=true){const used=new Map();return [...greetings].sort((a,b)=>a.startTime.localeCompare(b.startTime)).map(g=>{let teacherId=g.teacherId;const pool=(g.rotationTeacherIds||[]).filter(id=>db.teachers.some(t=>t.id===id&&t.active));if(rotate&&g.rotate&&pool.length){const next=(pool.indexOf(g.teacherId)+1)%pool.length;const sequence=pool.slice(next).concat(pool.slice(0,next));teacherId=sequence.find(id=>!used.get(g.campus)?.has(id))||sequence[0]}if(!used.has(g.campus))used.set(g.campus,new Set());const needsReview=used.get(g.campus).has(teacherId)||!db.teachers.some(t=>t.id===teacherId&&t.active);used.get(g.campus).add(teacherId);return {...clone(g),id:uid(),teacherId,needsReview}})}
function greetingConflicts(greetings,candidate){return greetings.some(g=>g.id!==candidate.id&&g.day===candidate.day&&((g.startTime===candidate.startTime&&(g.campus===candidate.campus||g.teacherId===candidate.teacherId))||(g.campus===candidate.campus&&g.teacherId===candidate.teacherId)))}
function conflicts(entries){const out=[];for(let i=0;i<entries.length;i++)for(let j=i+1;j<entries.length;j++){
 const a=entries[i],b=entries[j];if(a.status==='cancelled'||b.status==='cancelled'||a.day!==b.day||a.end<b.start||b.end<a.start)continue;
 const kinds=[];if(a.teacherId===b.teacherId)kinds.push('giáo viên');if(a.classId===b.classId)kinds.push('lớp');
 if(a.room&&a.campus&&a.room.trim().toLocaleLowerCase()===b.room.trim().toLocaleLowerCase()&&a.campus===b.campus)kinds.push('phòng');
 if(kinds.length)out.push({a:a.id,b:b.id,kinds});
}return out}
function workload(entries,teacherId){const days=Array.from({length:7},()=>({day:0,night:0}));for(const e of entries){if(e.teacherId!==teacherId||e.status==='cancelled')continue;for(let p=e.start;p<=e.end;p++)days[e.day][p<=8?'day':'night']++}return {days,day:days.reduce((n,d)=>n+d.day,0),night:days.reduce((n,d)=>n+d.night,0)}}
const roomKey=(name,campus)=>[campus,name].map(x=>x.trim().toLocaleLowerCase().replace(/\s+/g,' ')).join('|');
function ensureRooms(db){
 db.rooms??=[];
 for(const w of db.weeks)for(const e of w.entries){
  if(!e.room.trim()||!['AB1','AB2','Âu Cơ'].includes(e.campus))continue;
  let r=db.rooms.find(r=>r.id===e.roomId)||db.rooms.find(r=>roomKey(r.name,r.campus)===roomKey(e.room,e.campus));
  if(!r){r={id:'room-'+encodeURIComponent(roomKey(e.room,e.campus)),name:e.room.trim(),campus:e.campus,active:true};db.rooms.push(r)}
  e.roomId=r.id;e.room=r.name;e.campus=r.campus;
 }return db.rooms;
}
function updateRoom(db,value){
 const name=value.name.trim(),campus=value.campus;
 if(!name||!['AB1','AB2','Âu Cơ'].includes(campus))throw Error('Nhập tên phòng và chọn cơ sở hợp lệ.');
 if(db.rooms.some(r=>r.id!==value.id&&roomKey(r.name,r.campus)===roomKey(name,campus)))throw Error('Phòng này đã có tại cơ sở đang chọn.');
 const old=db.rooms.find(r=>r.id===value.id),uses=old?db.weeks.flatMap(w=>w.entries).filter(e=>e.roomId===old.id||roomKey(e.room,e.campus)===roomKey(old.name,old.campus)):[];
 if(old&&old.campus!==campus&&uses.length)throw Error('Phòng đã có trong lịch. Hãy tạo phòng mới ở cơ sở khác để giữ đúng lịch cũ.');
 const r={id:value.id||uid(),name,campus,active:!!value.active};if(old)Object.assign(old,r);else db.rooms.push(r);
 for(const e of uses){e.roomId=r.id;e.room=r.name;e.campus=r.campus}return r;
}
function ensureGreetings(db,seed){for(const w of db.weeks){if(w.greetings!==undefined)continue;const source=seed.weeks.find(x=>x.start===w.start&&x.name===w.name);w.greetings=source?clone(source.greetings||[]):[];for(const g of w.greetings){for(const id of [g.teacherId,...g.rotationTeacherIds])if(!db.teachers.some(t=>t.id===id)){const t=seed.teachers.find(t=>t.id===id);if(t)db.teachers.push(clone(t));}}}return db}
function ensureTeacherColors(db){const used=new Set(db.teachers.map(t=>t.color).filter(Boolean));for(const t of db.teachers){if(PROGRAM_COLORS.some(c=>c.value===t.color))continue;t.color=PROGRAM_COLORS.find(c=>!used.has(c.value))?.value||PROGRAM_COLORS[db.teachers.indexOf(t)%PROGRAM_COLORS.length].value;used.add(t.color)}return db}
function ensureRoster(db){if(db.rosterVersion>=1)return db;const base=s=>s.toLocaleLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'').replace(/[đĐ]/g,'d').replace(/^(co|thay)\s+/,'').trim();for(const [name,id,gdtc] of [['Cô Nguyễn Trang','staff-nguyen-trang',true],['Cô Lê Uyên','staff-le-uyen',true],['Thầy Vi San','staff-vi-san',true],['Thầy Trung Hiếu','staff-trung-hieu',true],['Cô Xuân Thủy','staff-xuan-thuy',false]]){let t=db.teachers.find(t=>base(t.name)===base(name));if(t)t.name=name;else{t={id,name,active:true};db.teachers.push(t)}if(gdtc)t.specialties=[...new Set([...(t.specialties||[]),'GDTC'])]}db.rosterVersion=1;return db}
function validate(db){
 const fail=()=>{throw Error('Tệp sao lưu không đúng cấu trúc hoặc có dữ liệu lịch không hợp lệ.')};
 if(!db||db.schemaVersion!==1||!['programs','teachers','classes','weeks'].every(k=>Array.isArray(db[k]))||!db.weeks.length||!db.programs.length)fail();
 const unique=a=>new Set(a.map(x=>x.id)).size===a.length&&a.every(x=>typeof x.id==='string');
 if(![db.programs,db.teachers,db.classes,db.weeks].every(unique))fail();
 const ids=a=>new Set(a.map(x=>x.id)),cs=ids(db.classes),ts=ids(db.teachers),ps=ids(db.programs),lessons=new Map();
 if(db.rooms!==undefined&&(!Array.isArray(db.rooms)||!unique(db.rooms)||db.rooms.some(r=>typeof r.name!=='string'||!r.name.trim()||!['AB1','AB2','Âu Cơ'].includes(r.campus)||typeof r.active!=='boolean')||new Set(db.rooms.map(r=>roomKey(r.name,r.campus))).size!==db.rooms.length))fail();
 if(db.rooms)for(const w of db.weeks)for(const e of w.entries||[])if(e.roomId&&!db.rooms.some(r=>r.id===e.roomId&&r.name===e.room&&r.campus===e.campus))fail();
 for(const p of db.programs){if(typeof p.name!=='string'||!Array.isArray(p.lessons)||!unique(p.lessons)||(p.color!==undefined&&!PROGRAM_COLORS.some(c=>c.value===p.color)))fail();for(const l of p.lessons){if(typeof l.title!=='string'||!Number.isInteger(l.periods)||l.periods<1||l.periods>200||lessons.has(l.id))fail();lessons.set(l.id,p.id)}}
 for(const c of db.classes)if(typeof c.name!=='string'||typeof c.active!=='boolean'||(c.programId&&!ps.has(c.programId))||!Number.isInteger(c.baseline)||c.baseline<0)fail();
 for(const t of db.teachers)if(typeof t.name!=='string'||typeof t.active!=='boolean'||(t.color!==undefined&&!PROGRAM_COLORS.some(c=>c.value===t.color)))fail();
 const dates=new Set();for(const w of db.weeks){if(!/^\d{4}-\d{2}-\d{2}$/.test(w.start)||!Number.isFinite(Date.parse(w.start))||new Date(w.start+'T12:00:00Z').toISOString().slice(0,10)!==w.start||new Date(w.start+'T12:00:00Z').getUTCDay()!==1||dates.has(w.start)||!Array.isArray(w.entries)||!unique(w.entries))fail();dates.add(w.start);
 if(w.greetings!==undefined&&(!Array.isArray(w.greetings)||!unique(w.greetings)||w.greetings.some(g=>g.day!==4||!ts.has(g.teacherId)||!['AB1','AB2','Âu Cơ'].includes(g.campus)||!((g.startTime==='07:30'&&g.endTime==='07:45')||(g.startTime==='12:45'&&g.endTime==='13:00'))||typeof g.note!=='string'||typeof g.rotate!=='boolean'||!Array.isArray(g.rotationTeacherIds)||g.rotationTeacherIds.some(id=>!ts.has(id))||new Set(g.rotationTeacherIds).size!==g.rotationTeacherIds.length)))fail();
 for(const e of w.entries){const c=db.classes.find(c=>c.id===e.classId);if(!cs.has(e.classId)||!ts.has(e.teacherId)||!Number.isInteger(e.day)||e.day<0||e.day>6||!Number.isInteger(e.start)||!Number.isInteger(e.end)||e.start<1||e.end>12||e.end<e.start||!['planned','done','cancelled'].includes(e.status)||!['title','room','campus'].every(k=>typeof e[k]==='string')||(e.lessonId&&lessons.get(e.lessonId)!==c.programId)||e.lessonOffset!==undefined&&(!Number.isInteger(e.lessonOffset)||e.lessonOffset<0))fail();}
 }return true;
}
const api={clone,uid,addDays,offsets,progress,nextWeek,conflicts,workload,validate,roomKey,ensureRooms,updateRoom,studentWeeks,makeupSessions,rotateDuties,greetingConflicts,PROGRAM_COLORS,ensureGreetings,ensureTeacherColors,ensureRoster};if(typeof module!=='undefined')module.exports=api;else root.ScheduleCore=api;
})(typeof window!=='undefined'?window:globalThis);
