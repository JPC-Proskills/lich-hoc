/* Public student snapshots are deliberately separate from editable planner backups. */
(function(root){
 'use strict';
 const C=typeof module!=='undefined'?require('./core.js'):root.ScheduleCore;
 const FORMAT='proskills-student-schedule-v1';
 const pick=(x,keys)=>Object.fromEntries(keys.filter(k=>x[k]!==undefined).map(k=>[k,C.clone(x[k])]));
 function create(db,today,publishedAt=new Date().toISOString()){
  C.validate(db);
  const weeks=C.studentWeeks(db,today).filter(w=>!w.placeholder).map(w=>({...pick(w,['id','start','updatedAt']),entries:w.entries.filter(e=>e.status!=='cancelled').map(e=>pick(e,['id','day','start','end','classId','teacherId','room','campus','roomId','lessonId','lessonOffset','title','status','demo','suggested','needsReview'])),greetings:(w.greetings||[]).map(g=>({...pick(g,['id','day','startTime','endTime','teacherId','campus']),note:'',rotate:false,rotationTeacherIds:[]}))}));
  if(!weeks.length)throw Error('Chưa có lịch tuần này hoặc tuần sau để phát hành.');
  const data={schemaVersion:1,...pick(db,['updatedAt','rosterVersion']),programs:db.programs.map(p=>({...pick(p,['id','name','color']),lessons:p.lessons.map(l=>pick(l,['id','title','periods','section']))})),teachers:db.teachers.map(t=>pick(t,['id','name','active','color'])),classes:db.classes.map(c=>pick(c,['id','name','active','programId','baseline'])),rooms:(db.rooms||[]).map(r=>pick(r,['id','name','campus','active'])),weeks};
  const feed={format:FORMAT,publishedAt,data};validate(feed);return feed;
 }
 function validate(feed){if(!feed||feed.format!==FORMAT||typeof feed.publishedAt!=='string'||!Number.isFinite(Date.parse(feed.publishedAt)))throw Error('Tệp lịch học viên không hợp lệ.');C.validate(feed.data);return feed;}
 const signature=feed=>JSON.stringify(feed.data);
 function changedWeek(previous,next,today){
  const current=C.studentWeeks(next.data,today).filter(w=>!w.placeholder);
  return current.find(w=>JSON.stringify(w)!==JSON.stringify(previous?.data.weeks.find(p=>p.start===w.start)))||current[0]||null;
 }
 const api={FORMAT,create,validate,signature,changedWeek};if(typeof module!=='undefined')module.exports=api;else root.StudentFeed=api;
})(typeof window!=='undefined'?window:globalThis);
