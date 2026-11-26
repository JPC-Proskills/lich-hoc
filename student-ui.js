/* Published schedule views, multi-select search and lesson details. */
const STUDENT_FIELDS=[
 ['classes','Lớp học','Ví dụ E696 hoặc 696'],
 ['topics','Chuyên đề','Nhập tên chuyên đề'],
 ['teachers','Giáo viên','Nhập tên giáo viên'],
 ['audiences','Đối tượng đào tạo','Nhập đối tượng đào tạo'],
 ['campuses','Cơ sở','Nhập tên cơ sở'],
 ['periods','Tiết học','Nhập số tiết']
];
const STUDENT_GROUPS=[['time','Ngày giờ'],['teacher','Giáo viên'],['class','Lớp'],['campus','Cơ sở'],['audience','Đối tượng đào tạo']];
const studentOrder=new Intl.Collator('vi',{numeric:true,sensitivity:'base'});
let studentGroup='time',studentAdvanced=false,studentDraft={},studentApplied=null,studentJoin='and';
const blankStudentFields=()=>Object.fromEntries(STUDENT_FIELDS.map(([key])=>[key,[]]));
function resetStudentSearch(){
 studentGroup='time';
 studentAdvanced=false;
 studentDraft=blankStudentFields();
 studentApplied=null;
 studentJoin='and';
}
resetStudentSearch();

const roomLabel=value=>!value?'Chưa cập nhật':/^phòng\b/i.test(value)?value:'Phòng '+value;
function locationLabel(entry){
 return [StudentCore.campus(entry.campus),entry.room&&roomLabel(entry.room)].filter(Boolean).join(' · ')||'Chưa cập nhật địa điểm';
}
function studentRows(){
 return week().entries.filter(row=>row.status!=='cancelled').map(row=>({
  ...row,weekId,date:C.addDays(week().start,row.day)
 })).sort(StudentCore.byTime);
}
const topicText=row=>lesson(row.lessonId)?.title||row.title;
const classAudience=item=>StudentCore.audience(program(item?.programId),item?.name);
const rowAudience=row=>classAudience(cls(row.classId));
const topicKey=row=>row.lessonId||'title:'+row.title.trim();
function studentValues(row){
 const periods=Array.from({length:row.end-row.start+1},(_,i)=>String(row.start+i));
 if(row.start!==row.end)periods.push(row.start+'-'+row.end);
 return {classes:[row.classId],topics:[topicKey(row)],teachers:[row.teacherId],
  audiences:[rowAudience(row)],campuses:[StudentCore.campus(row.campus)],periods};
}
function studentChoices(rows){
 const choices=Object.fromEntries(STUDENT_FIELDS.map(([key])=>[key,new Map()]));
 for(const row of rows){
  const values=studentValues(row);
  const labels={
   classes:cls(row.classId)?.name,topics:StudentCore.firstLine(topicText(row)),
   teachers:teacher(row.teacherId)?.name
  };
  for(const [key,keys] of Object.entries(values)){
   for(const value of keys){
    const label=labels[key]??(key==='periods'?'Tiết '+value:value);
    if(value&&label){
     const previous=choices[key].get(value)?.search;
     const search=key==='topics'?new Set([...(previous||[]),topicText(row),row.title]):[label];
     const option={value,label,search};
     choices[key].set(value,option);
    }
   }
  }
 }
 return choices;
}
function studentField([key,label,hint],choices){
 return `<div class="student-field" data-student-field="${key}">
  <label for="student-${key}">${key==='classes'?'Bạn học lớp nào?':label}</label>
  <div class="student-field-chips">${(studentDraft[key]||[]).map(value=>{
   const option=choices[key].get(value);
   return option?`<button type="button" class="student-chip" data-remove="${esc(value)}" aria-label="Bỏ ${esc(option.label)}">${esc(option.label)} ${icon('close')}</button>`:'';
  }).join('')}</div>
  <input id="student-${key}" type="text" autocomplete="off" role="combobox" aria-autocomplete="list"
   aria-controls="student-options-${key}" aria-expanded="false" placeholder="${hint}">
  <div id="student-options-${key}" class="student-options" role="listbox" hidden></div>
 </div>`;
}
function studentSearchPage(rows){
 const choices=studentChoices(rows);
 const results=studentApplied&&StudentCore.filter(rows,studentApplied.fields,studentApplied.mode,studentValues);
 return `<form class="student-search panel" id="student-search">
  ${studentField(STUDENT_FIELDS[0],choices)}
  <details class="advanced-search" ${studentAdvanced?'open':''}>
   <summary>${icon('tune')} Tìm kiếm nâng cao</summary>
   <div class="advanced-fields">${STUDENT_FIELDS.slice(1).map(field=>studentField(field,choices)).join('')}</div>
   <fieldset class="student-match"><legend>Điều kiện tìm</legend>
    <label><input type="radio" name="student-join" value="and" ${studentJoin==='and'?'checked':''}> Và</label>
    <label><input type="radio" name="student-join" value="or" ${studentJoin==='or'?'checked':''}> Hoặc</label>
   </fieldset>
  </details>
  <div class="student-search-actions"><button class="button primary" type="submit">${icon('search')} Tra cứu</button>
   ${studentApplied?'<button class="button" id="clear-student-search" type="button">Xóa bộ lọc</button>':''}</div>
 </form>${results?`<section class="panel student-results"><h2>Kết quả tra cứu <small>${results.length} buổi</small></h2>
  ${studentSchedule(results,'time','Chưa có buổi học phù hợp trong tuần đang xem.')}</section>${studentForecast()}`:''}`;
}
function wireStudentSearch(rows){
 const form=$('#student-search'),choices=studentChoices(rows);
 form.querySelector('summary').onclick=()=>rememberNavigation();
 form.querySelector('details').ontoggle=event=>{if(event.currentTarget.isConnected)studentAdvanced=event.currentTarget.open;};
 form.onchange=event=>{if(event.target.name==='student-join')studentJoin=event.target.value;};
 form.onsubmit=event=>{
  event.preventDefault();
  const typed=[...form.querySelectorAll('[role="combobox"]')].filter(input=>input.value.trim());
  const chosenValues=[];
  for(const input of typed){
   const key=input.closest('[data-student-field]').dataset.studentField;
   const available=matchingChoices(key,input.value);
   const exact=available.find(option=>norm(option.label)===norm(input.value.trim()));
   const chosen=exact||(available.length===1?available[0]:null);
   if(!chosen){input.focus();return;}
   chosenValues.push([key,chosen.value]);
  }
  rememberNavigation();
  chosenValues.forEach(([key,value])=>select(key,value));
  studentApplied={fields:C.clone(studentDraft),mode:studentJoin};
  view='list';
  render();
  updateViewControl();
 };
 $('#clear-student-search')?.addEventListener('click',()=>{
  rememberNavigation();
  resetStudentSearch();
  render();
  updateViewControl();
  $('#student-classes').focus();
 });
 function matchingChoices(key,input){
  return [...choices[key].values()].filter(option=>!studentDraft[key].includes(option.value)&&
   StudentCore.matches([...option.search].join(' '),input)).sort((a,b)=>studentOrder.compare(a.label,b.label));
 }
 function refreshField(key){
  const drafts=[...form.querySelectorAll('[role="combobox"]')].filter(input=>input.id!=='student-'+key);
  render();
  for(const input of drafts)$('#'+input.id).value=input.value;
  $('#student-'+key).focus();
 }
 function select(key,value){
  if(!studentDraft[key].includes(value))studentDraft[key].push(value);
 }
 form.querySelectorAll('[data-student-field]').forEach(field=>{
  const key=field.dataset.studentField,input=field.querySelector('input'),menu=field.querySelector('.student-options');
  let available=[],cursor=-1;
  function hide(){
   menu.hidden=true;
   input.setAttribute('aria-expanded','false');
   input.removeAttribute('aria-activedescendant');
  }
  function suggest(){
   if(!input.value.trim()){hide();return;}
   available=matchingChoices(key,input.value);
   cursor=-1;
   menu.innerHTML=available.map((option,i)=>`<div role="option" aria-selected="false" id="${menu.id}-${i}" data-option-index="${i}">${esc(option.label)}</div>`).join('')||
    '<div class="option-empty" role="status">Không có lựa chọn khớp trong tuần này.</div>';
   menu.hidden=false;
   input.setAttribute('aria-expanded','true');
   input.removeAttribute('aria-activedescendant');
  }
  function choose(index){
   select(key,available[index].value);
   refreshField(key);
  }
  field.querySelectorAll('[data-remove]').forEach(button=>button.onclick=()=>{
   studentDraft[key]=studentDraft[key].filter(value=>value!==button.dataset.remove);
   refreshField(key);
  });
  input.oninput=suggest;
  input.onfocus=suggest;
  input.onblur=hide;
  menu.onpointerdown=event=>event.preventDefault();
  menu.onclick=event=>{
   const match=event.target.closest('[data-option-index]');
   if(match)choose(Number(match.dataset.optionIndex));
  };
  input.onkeydown=event=>{
   if(event.isComposing)return;
   if(event.key==='Escape'){hide();return;}
   if(menu.hidden||!available.length)return;
   if(event.key==='Enter'&&cursor>=0){event.preventDefault();choose(cursor);return;}
   if(event.key!=='ArrowDown'&&event.key!=='ArrowUp')return;
   event.preventDefault();
   cursor=(cursor<0?(event.key==='ArrowDown'?0:available.length-1):
    (cursor+(event.key==='ArrowDown'?1:-1)+available.length)%available.length);
   const active=menu.children[cursor];
   [...menu.children].forEach((node,i)=>node.setAttribute('aria-selected',String(i===cursor)));
   input.setAttribute('aria-activedescendant',active.id);
   active.scrollIntoView({block:'nearest'});
  };
 });
}
function studentSchedule(rows,group,empty){
 if(!rows.length)return `<p class="empty">${esc(empty)}</p>`;
 if(view==='grid'&&group==='time')return calendar(rows,new Set());
 const labels={
  time:row=>DAYS[row.day]+' · '+dateLabel(row.date),
  teacher:row=>teacher(row.teacherId)?.name,
  class:row=>cls(row.classId)?.name,
  campus:row=>StudentCore.campus(row.campus),
  audience:row=>rowAudience(row)
 };
 const buckets=new Map();
 for(const row of rows){
  const label=labels[group](row)||'Chưa cập nhật';
  if(!buckets.has(label))buckets.set(label,[]);
  buckets.get(label).push(row);
 }
 const groups=[...buckets];
 if(group!=='time')groups.sort(([a],[b])=>studentOrder.compare(a,b));
 return groups.map(([label,items])=>`<section class="schedule-group"><h3 class="list-day">${esc(label)}</h3>
  ${items.map(row=>listRow(row,undefined,group!=='time')).join('')}</section>`).join('');
}
function renderStudent(){
 const rows=studentRows();
 if(tab==='search'){
  $('#content').innerHTML=studentSearchPage(rows);
  wireStudentSearch(rows);
  return;
 }
 $('#content').innerHTML=`<section class="panel"><div class="student-groups" aria-label="Nhóm lịch theo">
  ${STUDENT_GROUPS.map(([key,label])=>`<button class="button small" data-student-group="${key}" aria-pressed="${studentGroup===key}">${label}</button>`).join('')}
 </div>${studentSchedule(rows,view==='grid'?'time':studentGroup,
  StudentFeed.visibleWeek(acceptedFeed,todayVN())?'Tuần này chưa có buổi học.':'Chưa có lịch học được phát hành.')}</section>${greetingsPanel()}`;
 wireGreetings();
}
function studentForecast(){
 const {fields,mode}=studentApplied;
 if(!fields.topics.length)return '';
 const classAudiences=fields.classes.map(id=>classAudience(cls(id))).filter(Boolean);
 const audiences=fields.audiences.length?fields.audiences:classAudiences;
 const distinct=new Map();
 for(const item of acceptedFeed?.estimates||[]){
  if(!item.lessonId||!fields.topics.includes(item.lessonId))continue;
  const classItem=cls(item.classId),topic=lesson(item.lessonId);
  const audience=classAudience(classItem);
  if(!audiences.includes(audience))continue;
  if(mode==='and'&&(fields.teachers.length&&!fields.teachers.includes(item.teacherId)||
   fields.campuses.length&&!fields.campuses.includes(StudentCore.campus(item.campus))))continue;
  const key=JSON.stringify([item.offset,item.classId,item.lessonId,item.campus,item.teacherId]);
  distinct.set(key,{...item,className:classItem.name,topic:StudentCore.firstLine(topic.title)});
 }
 const forecast=[...distinct.values()].sort((a,b)=>a.offset-b.offset||studentOrder.compare(a.className,b.className));
 return `<section class="panel forecast"><h2>Dự kiến trong 4 tuần tới</h2>
  ${forecast.length?`<p>Lịch dự kiến theo tiến độ của các lớp có thể thay đổi.</p><ul>${forecast.map(item=>
   `<li><strong>${esc(StudentCore.weekLabel(C.addDays(week().start,item.offset*7)))}</strong>
    <div><b>${esc(item.className)}</b><p>${esc(item.topic)}</p>
    <small>${esc([StudentCore.campus(item.campus),teacher(item.teacherId)?.name].filter(Boolean).join(' · '))}</small></div></li>`
  ).join('')}</ul>`:`<p>${audiences.length?'Chưa có lịch dự kiến phù hợp với chuyên đề đã chọn.':'Chọn lớp hoặc đối tượng đào tạo để xem dự kiến học bù.'}</p>`}</section>`;
}
function studentTimeline(w,entry){
 const topics=StudentCore.nextTopics(w,entry,acceptedFeed?.estimates||[]).map(topic=>
  Array.isArray(topic)?topic.map(id=>StudentCore.firstLine(lesson(id)?.title)).filter(Boolean).join(' / '):topic).filter(Boolean);
 if(!topics.length)return '';
 return `<section class="lesson-timeline"><h4>Hai buổi tiếp theo</h4><ol>
  ${topics.map(topic=>`<li>${esc(topic)}</li>`).join('')}</ol></section>`;
}
function addStudentEvent(w,entry){
 const title=(cls(entry.classId)?.name||'Lớp học')+' · '+StudentCore.firstLine(entry.title);
 const body=StudentCore.calendarFile({
  id:w.id+'-'+entry.id,date:C.addDays(w.start,entry.day),start:PERIOD_START[entry.start-1],end:PERIOD_END[entry.end-1],
  title,location:locationLabel(entry),description:[entry.title,teacher(entry.teacherId)?.name].filter(Boolean).join('\n')
 });
 download('proskills-lich-hoc.ics',body,'text/calendar;charset=utf-8');
}
