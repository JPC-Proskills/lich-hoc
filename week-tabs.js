function weekTabColor(id){
 return C.WEEK_TAB_COLORS.find(color=>color.id===id)||C.WEEK_TAB_COLORS[0];
}
function weekTabStyle(color){
 return `--week-tab-bg:${color.background};--week-tab-text:${color.text}`;
}
function renderWeekTabs(weeks){
 const bar=$('#week-tabs');
 bar.hidden=!isTeacher();
 if(!isTeacher()){bar.replaceChildren();return;}
 const scroll=bar.scrollLeft;
 bar.innerHTML=`<button type="button" id="tab-add" aria-label="Tạo tuần mới" title="Tạo tuần mới">${icon('add')}</button>`+
  weeks.map(item=>{
   const selected=item.id===weekId,label=StudentCore.weekLabel(item.start);
   return `<button type="button" data-week="${esc(item.id)}" class="${selected?'active':''}" aria-pressed="${selected}"
    style="${weekTabStyle(weekTabColor(item.tabColor))}" title="Bấm chuột phải hoặc nhấn giữ để đổi màu tuần">
    ${!selected&&item.tabColor?'<span class="week-color-dot" aria-hidden="true"></span>':''}${label}
   </button>`;
  }).join('');
 bar.scrollLeft=scroll;
}
function editWeekTabColor(item){
 if(!requireTeacher()||$('#dialog').open)return;
 const label=StudentCore.weekLabel(item.start),selected=weekTabColor(item.tabColor);
 modal('Đổi màu tuần '+label,`<form id="week-color-form">
  <fieldset class="week-color-options"><legend>Chọn màu nền</legend>
   ${C.WEEK_TAB_COLORS.map(color=>`<label class="week-color-option">
    <input type="radio" name="week-tab-color" value="${color.id}" ${color.id===selected.id?'checked':''}>
    <span class="week-color-preview" style="${weekTabStyle(color)}" aria-hidden="true">${label}</span>
    <small>${color.name}</small>
   </label>`).join('')}
  </fieldset>
  <div class="form-actions"><button type="button" class="button" id="cancel-week-color">Hủy</button>
   <button type="submit" class="button primary">Lưu màu</button></div>
 </form>`);
 $('#cancel-week-color').onclick=close;
 $('#week-color-form').onsubmit=event=>{
  event.preventDefault();
  if(!requireTeacher())return;
  const value=$('[name="week-tab-color"]:checked')?.value;
  if(!C.WEEK_TAB_COLORS.some(color=>color.id===value))return;
  if(value!==selected.id){
   const previous=item.tabColor;
   item.tabColor=value;
   if(!save({touchSchedule:false})){
    if(previous===undefined)delete item.tabColor;else item.tabColor=previous;
    return;
   }
  }
  close();
  renderWeekTabs(accessibleWeeks());
  [...$('#week-tabs').querySelectorAll('[data-week]')].find(button=>button.dataset.week===item.id)?.focus({preventScroll:true});
 };
}

function wireWeekTabColors(){
 const bar=$('#week-tabs'),find=target=>target.closest('[data-week]');
 let hold=null,suppressClick=null;
 function cancelHold(){
  clearTimeout(hold?.timer);
  hold=null;
 }
 function open(button){
  if(!isTeacher()||!button?.isConnected||$('#dialog').open)return;
  const item=db.weeks.find(week=>week.id===button.dataset.week);
  if(!item)return;
  button.focus({preventScroll:true});
  editWeekTabColor(item);
 }
 bar.addEventListener('contextmenu',event=>{
  const button=find(event.target);
  if(!button||!isTeacher())return;
  event.preventDefault();
  if(hold||event.pointerType==='touch')suppressClick=button;
  cancelHold();
  open(button);
 });
 bar.addEventListener('keydown',event=>{
  const button=find(event.target);
  if(!button||event.key!=='ContextMenu'&&!(event.shiftKey&&event.key==='F10'))return;
  event.preventDefault();
  open(button);
 });
 bar.addEventListener('pointerdown',event=>{
  cancelHold();
  suppressClick=null;
  const button=find(event.target);
  if(!button||!isTeacher()||event.pointerType!=='touch'||!event.isPrimary)return;
  hold={x:event.clientX,y:event.clientY,timer:setTimeout(()=>{
   cancelHold();
   suppressClick=button;
   open(button);
  },575)};
 });
 bar.addEventListener('pointermove',event=>{
  if(hold&&Math.hypot(hold.x-event.clientX,hold.y-event.clientY)>10)cancelHold();
 });
 for(const type of ['pointerup','pointercancel','pointerleave','scroll'])bar.addEventListener(type,cancelHold);
 bar.addEventListener('click',event=>{
  if(suppressClick&&event.detail>0&&suppressClick===find(event.target)){
   event.preventDefault();
   event.stopPropagation();
   suppressClick=null;
  }
 });
}
