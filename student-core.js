/* Student search and estimates only use the approved week and curriculum. */
(function(root){
 'use strict';
 const C=typeof module==='undefined'?root.ScheduleCore:require('./core.js');
 const normalize=value=>String(value??'').normalize('NFD').replace(/\p{Diacritic}/gu,'').replace(/[đĐ]/g,'d').toLowerCase();
 const matches=(value,input)=>normalize(input).trim().split(/\s+/).every(word=>normalize(value).includes(word));
 const firstLine=value=>String(value??'').split(/\r?\n/).find(line=>line.trim())?.trim()||'';
 const weekLabel=start=>[start,C.addDays(start,6)].map(date=>date.slice(8,10)+'.'+date.slice(5,7)).join('-');
 const byTime=(a,b)=>a.day-b.day||a.start-b.start||a.end-b.end;
 const audienceNames=['Thực tập sinh','Thực tập sinh Kaigo','Kỹ sư','Lưu học sinh','Đặc định kỹ năng','Ikuse Shuro'];
 const audienceIds=['tts','tts kaigo','ks','lhs','ddkn','ikuse'];
 function audience(program,className){
  const name=normalize(program?.name).replace(/[^a-z0-9]+/g,' ').trim();
  const id=normalize(program?.id).replace(/[^a-z0-9]+/g,' ').trim();
  for(let i=audienceNames.length-1;i>=0;i--){
   const label=normalize(audienceNames[i]);
   if(name===label||name.startsWith(label+' ')||id===audienceIds[i])return audienceNames[i];
  }
  const classCode=normalize(className);
  const codeMatches=[/\btts(?=[\s-]*\d|\b)/,/\bkaigo\b/,/\bks(?=[\s-]*\d|\b)/,
   /\blhs(?=[\s-]*\d|\b)/,/\bddkn(?=[\s-]*\d|\b)/,/\bikuse\b/];
  const match=codeMatches.findLastIndex(pattern=>pattern.test(classCode));
  return program?.name?.split(' · ')[0]||audienceNames[match]||'';
 }
 const campus=value=>({'AB1':'Ấp Bắc 1','AB2':'Ấp Bắc 2'})[value]||value||'';
 function filter(rows,fields,mode,valuesFor){
  const used=Object.entries(fields).filter(([,values])=>values.length);
  if(!used.length)return rows;
  return rows.filter(row=>{
   const values=valuesFor(row);
   const check=([key,selected])=>selected.some(value=>values[key].includes(value));
   return mode==='or'?used.some(check):used.every(check);
  });
 }
 function estimates(db,week){
  const original=week.entries.filter(entry=>entry.status!=='cancelled'&&entry.lessonId).sort(byTime);
  const upcoming=[];
  for(const cls of db.classes.filter(item=>item.active)){
   const program=db.programs.find(item=>item.id===cls.programId);
   const slots=original.filter(entry=>entry.classId===cls.id);
   if(!program||!slots.length)continue;
   const lessons=C.offsets(program);
   const progress=C.progress(db,cls,week.start);
   let cursor=progress;
   for(let offset=1;offset<=4;offset++){
    for(const slot of slots){
     let remaining=slot.end-slot.start+1;
     const topics=[];
     while(remaining>0){
      const lesson=lessons.find(item=>cursor>=item.offset&&cursor<item.offset+item.periods);
      if(!lesson)break;
      const length=Math.min(remaining,lesson.offset+lesson.periods-cursor);
      if(lesson.offset>=progress)upcoming.push({
       offset,classId:cls.id,teacherId:slot.teacherId,campus:slot.campus,lessonId:lesson.id
      });
      topics.push(lesson.id);
      cursor+=length;
      remaining-=length;
     }
     if(topics.length)upcoming.push({offset,classId:cls.id,topics});
    }
   }
  }
  return upcoming;
 }
 function nextTopics(week,entry,upcoming){
  const later=week.entries.filter(item=>item.classId===entry.classId&&item.status!=='cancelled'&&
   (item.day>entry.day||item.day===entry.day&&item.start>entry.end)).sort(byTime);
  return [...later.map(item=>firstLine(item.title)),
   ...upcoming.filter(item=>item.classId===entry.classId&&item.topics).map(item=>item.topics)
  ].filter(Boolean).slice(0,2);
 }
 function calendarFile({id,date,start,end,title,location,description},now=new Date()){
  const safe=value=>String(value??'').replace(/\\/g,'\\\\').replace(/\r\n|\n|\r/g,'\\n').replace(/[;,]/g,'\\$&');
  const stamp=time=>new Date(date+'T'+time+':00+07:00').toISOString().replace(/[-:]|\.\d{3}/g,'');
  const encoder=new TextEncoder();
  function fold(line){
   const parts=[];let part='',bytes=0;
   for(const char of line){
    const size=encoder.encode(char).length;
    if(bytes+size>75){parts.push(part);part=' ';bytes=1;}
    part+=char;bytes+=size;
   }
   return [...parts,part].join('\r\n');
  }
  return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Proskills//Lich hoc//VI','CALSCALE:GREGORIAN',
   'BEGIN:VEVENT','UID:'+safe(id)+'@proskills','DTSTAMP:'+now.toISOString().replace(/[-:]|\.\d{3}/g,''),
   'DTSTART:'+stamp(start),'DTEND:'+stamp(end),'SUMMARY:'+safe(title),'LOCATION:'+safe(location),
   'DESCRIPTION:'+safe(description),'END:VEVENT','END:VCALENDAR',''].map(fold).join('\r\n');
 }
 const api={matches,firstLine,weekLabel,byTime,audience,campus,filter,estimates,nextTopics,calendarFile};
 if(typeof module==='undefined')root.StudentCore=api;else module.exports=api;
})(typeof window==='undefined'?globalThis:window);
