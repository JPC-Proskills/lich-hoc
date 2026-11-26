/* Stage curriculum order in the dialog until the teacher saves it. */
function editLessonOrder(){
 if(!requireTeacher())return;
 const curriculum=program(programId);
 if(!curriculum||curriculum.lessons.length<2)return;
 const original=curriculum.lessons;
 const byId=new Map(original.map(lesson=>[lesson.id,lesson]));
 modal('Đổi thứ tự chuyên đề',`<form id="lesson-order-form">
  <p class="form-note">${esc(curriculum.name)}. Kéo tay nắm hoặc dùng mũi tên. Thứ tự mới được dùng để gợi ý bài tiếp theo. Các buổi đã lưu giữ nguyên chuyên đề.</p>
  <ol id="lesson-order-list" class="lesson-order-list">${original.map(lesson=>{
   const label=StudentCore.firstLine(lesson.title);
   return `<li data-order-id="${esc(lesson.id)}"><span class="order-grip" aria-hidden="true" title="Kéo để đổi thứ tự">${icon('drag_indicator')}</span>
    <span class="order-number" aria-hidden="true"></span><span class="order-name">${esc(label)}</span>
    <div class="order-actions">
     <button type="button" class="button small" data-order-move="-1" aria-label="Đưa ${esc(label)} lên">${icon('keyboard_arrow_up')}</button>
     <button type="button" class="button small" data-order-move="1" aria-label="Đưa ${esc(label)} xuống">${icon('keyboard_arrow_down')}</button>
    </div></li>`;
  }).join('')}</ol>
  <div class="order-announcement" id="order-announcement" role="status"></div>
  <div class="form-actions"><button type="button" class="button" id="cancel-order">Hủy</button>
   <button type="submit" class="button primary" id="save-order" disabled>Lưu thứ tự</button></div>
 </form>`);
 const dialog=$('#dialog'),form=$('#lesson-order-form'),list=$('#lesson-order-list'),saveOrder=$('#save-order');
 let drag=null,frame=0,dropIndicator=null;
 function updateOrder(){
  const rows=[...list.children];
  saveOrder.disabled=rows.every((row,i)=>row.dataset.orderId===original[i].id);
  rows.forEach((row,i)=>{
   row.querySelector('.order-number').textContent=i+1;
   row.querySelector('[data-order-move="-1"]').disabled=i===0;
   row.querySelector('[data-order-move="1"]').disabled=i===rows.length-1;
  });
 }
 function move(row,before){
  if(row===before||row.nextElementSibling===before)return;
  list.insertBefore(row,before);
  updateOrder();
  $('#order-announcement').textContent='Vị trí mới: '+(Array.from(list.children).indexOf(row)+1);
 }
 function showDropIndicator(){
  dropIndicator?.classList.remove('order-before','order-after');
  const rows=[...list.children].filter(row=>row!==drag.row);
  drag.before=rows.find(row=>{
   const box=row.getBoundingClientRect();
   return drag.y<box.top+box.height/2;
  })||null;
  dropIndicator=drag.before||rows.at(-1);
  dropIndicator.classList.add(drag.before?'order-before':'order-after');
 }
 function scrollWhileDragging(){
  if(!drag?.active)return;
  const box=list.getBoundingClientRect();
  const offset=drag.y<box.top+36?-10:drag.y>box.bottom-36?10:0;
  if(offset){
   list.scrollTop+=offset;
   showDropIndicator();
  }
  frame=requestAnimationFrame(scrollWhileDragging);
 }
 function endDrag(){
  cancelAnimationFrame(frame);
  dropIndicator?.classList.remove('order-before','order-after');
  drag?.row.classList.remove('order-dragging');
  drag=null;
  dropIndicator=null;
 }
 list.onpointerdown=event=>{
  const grip=event.target.closest('.order-grip');
  if(!grip||!event.isPrimary||event.button!==0)return;
  event.preventDefault();
  drag={row:grip.closest('[data-order-id]'),pointer:event.pointerId,startY:event.clientY,y:event.clientY,active:false,before:null};
  list.setPointerCapture(event.pointerId);
 };
 list.onpointermove=event=>{
  if(!drag||event.pointerId!==drag.pointer)return;
  drag.y=event.clientY;
  if(!drag.active){
   if(Math.abs(drag.y-drag.startY)<5)return;
   drag.active=true;
   drag.row.classList.add('order-dragging');
   frame=requestAnimationFrame(scrollWhileDragging);
  }
  showDropIndicator();
 };
 list.onpointerup=event=>{
  if(!drag||event.pointerId!==drag.pointer)return;
  const {row,before,active}=drag;
  endDrag();
  if(active)move(row,before);
 };
 list.onpointercancel=endDrag;
 list.onlostpointercapture=endDrag;
 dialog.addEventListener('close',endDrag,{once:true});
 list.onclick=event=>{
  const button=event.target.closest('[data-order-move]');
  if(!button||button.disabled)return;
  const row=button.closest('[data-order-id]');
  move(row,button.dataset.orderMove==='-1'?row.previousElementSibling:row.nextElementSibling.nextElementSibling);
  const focus=button.disabled?row.querySelector('[data-order-move]:enabled'):button;
  focus?.focus();
 };
 $('#cancel-order').onclick=close;
 form.onsubmit=event=>{
  event.preventDefault();
  if(!requireTeacher()||saveOrder.disabled)return;
  const selected=week(),previousUpdate=db.updatedAt,previousWeekUpdate=selected.updatedAt;
  curriculum.lessons=[...list.children].map(row=>byId.get(row.dataset.orderId));
  if(!save()){
   curriculum.lessons=original;
   db.updatedAt=previousUpdate;
   selected.updatedAt=previousWeekUpdate;
   return;
  }
  close();
  render();
  $('#edit-lesson-order')?.focus({preventScroll:true});
  toast('Đã lưu thứ tự chuyên đề.');
 };
 updateOrder();
}
