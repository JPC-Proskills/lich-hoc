/* Public student snapshots are deliberately separate from editable planner backups. */
(function(root){
 'use strict';
 const C=typeof module!=='undefined'?require('./core.js'):root.ScheduleCore;
 const S=typeof module!=='undefined'?require('./student-core.js'):root.StudentCore;
 const FORMAT='proskills-student-schedule-v1';
 const pick=(x,keys)=>Object.fromEntries(keys.filter(k=>x[k]!==undefined).map(k=>[k,C.clone(x[k])]));
 function create(db,weekId,publishedAt=new Date().toISOString()){
  C.validate(db);
  const selected=db.weeks.find(w=>w.id===weekId);
  if(!selected)throw Error('Hãy chọn tuần hiển thị cho học viên trước khi phát hành.');
  const weeks=[selected].map(w=>({...pick(w,['id','start','updatedAt']),entries:w.entries.filter(e=>e.status!=='cancelled').map(e=>pick(e,['id','day','start','end','classId','teacherId','room','campus','roomId','lessonId','lessonOffset','title','status','demo','suggested','needsReview'])),greetings:(w.greetings||[]).map(g=>({...pick(g,['id','day','startTime','endTime','teacherId','campus']),note:'',rotate:false,rotationTeacherIds:[]}))}));
  const data={schemaVersion:1,...pick(db,['updatedAt','rosterVersion']),programs:db.programs.map(p=>({...pick(p,['id','name','color']),lessons:p.lessons.map(l=>pick(l,['id','title','periods','section']))})),teachers:db.teachers.map(t=>pick(t,['id','name','active','color'])),classes:db.classes.map(c=>pick(c,['id','name','active','programId','baseline'])),rooms:(db.rooms||[]).map(r=>pick(r,['id','name','campus','active'])),weeks};
  const feed={format:FORMAT,publishedAt,visibleWeekId:selected.id,data,estimates:S.estimates(db,selected)};validate(feed);return feed;
 }
 function validate(feed){
  const invalid=()=>{throw Error('Tệp lịch học viên không hợp lệ.');};
  if(!feed||feed.format!==FORMAT||typeof feed.publishedAt!=='string'||!Number.isFinite(Date.parse(feed.publishedAt)))invalid();
  C.validate(feed.data);
  if(feed.visibleWeekId===undefined)return feed; // Read the older published format during rollout.
  if(feed.data.weeks.length!==1||feed.data.weeks[0].id!==feed.visibleWeekId||!Array.isArray(feed.estimates))invalid();
  const classes=new Map(feed.data.classes.map(item=>[item.id,item]));
  const teachers=new Set(feed.data.teachers.map(item=>item.id));
  const programs=new Map(feed.data.programs.map(item=>[item.id,new Set(item.lessons.map(lesson=>lesson.id))]));
  for(const item of feed.estimates){
   if(!item||!Number.isInteger(item.offset)||item.offset<1||item.offset>4||!classes.has(item.classId))invalid();
   const lessons=programs.get(classes.get(item.classId).programId);
   if(item.topics!==undefined){
    if(!Array.isArray(item.topics)||!item.topics.length||!item.topics.every(id=>lessons?.has(id)))invalid();
   }else if(!lessons?.has(item.lessonId)||!teachers.has(item.teacherId)||typeof item.campus!=='string')invalid();
  }
  return feed;
 }
 const signature=feed=>JSON.stringify([feed.visibleWeekId,feed.data,feed.estimates]);
 function visibleWeek(feed,today){
  if(!feed)return null;
  if(feed.visibleWeekId)return feed.data.weeks[0];
  const oldWeek=C.studentWeeks(feed.data,today)[0];
  return oldWeek.placeholder?null:oldWeek;
 }
 const api={FORMAT,create,validate,signature,visibleWeek};if(typeof module!=='undefined')module.exports=api;else root.StudentFeed=api;
})(typeof window!=='undefined'?window:globalThis);
