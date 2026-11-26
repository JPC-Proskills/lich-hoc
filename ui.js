/* Icons and appearance preferences are independent of timetable data. */
function icon(name){return '<span class="mi" aria-hidden="true">'+name+'</span>'}
(function(){
 let preference='light';try{preference=localStorage.getItem('proskills-appearance')||'light'}catch{}
 const set=mode=>{document.documentElement.dataset.theme=mode;document.querySelector('meta[name="theme-color"]')?.setAttribute('content',mode==='dark'?(document.documentElement.dataset.role==='student'?'#18191B':'#262624'):(document.documentElement.dataset.role==='student'?'#F3F4F5':'#FAF9F5'));const b=document.getElementById('theme-toggle');if(b){b.innerHTML=icon(mode==='dark'?'light_mode':'dark_mode');b.setAttribute('aria-label',mode==='dark'?'Chuyển sang chế độ sáng':'Chuyển sang chế độ tối');b.title=b.getAttribute('aria-label');b.setAttribute('aria-pressed',String(mode==='dark'))}};
 set(preference==='dark'?'dark':'light');
 document.addEventListener('DOMContentLoaded',()=>{set(document.documentElement.dataset.theme);document.getElementById('theme-toggle').onclick=()=>{const mode=document.documentElement.dataset.theme==='dark'?'light':'dark';set(mode);try{localStorage.setItem('proskills-appearance',mode)}catch{}}});
})();
