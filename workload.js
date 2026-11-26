/* The on-screen summary and CSV share the selected period and calculation. */
let workloadRange=null;
function workloadData(){
 const {from,to}=workloadRange||{from:week().start,to:C.addDays(week().start,6)};
 const sessions=C.sessionsBetween(db,from,to);
 const assigned=new Set(sessions.map(entry=>entry.teacherId));
 const details=db.teachers.map(item=>({
  name:item.name,visible:item.active||assigned.has(item.id),...C.workload(sessions,item.id)
 }));
 const day=details.reduce((sum,item)=>sum+item.day,0);
 const night=details.reduce((sum,item)=>sum+item.night,0);
 const confirmed=sessions.reduce((sum,entry)=>sum+(entry.status==='done'?entry.end-entry.start+1:0),0);
 return {from,to,details,day,night,confirmed};
}
function workloadPage(){
 const {from,to,details,day,night,confirmed}=workloadData();
 return `<form id="workload-filter" class="panel workload-filter">
  <div class="workload-fields">
   <label>Từ ngày<input type="date" id="workload-from" required value="${from}"></label>
   <label>Đến ngày<input type="date" id="workload-to" required value="${to}"></label>
   <button class="button primary small" type="submit">Áp dụng</button>
  </div>
  <div class="workload-shortcuts" aria-label="Khoảng thời gian">
   <button class="button small" type="button" id="workload-week" aria-pressed="${!workloadRange}">Tuần đang chọn</button>
   <button class="button small" type="button" id="workload-month">Tháng này</button>
  </div>
 </form>
 <div class="stats">${stat('☀',day,'Tiết ngày · 1–8')}${stat('☾',night,'Tiết tối · 9–12','purple')}
  ${stat('◷',day+night,'Tổng tiết đã xếp','blue')}${stat('✓',confirmed,'Tiết xác nhận đã dạy','orange')}</div>
 <section class="panel">
  <div class="section-heading"><div><h2>Phân bổ tiết dạy</h2>
   <p>${dateLabel(from)} – ${dateLabel(to)} · Số tiết theo thứ là tổng của các ngày tương ứng.</p></div>
   <button class="button small" id="workload-csv">Xuất CSV</button></div>
  <div class="table-wrap"><table><thead><tr><th>Giáo viên</th><th>Tổng tiết</th><th>Tiết ngày</th><th>Tiết tối</th>
   ${DAYS.map(d=>`<th>${d}</th>`).join('')}</tr></thead>
   <tbody>${details.filter(item=>item.visible).map(item=>`<tr><td><b>${esc(item.name)}</b></td><td class="work-total">${item.day+item.night}${workloadRange?'':`<div class="bar" aria-hidden="true"><i style="width:${Math.min(100,(item.day+item.night)/48*100)}%"></i></div>`}</td>
    <td>${item.day}</td><td>${item.night}</td>
    ${item.days.map(d=>`<td>${d.day||'–'} <span class="muted">/ ${d.night||'–'}</span></td>`).join('')}</tr>`).join('')}</tbody>
  </table></div>
 </section>
 <p class="form-note">Mỗi ô theo thứ ghi số tiết ngày / tối. Buổi đã hủy được loại khỏi tổng. Các buổi trùng lịch vẫn được cộng.</p>`;
}
function wireWorkload(){
 const form=$('#workload-filter');
 if(!form)return;
 const from=$('#workload-from'),to=$('#workload-to');
 function apply(range,target){
  rememberNavigation();
  workloadRange=range;
  render();
  $(target)?.focus({preventScroll:true});
 }
 from.oninput=to.oninput=()=>to.setCustomValidity('');
 form.onsubmit=event=>{
  event.preventDefault();
  if(from.value>to.value){
   to.setCustomValidity('Ngày kết thúc phải từ ngày bắt đầu trở đi.');
   to.reportValidity();
   return;
  }
  apply({from:from.value,to:to.value},'#workload-filter button[type=submit]');
 };
 $('#workload-week').onclick=()=>{if(workloadRange)apply(null,'#workload-week');};
 $('#workload-month').onclick=()=>{
  const today=todayVN(),[year,month]=today.split('-').map(Number);
  const from=today.slice(0,7)+'-01';
  const to=new Date(Date.UTC(year,month,0)).toISOString().slice(0,10);
  apply({from,to},'#workload-month');
 };
 $('#workload-csv').onclick=()=>{
  if(!requireTeacher())return;
  const {from,to,details}=workloadData();
  const rows=[['Giáo viên','Tổng tiết','Tiết ngày','Tiết tối',...DAYS.flatMap(d=>[d+' ngày',d+' tối'])],
   ...details.map(item=>[item.name,item.day+item.night,item.day,item.night,...item.days.flatMap(d=>[d.day,d.night])])];
  download(`cong-suat-${from}-den-${to}.csv`,csv(rows),'text/csv;charset=utf-8');
 };
}
